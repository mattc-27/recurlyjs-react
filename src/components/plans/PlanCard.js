import React, { useState, useEffect } from 'react';

function PlanCard({ planName, price, onClick, code }) {

    const style = {
        selectBtn: {
            backgroundColor: 'rgb(43, 121, 90)',
            width: '80%',
            borderRadius: '50px',
            fontSize: '1.2em',
            fontWeight: '600',
            alignSelf: 'center',
            color: 'white',
            alignSelf: 'flex-end',
        }
    }

    return (
        <div className='plan-card' >
            <div className="card-title">
                <h2>{planName}</h2>
            </div>
            <div className="card-text">
                <p>${price}</p>
            </div>
            <div className='card-text row m-1 selectbtn'>
                <button
                    
                    // style={style.selectBtn}
                    value={code}
                    onClick={onClick}
                >
                    Select
                </button>
            </div>
        </div>
    );
}

export { PlanCard }