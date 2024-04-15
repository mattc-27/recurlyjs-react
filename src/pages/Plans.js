/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecurly, useCheckoutPricing } from '@recurly/react-recurly';
import { PlanCard } from '../components/plans/PlanCard';
import { PlanData } from '../data/plans';

export default function Plans() {

    const navigate = useNavigate();
    const location = useLocation();

    const formRef = React.useRef();
    const recurly = useRecurly();

    const [plansSelections, setPlansSelections] = useState('')
    const [selected, setSelected] = useState({ selected: '' });
    const [testPlans, setTestPlans] = useState()
    const [selectedCurrency, setSelectedCurrency] = useState('USD')


    useEffect(() => {
        setPlansSelections(PlanData.planNames);
        console.log(plansSelections)

    }, [])


    useEffect(() => {
        selected === '5a847f3681e6' || selected === '926e0130c1aa' ?
            navigate("/select-options", { state: selected })
            : console.log('asdf')
    }, [selected])


    return (
        <div className='page-container'>
            <div className='main-content-row items-start'>

                {plansSelections ?
                    plansSelections.map((item) => (
                        <PlanCard
                            key={item.code}
                            planName={item.name}
                            price={item.price}
                            code={item.code}
                            onClick={e => setSelected(e.target.value)}
                        />
                    ))
                    : null}
            </div>
        </div>
    );
}

