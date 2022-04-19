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

async function getResult(){
    let result = await callGecko();
    console.log(result);
    return result;
  }



function ShowWatchList(props)  {

    // set to default data
    const [rowData, setRowData] = useState();
    const [colDefs, setColDefs] = useState([
        {field: 'coin'},
        {field: 'price'},
        {field: 'description'}
        
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
        //const prices = callGecko();
        
          fetch(`${process.env.REACT_APP_BACKEND}/loadwatchlist`)
          .then(result => result.json())
          //.then(rowData => setRowData(rowData))
          .then(rowData => { 
            const prices =  getResult();
       
            prices.then(function(v) {
                console.log(JSON.parse(v)); // 1

                const jsonp = JSON.parse(v);
            
                rowData.coins.map(x=>console.log( x['coin']+' '+jsonp[x['coin']]));
                rowData.coins.forEach(function(x) {
                    x['price'] = jsonp[x['coin']];
                    console.log(jsonp[x['coin']]);
                });
                
                setRowData(rowData.coins);
              });
              
            //console.log(rowData.coins); setRowData(rowData.coins);
        })
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

export default withRouter(ShowWatchList);