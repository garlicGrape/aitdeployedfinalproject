import React, { useState, createContext } from 'react';

export const StockContext = createContext();

export const StockProvider = (props) => {
    const [selectedStock, setSelectedStock] = useState(null); // the stock user selects from the table

    return (
        <StockContext.Provider value={{selectedStock, setSelectedStock}}>
            {props.children}
        </StockContext.Provider>
    )

}