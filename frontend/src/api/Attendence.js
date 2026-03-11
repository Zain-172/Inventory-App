const API_BASE_URL = "http://localhost:5000";

export function getAttendenceByDate(date) {
	return fetch(`${API_BASE_URL}/attendence/${date}`)
		.then((res) => {
			if (!res.ok) {
				throw new Error("Failed to fetch attendence");
			}
			return res.json();
		})
		.catch((err) => {
			console.error("Failed to fetch attendence", err);
			throw err;
		});
}

export function upsertAttendence(payload) {
	return fetch(`${API_BASE_URL}/attendence`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	})
		.then((res) => {
			if (!res.ok) {
				throw new Error("Failed to save attendence");
			}
			return res.json();
		})
		.catch((err) => {
			console.error("Failed to save attendence", err);
			throw err;
		});
}
