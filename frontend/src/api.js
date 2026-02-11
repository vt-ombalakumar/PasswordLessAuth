const API_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
    // userData should contain { name, email, image_data }
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return response.json();
};

export const loginChallenge = async (email) => {
    // Step 1: Check if user exists
    const response = await fetch(`${API_URL}/login-challenge`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    return response.json();
};

export const verifyAnswer = async (email, imageData) => {
    // Step 2: Send drawing for verification
    const response = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, image_data: imageData }),
    });
    return response.json();
};
