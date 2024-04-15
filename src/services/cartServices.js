 
 
 
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


export { addToCart }