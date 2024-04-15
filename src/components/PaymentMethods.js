import React, { useState, useEffect } from "react";

export default function PaymentMethods({ handleOptionChange, selectedOption }) {






    return (

        <div className='main-content-col payment-selection' style={{ borderTop: '1px solid #252525', margin: '1%' }}>

            <h1>Select payment method</h1>
            <div className='main-content-row'>

                <div className='select-payment-method'>
                    <label>Card</label>
                    <input
                        type="checkbox"
                        checked={selectedOption === 'card'}
                        onChange={() => handleOptionChange('card')}
                        className='select-check'
                    />
                </div>
                <div className='select-payment-method'>
                    <label>Bank</label>
                    <input
                        type="checkbox"
                        checked={selectedOption === 'bank'}
                        onChange={() => handleOptionChange('bank')}
                        className='select-check'
                    />
                </div>

            </div>
        </div>
    )
}