// JavaScript Example: Reading Entities
// Filterable fields: customer_email, customer_name, customer_phone, delivery_address, pizza_base, sauce, cheese, toppings, total_price, status, special_instructions, estimated_delivery
async function fetchOrderEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68a7545c1bd5a111d65d34b6/entities/Order`, {
        headers: {
            'api_key': '5cee5299004742998d9425143f63ec8e', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: customer_email, customer_name, customer_phone, delivery_address, pizza_base, sauce, cheese, toppings, total_price, status, special_instructions, estimated_delivery
async function updateOrderEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68a7545c1bd5a111d65d34b6/entities/Order/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '5cee5299004742998d9425143f63ec8e', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}