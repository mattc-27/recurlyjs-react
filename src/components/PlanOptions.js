import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecurly, useCheckoutPricing } from '@recurly/react-recurly';
import PlanAddon from './plans/PlanAddon';
import { CartTable, TableAddon } from './plans/checkout/Tables';
import { PlanData } from '../data/plans';

export default function PlanOptions() {

    const navigate = useNavigate();
    const location = useLocation();

    const formRef = React.useRef();
    const recurly = useRecurly();

    const [recurlyError, setRecurlyError] = useState(null);
    const [{ price, loading }, setPricing] = useCheckoutPricing(null, setRecurlyError);

    const [planAddOns, setPlanAddOns] = useState([]);

    const showPrice = !loading && !recurlyError;

    console.log(location.state);


    /// Pricing
    const [pricingFormState, setPricingFormState] = useState({
        plan: '' || location.state,
        planQuantity: 1,
        currency: 'USD',
        addons: []
    });

    // Fetch plan details
    const planName = PlanData.planNames.find(({ code }) => code === pricingFormState.plan)

    // Plan add-on selections: add/remove
    const addOnList = PlanData.addOnNames
        .map((item) => (
            <PlanAddon
                key={item.id}
                name={item.name}
                code={item.code}
                addToCart={addToCart}
                removeItem={removeItem}
            />
        ));

    // Add-ons for cart
    const addOnsCart = pricingFormState.addons.map((addon, i) => (
        <TableAddon
            key={addon.name}
            name={addon.name}
            quantity={addon.quantity}
        />
    ));

    // Add item to cart
    function addToCart(newItem) {
        if (planAddOns.some(addOn => addOn.code === newItem.code)) {
            setPlanAddOns(cart => cart.map(addOn => addOn.code === newItem.code
                ? { ...addOn, quantity: addOn.quantity + 1 }
                : addOn,
            ))
        } else {
            setPlanAddOns(cart => [...cart, newItem]);
        }
    }

    // Remove item from cart
    function removeItem(newItem) {
        if (planAddOns.some(addOn => addOn.code === newItem.code)) {
            setPlanAddOns(cart => cart.map(addOn => addOn.code === newItem.code
                ? { ...addOn, quantity: addOn.quantity - 1 }
                : addOn,
            ))
        } else {
            setPlanAddOns(cart => [...cart, newItem]);
        }
    }

    // Set pricing 
    useEffect(() => {
        setRecurlyError(null);
        const subscriptions = pricingFormState.plan ? [{
            plan: pricingFormState.plan,
            quantity: pricingFormState.planQuantity,
            addons: pricingFormState.addons
        }] : [];
        setPricing({ ...pricingFormState, subscriptions });
        console.log(price);
    }, [setPricing, setPricingFormState, pricingFormState]);


    // Set pricing
    useEffect(() => {
        handleChange('addons', planAddOns)
        console.log(planAddOns);
    }, [setPlanAddOns, planAddOns])


    function handleChange(name, value) {
        const newState = { ...pricingFormState, [name]: value };
        setPricingFormState(newState);

    }


    return (
        <div className='container'>
            <div className='page-container'>
                <div className='main-content-row'>
                    <div className='plan-options-container'>
                        <div className='plan-addons'>
                            <label>Plan Quantity</label>
                            <input

                                type="number"
                                value={pricingFormState.planQuantity}
                                onChange={e => handleChange('planQuantity', e.target.value)}
                                placeholder={pricingFormState.planQuantity}
                                min="0"
                            />
                        </div>
                        <div className='plan-options-col'>
                            <label>Plan Add-on's</label>
                            {addOnList}
                        </div>
                        <div className='main-content-row'>
                            <button id='proceedButton'
                                onClick={() => navigate('/checkout', { state: { ...pricingFormState, price, planName } })}
                            >
                                Proceed to checkout
                            </button>
                        </div>
                    </div>
                    <div className='container-cart'>
                        <h2>Cart</h2>
                        <CartTable selectedPlan={pricingFormState.planQuantity}
                            planName={planName.name}
                            addOnsCart={addOnsCart}
                            price={price}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
