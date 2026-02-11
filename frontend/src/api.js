const API_URL = import.meta.env.PROD ? '/api' : 'http://127.0.0.1:5000/api';

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


export const saveScore = async (email, score, moves) => {
    const response = await fetch(`${API_URL}/score`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, score, moves }),
    });
    return response.json();
};

export const forgotPattern = async (email) => {
    const response = await fetch(`${API_URL}/forgot-pattern`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return response.json();
};

export const resetPattern = async (email, code, imageData) => {
    const response = await fetch(`${API_URL}/reset-pattern`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, image_data: imageData }),
    });
    return response.json();
};

export const getScores = async (email) => {
    const response = await fetch(`${API_URL}/scores/${email}`);
    return response.json();
};
