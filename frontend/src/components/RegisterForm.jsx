import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api';
import DrawingPad from './DrawingPad';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image_data: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDrawing = (dataUrl) => {
        setFormData(prev => ({ ...prev, image_data: dataUrl }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.image_data) {
            setError('Please draw your security pattern.');
            return;
        }

        try {
            const response = await registerUser(formData);
            if (response.error) {
                setError(response.error);
            } else {
                navigate('/login');
            }
        } catch {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
            <div className="auth-card">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-center mb-8">
                    Create Identity
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                        <p className="text-xs uppercase tracking-wide text-slate-500 mb-4 font-bold text-center">Design Your Pattern</p>
                        <DrawingPad onDraw={handleDrawing} />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center bg-red-900/20 py-2 rounded">{error}</p>}

                    <button type="submit" className="btn-primary">
                        Seal My Identity
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="btn-secondary">
                        Already have an identity? <span className="text-blue-400 hover:text-blue-300">Unlock here</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
