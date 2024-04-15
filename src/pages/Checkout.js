/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useRecurly, useCheckoutPricing, ThreeDSecureAction } from '@recurly/react-recurly';

import { PricingTable } from '../components/plans/checkout/Tables';
import { FormInput, FormInputRow } from '../components/FormComponents';

import PaymentMethods from '../components/PaymentMethods';

import uuid from 'react-uuid';

export default function Checkout() {

    {/*        */ }
    const navigate = useNavigate();
    const location = useLocation();

    const formRef = React.useRef();
    const recurly = useRecurly();

    const { braintreeAuth } = { clientAuthorization: 'sandbox_8hwqf2nm_frnwqj32cdjq89f2', webAuthentication: true }

    const [recurlyError, setRecurlyError] = useState(null);
    const [{ price, loading }, setPricing] = useCheckoutPricing(null, setRecurlyError);

    const showPrice = !loading && !recurlyError;

    //const zipCode = chance.zip();

    {/*        */ }
    const [pricingFormState, setPricingFormState] = useState({});
    const [purchaseReq, setPurchaseReq] = useState();
    const [purchaseReqBody, setPurchaseReqBody] = useState('');

    {/*        */ }

    const [paymentMethodCC, setPaymentMethodCC] = useState(true)
    const [paymentMethodBank, setPaymentMethodBank] = useState(false)

    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const clearForm = () => {
        setSelectedOption(null);
    };

    const [paymentMethod, setPaymentMethod] = useState('');

    {/*        */ }
    const [accountAddress, setAccountAddress] = useState({ a: '' })

    const [accountFormState, setAccountFormState] = useState({
        firstName: '',
        lastName: '',
        street1: '',
        postalCode: '',
        city: '',
        region: '',
        country: '',
    });

    function handleChange(name, value) {
        setAccountFormState(prevState => ({ ...prevState, [name]: value }));
    }

    {/*        */ }
    const [bankAccountInfo, setBankAccountInfo] = useState({
        name_on_account: 'Test User',
        account_type: 'checking',
        account_number: '111111111',
        account_number_confirmation: '111111111',
        routing_number: '123456780'
    });

    function handleAccountForm(name, value) {
        setBankAccountInfo(prevState => ({ ...prevState, [name]: value }));
    }
    useEffect(() => {
        console.log(bankAccountInfo);
        setBankAccountInfo()
    }, [bankAccountInfo, setBankAccountInfo])


    {/*        */ }
    const [actionTokenId, setActionTokenId] = useState('');
    const [resultToken, setResultToken] = useState('');
    //const handleChangeActionToken = () => setActionTokenId(data.threeDSecureActionTokenId);

    {/*        */ }
    useEffect(() => {
        console.log(location.state);
        setPricingFormState(location.state)
    }, [])


    {/*        */ }
    useEffect(() => {
        setRecurlyError(null);
        const subscriptions = pricingFormState.plan ? [{
            plan: pricingFormState.plan,
            quantity: pricingFormState.planQuantity,
            addons: pricingFormState.addons,

        }] : [];
        setPricing({ ...pricingFormState, subscriptions });
        //console.log(pricingFormState, price);
    }, [setPricing, pricingFormState]);


    {/*        */ }
    const handleSubmit = event => {
        if (event.preventDefault) event.preventDefault();
        if (selectedOption === 'bank') {
            recurly.bankAccount.token(formRef.current, (err, token) => {
                if (err) console.log('[error]', err);
                else {
                    const body = ({
                        accountCode: uuid(),
                        // firstName: input
                        accountInfo: accountAddress,
                        token_id: token.id,
                        plan_code: pricingFormState.plan, plan_quantity: pricingFormState.planQuantity,
                        plan_addons: pricingFormState.addons
                    })
                    setPurchaseReqBody({ ...body })
                    sendBody({ ...body })
                }
            })
        }
        else {
            recurly.token(formRef.current, (err, token) => {
                if (err) console.log('[error]', err);
                else {
                    const body = ({
                        accountCode: uuid(),
                        // firstName: input
                        accountInfo: accountAddress,
                        token_id: token.id,
                        plan_code: pricingFormState.plan, plan_quantity: pricingFormState.planQuantity,
                        plan_addons: pricingFormState.addons
                    })
                    setPurchaseReqBody({ ...body })
                    sendBody({ ...body })
                }
            })
        }
    }

    {/*      */ }
    const sendBody = async ({ ...body }) => {
        console.log({ ...body })
        const response = await fetch('/api/subscriptions/new',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...body })
            })
        const data = await response.json();
        if (data.threeDSecure === true) {
            console.log(data)
            setActionTokenId(data.threeDSecureActionTokenId)
            setPurchaseReq({ ...body })
        } else {
            console.log('Successful purchase', data.invoiceCollection);
            const accountId = data.invoiceCollection.account.id;
            navigate(`/success/${accountId}`, { state: { ...data.invoiceCollection } });
        }
    }


    {/* 3D Secure        */ }
    useEffect(() => {
        console.log(actionTokenId)
    }, [setActionTokenId, actionTokenId])

    const handleThreeDSecureToken = token =>
        setResultToken(`${token.id}`);

    const sendBodyThree = async ({ purchaseReqBody }) => {
        console.log({ purchaseReqBody })
        const response = await fetch('http://localhost:9001/api/subscriptions/3ds',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ purchaseReqBody })
            })
        const data = await response.json();
        if (data.threeDSecure === true) {
            console.log(data)
            setActionTokenId(data.threeDSecureActionTokenId)
            setPurchaseReq({ ...body })
        } else {
            console.log('Successful purchase', data.invoiceCollection);
            const accountId = data.invoiceCollection.account.id;
            navigate(`/success/${accountId}`, { state: { ...data.invoiceCollection } });
        }
    }

    {/* resultToken      */ }
    useEffect(() => {
        console.log(resultToken)
        async function threeDSecurePurchase() {
            try {
                await newPurchase(resultToken)
                //const body = ({ ...purchaseReqBody })
                console.log({ ...purchaseReqBody })
            } catch (error) {
                console.error(error.message)
            }
        }
        threeDSecurePurchase()
    }, [setResultToken, resultToken])

    useEffect(() => {
        console.log(purchaseReqBody)
        sendBodyThree(purchaseReqBody);
    }, [setPurchaseReqBody, purchaseReqBody])

    const newPurchase = (name, value) => {
        setPurchaseReqBody({ ...purchaseReq, ['three_d_secure_action_result_token_id']: resultToken });
        return { ...purchaseReqBody }
    }

    useEffect(() => {
        if (paymentMethod === 'bank') {
            setPaymentMethodBank(true)

            setPaymentMethodCC(false)
        } else
            setPaymentMethodBank(false)

        setPaymentMethodCC(true)
    }, [setPaymentMethod])


    return (
        <div className='container'>
            <form ref={formRef} onSubmit={handleSubmit} className='main-content-row w-100' style={{ marginTop: '5%' }}>
                <div className='checkout-col'>
                    <>
                        <div className='form-row'>
                            <FormInput
                                label={'First name'}
                                placeholder={'First name'}
                                //defaultValue={'First'}
                                name='firstName'
                                onChange={e => handleChange('firstName', e.target.value)}
                                type={'text'}
                                dataRecurly="first_name"
                            />
                            <FormInput
                                label={'Last name'}
                                placeholder={'Last name'}
                                //defaultValue={'Last'}
                                name='lastName'
                                onChange={e => handleChange('lastName', e.target.value)}
                                type={'text'}
                                dataRecurly="last_name"
                            />
                        </div>
                        <div className='form-row'>
                            <FormInput
                                label={'Address 1'}
                                defaultValue={'9581'}
                                name='address1'
                                onChange={e => handleChange('street1', e.target.value)}
                                type={'text'}
                                dataRecurly="address1"
                                id='addr'
                            />
                        </div>
                        <div className='form-row'>
                            <FormInput
                                label={'City'}
                                defaultValue={'Fargo'}
                                name='city'
                                onChange={e => handleChange('city', e.target.value)}
                                type={'text'}
                                dataRecurly="city"
                            />

                            <FormInput
                                label={'State/Province'}
                                defaultValue={'ND'}
                                name='region'
                                onChange={e => handleChange('region', e.target.value)}
                                type={'text'}
                                dataRecurly="state"
                            />
                        </div>
                        <div className='form-row'>
                            <FormInput
                                label={'Postal code'}
                                defaultValue={'58106'}
                                name='postalCode'
                                onChange={e => handleChange('postalCode', e.target.value)}
                                type={'text'}
                                dataRecurly="postal_code"
                            />
                            <FormInput
                                label={'Country'}
                                placeholder={'US'}
                                defaultValue={'US'}
                                name='Country'
                                onChange={e => handleChange('country', e.target.value)}
                                type={'text'}
                                dataRecurly="country"
                            />
                        </div>
                    </>
                    {/*   payment method selector */}
                    <PaymentMethods handleOptionChange={handleOptionChange} selectedOption={selectedOption} />
                    {/*   payment method selector  */}
                    <div className='payment-form-container '>
                        {selectedOption && (
                            <>
                                {/* Render the form for the selected payment option */}
                                {selectedOption === 'bank' ?
                                    <>
                                        <FormInput
                                            label={'Name on account'}
                                            //placeholder={'Test User'}
                                            defaultValue={'Test User'}
                                            name='name_on_account'
                                            onChange={e => handleAccountForm('name_on_account', e.target.value)}
                                            type={'text'}
                                            dataRecurly="name_on_account"
                                        />
                                        <FormInput
                                            label={'Account Number'}
                                            placeholder={'Account Number'}
                                            defaultValue={'123456789'}
                                            name='account_number'
                                            onChange={e => handleAccountForm('account_number', e.target.value)}
                                            type={'text'}
                                            dataRecurly="account_number"
                                        />
                                        <FormInput
                                            label={'Account Number Confirmation'}
                                            placeholder={'Account Number Confirmation'}
                                            defaultValue={'123456789'}
                                            name='account_number_confirmation'
                                            onChange={e => handleAccountForm('account_number_confirmation', e.target.value)}
                                            type={'text'}
                                            dataRecurly="account_number_confirmation"
                                        />
                                        <FormInput
                                            label={'Routing number'}
                                            placeholder={'Routing number'}
                                            defaultValue={'011000138'}
                                            name='routing_number'
                                            onChange={e => handleAccountForm('routing_number', e.target.value)}
                                            type={'text'}
                                            dataRecurly="routing_number"
                                        />
                                        <FormInput
                                            label={'Account type'}
                                            defaultValue={'checking'}
                                            name='account_type'
                                            onChange={e => handleAccountForm('account_type', e.target.value)}
                                            type={'text'}
                                            dataRecurly="account_type"
                                        />
                                    </>
                                    :
                                    <CardElement />
                                }
                            </>
                        )}
                    </div>
                </div>
                <div className='container-cart checkout-col'>
                    <h2>Cart</h2>
                    {recurlyError ? <span style={{ color: 'red' }}>{recurlyError.message}</span> : ''}
                    {showPrice ? (
                        <PricingTable pricingFormState={pricingFormState} price={price} />
                    ) : null}
                    {loading && 'Loading'}
                    <button id='checkoutButton' type="submit" onSubmit={handleSubmit}>Complete Checkout</button>
                </div>
                {
                    actionTokenId ? (
                        <div>
                            <ThreeDSecureAction
                                actionTokenId={actionTokenId}
                                onToken={handleThreeDSecureToken}
                                className="recurly-three-d-secure-action"
                            />
                        </div>
                    ) : null
                }
            </form>
        </div>
    );
}


