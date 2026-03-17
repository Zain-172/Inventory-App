export async function insertSale(saleData) {
    const response = await fetch("http://localhost:5000/sale", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
    });
    return response.json();
}

export async function getSales() {
    const response = await fetch("http://localhost:5000/sale");
    return response.json();
}

export async function getSaleById(saleId) {
    const response = await fetch(`http://localhost:5000/sale/${saleId}`);
    return response.json();
}

export async function deleteSale(saleId) {
    const response = await fetch(`http://localhost:5000/sale/${saleId}`, {
        method: 'DELETE',
    });
    return response.json();
}

export async function updateSale(saleId, saleData) {
    const response = await fetch(`http://localhost:5000/sale/${saleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
    });
    return response.json();
}

export async function updateSaleStatus(saleId, status) {
    const response = await fetch(`http://localhost:5000/sale/${saleId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to update sale status' }));
        throw new Error(error.message || 'Failed to update sale status');
    }

    return response.json();
}

export async function updateSaleDeliveryStatus(saleId, delivery_status) {
    const response = await fetch(`http://localhost:5000/sale/${saleId}/delivery-status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ delivery_status }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Failed to update delivery status' }));
        throw new Error(error.message || 'Failed to update delivery status');
    }

    return response.json();
}

export async function getSalesReport(startDate, endDate) {
    const response = await fetch(`http://localhost:5000/sale/report?start_date=${startDate}&end_date=${endDate}`);
    return response.json();
}

export async function getSalesByCustomer(customerId) {
    const response = await fetch(`http://localhost:5000/sale/customer/${customerId}`);
    return response.json();
}

export async function getSalesByDate(date) {
    const response = await fetch(`http://localhost:5000/sale/sale-date/${date}`);
    console.log("Fetched sales for date:", response);
    return response.json();
}

export async function getSalesByMonth(month) {
    const response = await fetch(`http://localhost:5000/sale/sale-month/${month}`);
    console.log("Fetched sales for month:", response);
    return response.json();
}

export async function getSalesByYear(year) {
    const response = await fetch(`http://localhost:5000/sale/sale-year/${year}`);
    console.log("Fetched sales for year:", response);
    return response.json();
}
export async function getProfitByDate(date) {
    const response = await fetch(`http://localhost:5000/sale/profit-date/${date}`);
    console.log("Fetched profit for date:", response);
    return response.json();
}

export async function getProfitByMonth(month) {
    const response = await fetch(`http://localhost:5000/sale/profit-month/${month}`);
    console.log("Fetched profit for month:", response);
    return response.json();
}

export async function getProfitByYear(year) {
    const response = await fetch(`http://localhost:5000/sale/profit-year/${year}`);
    console.log("Fetched profit for year:", response);
    return response.json();
}