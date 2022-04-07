import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Input, Button } from 'reactstrap';
import { StockContext } from './StockContext';

import CoinGecko from  'coingecko-api';

const columns = [
    { headerName: "Date", field: "timestamp", sortable: true },
    { headerName: "Open", field: "open", sortable: true, filter: "agNumberColumnFilter" },
    { headerName: "High", field: "high", sortable: true, filter: "agNumberColumnFilter" },
    { headerName: "Low", field: "low", sortable: true, filter: "agNumberColumnFilter" },
    { headerName: "Close", field: "close", sortable: true, filter: "agNumberColumnFilter" },
    { headerName: "Volumes", field: "volumes", sortable: true, filter: "agNumberColumnFilter" },
];

async function calGecko(){
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
    console.log(_coinList);
    return _coinList;
}

function StockDetail(props) {
    const { symbol } = useParams();

    const [stockHistory, setStockHistory] = useState([]); // save all the original data, won't be changed later
    const [startDate, setStartDate] = useState(""); // start date user selects from the calendar widget

    const { selectedStock } = useContext(StockContext);


    useEffect(() => {
        //fetch(`http://131.181.190.87:3001/history?symbol=${symbol}`)
        calGecko()
            .then(res => res.json())
            .then(data => {
                data.forEach(record => {
                    // record.timestamp is something like "2020-03-23T14:00:00.000Z"
                    record.timestamp = record.timestamp.split("T")[0]
                });

                setStockHistory(data);
            })
    }, [symbol]) // symbol is one dependency


    return (
        <div className="container mt-3">

            <h2>{selectedStock ? selectedStock.name : "(company name)"} [{symbol}] </h2>

            <div className="d-flex">
                <span style={{ paddingTop: 5 }}>Select Date From:</span>
                <Input style={{ width: 200 }} type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                <Button color="primary" className="ml-2" onClick={() => setStartDate("")}>Reset</Button>
            </div>

            <div
                className="ag-theme-balham"
                style={{
                    height: "362px",
                    width: "100%",
                    marginTop: 20,
                    marginBottom: 20,
                }}
            > {/* ag-grid-table */}

                <AgGridReact
                    columnDefs={columns}
                    rowData={stockHistory.filter(record => record.timestamp > startDate)}
                    pagination={true}
                    paginationPageSize={10}
                />
            </div>

            <ResponsiveContainer width="100%" height={300} >
                <LineChart
                    margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
                    data={stockHistory.filter(record => record.timestamp > startDate).reverse()}
                >
                    <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Legend verticalAlign="top" formatter={() => <span>Closing Price</span>} />
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>


        </div>
    )
}


export default StockDetail;