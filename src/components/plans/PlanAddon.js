import React, { useState, useEffect } from 'react';
import { addToCart } from '../../services/cartServices';

export default function PlanAddon(props) {

    return (
        <div className='plan-addons'>
            <label>{props.name}</label>
            
               <div className='row content-between items-center w-100'>
               <button
                    onClick={() => props.addToCart({ code: props.code, name: props.name, quantity: 1 })}>
                    Add (+1)
                </button>
                <button
                    onClick={() => props.removeItem({ code: props.code, name: props.name, quantity: 1 })}>
                    Remove (-1)
                </button>
               </div>
        </div>
    );
}