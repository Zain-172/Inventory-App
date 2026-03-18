const API_BASE_URL = "http://localhost:5000";
export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

export async function logout() {
  await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
  });
}

export async function resetPassword(email, password) {
  const response = await fetch(`${API_BASE_URL}/login/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();

}

export async function getMpinStatus(userId) {
  const response = await fetch(`${API_BASE_URL}/login/mpin-status/${userId}`);
  return response.json();
}

export async function setMpin(userId, mpin) {
  const response = await fetch(`${API_BASE_URL}/login/set-mpin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, mpin }),
  });
  return response.json();
}

export async function verifyMpin(userId, mpin) {
  const response = await fetch(`${API_BASE_URL}/login/verify-mpin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, mpin }),
  });
  return response.json();
}