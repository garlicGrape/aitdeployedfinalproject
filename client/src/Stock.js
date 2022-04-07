import React from 'react';
import { Switch, Route } from 'react-router-dom';
import StockOverview from './StockOverview';
import StockDetail from './StockDetail';
import { StockProvider } from './StockContext';
import StockDisplay from './StockDisplay';

function Stock(props) {
    const { path } = props.match;


    return (
        <StockProvider>
            <Switch>
                
                <Route exact path={path} component={StockOverview} />
                <Route path={`${path}/:symbol`} component={StockDetail} />
            </Switch>
        </StockProvider>
    )
}


export default Stock;