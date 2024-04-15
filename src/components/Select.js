import React, { useState, useEffect } from 'react';

export function Select({ value, name, onChange, selectLabel, data }) {

    return (
        <div className='filter-select'>
            <label >{selectLabel}</label>
            <select className='filter-option' data={data} value={value} name={name} onChange={onChange}>
                {data.map((option) => (
                    <option key={option.value} value={option.value} >{option.name}</option>
                ))}
            </select>
        </div>
    )
}