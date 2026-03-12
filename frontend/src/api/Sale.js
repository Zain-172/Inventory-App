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

export async function getSalesDuringPeriod(startDate, endDate) {
    const response = await fetch(`http://localhost:5000/sale/period/${startDate}/${endDate}`);
    console.log("Fetched sales during period:", response);
    return response.json();
}

export async function getProfitDuringPeriod(startDate, endDate) {
    const response = await fetch(`http://localhost:5000/sale/profit/${startDate}/${endDate}`);
    console.log("Fetched profit during period:", response);
    return response.json();
}