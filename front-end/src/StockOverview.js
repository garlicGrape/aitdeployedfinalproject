/*import React, { useState, useEffect, useContext } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { useHistory, withRouter } from 'react-router-dom';
import { FormGroup, Label, Input } from 'reactstrap';
import { StockContext } from './StockContext';

import CoinGecko from  'coingecko-api';

const columns = [
    { headerName: "Symbol", field: "symbol", sortable: true },
    { headerName: "Name", field: "name", sortable: true, "filter": true },
    { headerName: "Industry", field: "industry", sortable: true, "filter": true }
];

const industries = ["Health Care", "Industrials", "Consumer Discretionary", "Information Technology",
    "Consumer Staples", "Utilities", "Financials", "Real Estate", "Materials", "Energy", "Telecommunication Services"]

    async function callGecko(){
        const CoinGeckoClient = new CoinGecko();
        let data = await CoinGeckoClient.exchanges.fetchTickers('bitfinex', {
            coin_ids: ['bitcoin', 'ethereum', 'ripple', 'litecoin', 'stellar']
        });
        var _coinList = {};
        var _datacc = data.data.tickers.filter(t => t.target === 'USD');
        [
            'BTC',
            'ETH',
            'XRP',
            'LTC',
            'XLM'
        ].forEach((i) => {
            var _temp = _datacc.filter(t => t.base === i);
            var _res = _temp.length === 0 ? [] : _temp[0];
            _coinList[i] = _res.last;
        })
        //console.log(_coinList);
        return JSON.stringify(_coinList);
    }

function StockOverview(props) {

    const [stocks, setStocks] = useState([{stock: {symbol:'BTC', name:'BitCoin', industry:'Crypto'} },{stock: {symbol:'ETH', name:'Ethereum', industry:'Crypto'} }]); // all stocks, is used to save all the original data, would not be changed even when a user searches
    const [searchStockSymbol, setSearchStockSymbol] = useState(""); // the search text user enter in the text box
    const { path } = props.match; // "/stock"
    const history = useHistory();
    const { setSelectedStock } = useContext(StockContext);

    //const [stocks] = useState([{stock: {symbol:'BTC', name:'BitCoin', industry:'Crypto'} },{stock: {symbol:'ETH', name:'Ethereum', industry:'Crypto'} }]);

    useEffect(() => {
        //fetch('http://131.181.190.87:3001/all')
        callGecko()
            //.then(res => res.json())
            .then(data => {
                
                console.log(data);
                
                //setStocks(data);
            })
    }, []) //[] means no dependencies, treated as componentDidMount in class component, only render once


    const onIndustrySelectChange = (value) => {
        let url = `http://131.181.190.87:3001/industry?industry=${value}`; // url to fetch stocks belong to a particular industry

        // if value is "all", which means the option is "In All Industries", fetch all data again
        if (value === "all") url = "http://131.181.190.87:3001/all";

        fetch(url)
            .then(res => res.json())
            .then(data => {
                //setStocks(data);
            })
    }


    // navigate to stock detail page
    const handleSearchStockDetail = (stock) => { // stock: {symbol:xxx, name:xxx, industry:xxx}
        history.push(`${path}/${stock.symbol}`);
        setSelectedStock(stock);
    }
 //rowData={stocks.filter(stock => RegExp(searchStockSymbol, "i").test(stock.symbol))}

    return (
        <div className="container mt-3">
            <h2>Stock Overview</h2>

            <div className="d-flex justify-content-around">
                <FormGroup>
                    <Label for="stockCode">search stock</Label>
                    <Input
                        type="text"
                        placeholder="e.g. AAPL"
                        name="stockCode"
                        id="stockCode"
                        value={searchStockSymbol}
                        onChange={(event) => setSearchStockSymbol(event.target.value.replace('\\',''))} // event.target.value is the text user entered
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="industry">select an industry</Label>
                    <Input
                        type="select"
                        name="industry"
                        id="industry"
                        onChange={(event) => onIndustrySelectChange(event.target.value)}>

                        <option value="all">All Industries</option>
                        {industries.map(industry => <option value={industry} key={industry}>{industry}</option>)}

                    </Input>
                </FormGroup>
            </div>

            <div
                className="ag-theme-balham mx-auto ag-theme-alpine "
                style={{
                    height: "650px",
                    width: "600px",
                   marginTop: 50,
                   boxSizing: "border-box"
                }}
            
            >
                <AgGridReact 
                    columnDefs={columns}
        
                    rowData ={stocks}
                    pagination={true}
                    paginationPageSize={20}
                    //onGridReady={this.onGridReady.bind(this)}
                    //onCellClicked={(params) => handleSearchStockDetail(params.data)}
                    onCellClicked={(params) => console.log(params.data)}
                
                />

            </div>

        </div>
    );
}*/

import React, {useState} from 'react';
import {AgGridReact} from 'ag-grid-react';
import { useHistory, withRouter } from 'react-router-dom';
import CoinGecko from  'coingecko-api';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// Create Singleton entries for the data ad ColumnDefs

// const InitialRowData = [
//     {make: "Toyota", model: "Celica", price: 35000},
//     {make: "Ford", model: "Mondeo", price: 32000},
//     {make: "Porsche", model: "Boxter", price: 72000}
// ];



function StockOverview(props)  {

    // set to default data
    const [rowData, setRowData] = useState();
    const [colDefs, setColDefs] = useState([
        {field: 'symbol'},
        {field: 'bidPrice'},{field: 'askPrice'},
        {field: 'lastPrice', editable: 'true'},
    ]);

    // Uncomment this to see the changing column data in action
    // React.useEffect(
    //     ()=> {
    //     const changeColsTimer = setTimeout(() =>{
    //         setColDefs([{field: 'make'},{field: 'model'}])
    //         },3000);
    //     return ()=>clearTimeout(changeColsTimer);
    //         }
    // ,[]);

    // load the data after the grid has been setup
    //[] means on first render so no need to memo the results at this point
    React.useEffect(() => {
        //fetch('https://www.ag-grid.com/example-assets/row-data.json')
        fetch('https://api2.binance.com/api/v3/ticker/24hr')
            .then(result => result.json())
            .then(rowData => setRowData(rowData))
    }, []);

   return (
       <div className="ag-theme-alpine" style={{height: 400, width: 800}}>   
           <AgGridReact
                defaultColDef={{sortable: true, filter: true }}
                pagination={true}
                rowData={rowData}
                columnDefs={colDefs}>
           </AgGridReact>
       </div>
       
   )

};

export default withRouter(StockOverview);