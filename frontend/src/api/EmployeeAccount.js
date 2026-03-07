
export function fetchEmployeeAccounts() {
    return fetch("/employee-accounts")
        .then(res => res.json())
        .catch(err => {
            console.error("Failed to fetch employee accounts", err);
            throw err;
        });
}

export function addEmployeeAccount(account) {
    return fetch("/employee-accounts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(account)
    })
    .then(res => res.json())
    .catch(err => {
        console.error("Failed to add employee account", err);
        throw err;
    });
}

export function deleteEmployeeAccount(id) {
    return fetch(`/employee-accounts/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Failed to delete employee account");
        }
    })
    .catch(err => {
        console.error("Failed to delete employee account", err);
        throw err;
    });
}

export function updateEmployeeAccount(id, account) {
    return fetch(`/employee-accounts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(account)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Failed to update employee account");
        }
    })
    .catch(err => {
        console.error("Failed to update employee account", err);
        throw err;
    });
}