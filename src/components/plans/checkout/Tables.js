/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
//import { useLocation, useNavigate } from 'react-router-dom';
import { useCheckoutPricing } from '@recurly/react-recurly';

// eslint-disable-next-line react/prop-types
export function CartTable(props) {

    const [recurlyError, setRecurlyError] = useState(null);
    const [{ price, loading }, setPricing] = useCheckoutPricing(null, setRecurlyError);

    const showPrice = !loading && !recurlyError;

    return (
        <div className='cart-table'>
            <table>
                <tbody>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                    </tr>
                    <tr>
                        <td className="r1">{props.planName}</td>
                        <td className="r2">{props.selectedPlan}</td>
                    </tr>
                    {/* */}
                    {props.addOnsCart}
                    {/* */}
                    {recurlyError ? <span style={{ color: 'red' }}>{recurlyError.message}</span> : ''}
                    {showPrice ? (
                        <tr >
                            <td className="r1" style={{ borderTop: '1px solid #252525' }}>Subtotal: </td>
                            <td className="r2" style={{ borderTop: '1px solid #252525' }}>{`${price.currency.symbol}${props.price.now.subtotal}`}</td>
                        </tr>
                    ) : null}
                    {loading && 'Loading'}
                </tbody>
            </table>
        </div>
    );
}


export function TableAddon(props) {


    return (
        <>
            <tr key={props.name}>
                <td className="r2">{props.name}</td>
                <td className="r2">{props.quantity}</td>
            </tr>
        </>

    );
}


export function PricingTable(props) {

    return (

        <div className='cart-table'>
            {props.pricingFormState &&
                <table>
                    <tbody>
                        <tr>
                            <th>
                                Item
                            </th>
                            <th>
                                Quantity
                            </th>
                        </tr>
                        <tr>
                            <td className="r1">{props.pricingFormState.plan}</td>
                            <td className="r2">{props.pricingFormState.planQuantity}</td>
                        </tr>
                        {props.pricingFormState.addons &&
                            // eslint-disable-next-line no-unused-vars
                            props.pricingFormState.addons.map((addon, i) => (
                                // eslint-disable-next-line react/jsx-key
                                <tr>
                                    <td className="r1">{addon.name}</td>
                                    <td className="r2">{addon.quantity}</td>
                                </tr>
                            ))
                        }
                        <tr>
                            <td className="r1" style={{ borderTop: '1px solid #252525' }}>Subtotal: </td>
                            <td className="r2" style={{ borderTop: '1px solid #252525' }}>{`${props.price.currency.symbol}${props.price.now.subtotal}`}</td>
                        </tr>
                    </tbody>
                </table>
            }
        </div>
    );
}