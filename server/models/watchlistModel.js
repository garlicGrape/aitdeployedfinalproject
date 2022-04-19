const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
    coin: {
      type: String,
      unique: true
    },
    description: String
});

module.exports = mongoose.model('WatchList', watchlistSchema);