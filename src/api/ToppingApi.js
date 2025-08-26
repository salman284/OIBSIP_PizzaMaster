// JavaScript Example: Reading Entities
// Filterable fields: name, description, price, stock, min_threshold, category, image_url
async function fetchToppingEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68a7545c1bd5a111d65d34b6/entities/Topping`, {
        headers: {
            'api_key': '5cee5299004742998d9425143f63ec8e', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, description, price, stock, min_threshold, category, image_url
async function updateToppingEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68a7545c1bd5a111d65d34b6/entities/Topping/${entityId}`, {
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