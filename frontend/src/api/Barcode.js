
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
            console.error("Failed to print label");
        }
        return res.json();
    })
    .catch(err => {
        console.error("Failed to print label", err);
        throw err;
    });
};

export const getPrinters = () => {
    return fetch("http://localhost:5000/barcode/printers")
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch printers");
            }
            return res.json();
        })
        .catch(err => {
            console.error("Failed to fetch printers", err);
            throw err;
        });
};
