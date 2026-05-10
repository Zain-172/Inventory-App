const API_BASE_URL = "http://localhost:5000/context";

export function sendProductContext(products) {
    const res = fetch(`${API_BASE_URL}/get-product-context`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ products })

    });
    return res;
}

export function sendHistoryContext(history) {
    const res = fetch(`${API_BASE_URL}/get-history-context`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ history })
    });
    return res;
}