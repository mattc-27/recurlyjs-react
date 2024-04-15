import React, { useState } from 'react';
import uuid from 'react-uuid';
import { Link } from 'react-router-dom';
import { getAccount, formatSearch } from './services/accountServices';

export default function Home() {

    const [show, setShow] = useState(false);

    function handleShow() {
        if (!show) {
            setShow(true)
        } else setShow(false)
    }

    const [accountSearch, setAccountSearch] = useState('');
    const [accountDetails, setAccountDetails] = useState('');

    async function handleClick() {
        try {
            const query = await formatSearch(accountSearch)
            const accountData = await getAccount(query)
            setAccountDetails(accountData);
        } catch (error) {
            console.error(error.message)
        }
    }


    return (
        <div className='container'>
            <div className='page-container'>
                <div className='main-content-row'>
                    <div className='main-content-col border-l'>

                        <Link className='home-link rjs' to={'/select-plan'}>Recurly.js checkout 💳 </Link>

                        <Link className='home-link hosted-link' to={`https://highaltitude-dev.recurly.com/subscribe/5a847f3681e6?currency=USD/?account_code=${uuid()}`}>Hosted checkout | Basic</Link>

                        <Link className='home-link hosted-link' to={`https://highaltitude-dev.recurly.com/subscribe/926e0130c1aa?currency=USD/?account_code=${uuid()}`}>Hosted checkout | Annual</Link>

                    </div>
                    <div className='main-content-col border-l' >

                        <Link className='home-link account-link' onClick={handleShow}>Account search 🔎 </Link>

                        {show ?
                            <>
                                <div className='account-search'>
                                    <input type='text'
                                        name='input'
                                        value={accountSearch || ''}

                                        onChange={e => setAccountSearch(e.target.value)}
                                    />
                                    <button
                                        className='accountSearchBtn'
                                        onClick={handleClick}>
                                        Search</button>
                                </div>
                                {accountDetails &&
                                    <div className='account-search-results'>
                                        <p>Account code:</p>
                                        <Link className='accountLink' to={`/`}>{accountDetails.code}</Link>
                                    </div>
                                }
                            </>
                            : null}
                    </div>
                </div>
            </div>
        </div>
    );
}