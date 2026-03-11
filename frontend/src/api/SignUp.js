const API_BASE_URL = 'http://localhost:5000';

export async function signUp(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            throw new Error('Failed to sign up');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error signing up:', error);
        throw error;
    }
}

export async function generateOTP(email) {
    console.log(email);
    try {
        const response = await fetch(`${API_BASE_URL}/otp/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error generating OTP:', error);
        throw error;
    }
}

export async function validateOTP(otp) {
    try {
        const response = await fetch(`${API_BASE_URL}/otp/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ otp })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error validating OTP:', error);
        throw error;
    }
}