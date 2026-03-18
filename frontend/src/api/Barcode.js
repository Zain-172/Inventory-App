
export const printLabel = (data) => {
    return fetch("http://localhost:5000/barcode/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Failed to print label");
        }
    })
    .catch(err => {
        console.error("Failed to print label", err);
        throw err;
    });
};
