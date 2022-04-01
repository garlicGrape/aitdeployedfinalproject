const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
  passportLocalMongoose = require('passport-local-mongoose'),
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
	address: {type: String, required: true},
	portfolio:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'portfolio' }]
});

UserSchema.pre('save', function(next) {
    const user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});


});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};



const Wallets = new mongoose.Schema({
  users:[UserSchema],
});

const PortfolioComponent = new mongoose.Schema({
	coin: {type: String, required: true},
	quantity: {type: Number, min: 1, required: true},
}, {
	_id: true
});


const Portfolio = new mongoose.Schema({
  address: {type: mongoose.Schema.Types.ObjectId, ref:'Wallet'},
  name: {type: String, required: true},
	createdAt: {type: Date, required: true},
	components: [PortfolioComponent]
});




Wallets.plugin(passportLocalMongoose);
Portfolio.plugin(URLSlugs('name'));

mongoose.model('Wallets', Wallets);
mongoose.model('UserSchema', UserSchema);
mongoose.model('Portfolio', Portfolio);
mongoose.model('PortfolioComponent', PortfolioComponent);
//mongoose.connect('mongodb://localhost/satoshiViewer'); //commenting out for now


module.exports = mongoose.model('User', UserSchema);
