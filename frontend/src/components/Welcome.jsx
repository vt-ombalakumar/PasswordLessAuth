import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
            <div className="auth-card text-center">
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                    <span className="text-3xl">🎉</span>
                </div>

                <h1 className="text-3xl font-extrabold text-white mb-2">
                    Welcome Home, <span className="text-blue-400">{user.name}</span>
                </h1>

                <p className="text-slate-400 mb-8">
                    You have successfully passed the puzzle Gatekeeper.
                </p>

                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-8">
                    <p className="text-sm text-slate-500 mb-1">Registered Email</p>
                    <p className="text-lg text-white font-mono">{user.email}</p>
                </div>

                <button onClick={handleLogout} className="btn-primary bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Welcome;
