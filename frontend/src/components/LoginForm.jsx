import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginChallenge, verifyAnswer } from '../api';
import DrawingPad from './DrawingPad';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [imageData, setImageData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginChallenge(email);
            if (data.error) {
                setError(data.error);
            } else {
                setStep(2);
            }
        } catch {
            setError('Failed to find user. Please check email.');
        }
    };

    const handleDrawing = (dataUrl) => {
        setImageData(dataUrl);
    };

    const handlePuzzleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!imageData) {
            setError('Please draw the pattern.');
            return;
        }

        try {
            const data = await verifyAnswer(email, imageData);
            if (data.error) {
                setError(data.error);
            } else {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/welcome');
            }
        } catch {
            setError('Verification failed.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
            <div className="auth-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                <h2 className="text-3xl font-extrabold text-white text-center mb-2">
                    {step === 1 ? 'Identify Yourself' : 'Prove It\'s You'}
                </h2>
                <p className="text-slate-400 text-center mb-8 text-sm">
                    {step === 1 ? 'Enter your email to find your account.' : 'Draw your secret pattern to unlock access.'}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input-field"
                                placeholder="john@example.com"
                                autoFocus
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center bg-red-900/20 py-2 rounded">{error}</p>}
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm">
                                <Link to="/forgot-pattern" className="font-medium text-blue-400 hover:text-blue-300">
                                    Forgot pattern?
                                </Link>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">
                            Unlock Identity
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handlePuzzleSubmit} className="space-y-6 animate-fade-in-up">
                        <div className="text-center">
                            <DrawingPad onDraw={handleDrawing} />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-900/20 py-2 rounded">{error}</p>}

                        <button type="submit" className="btn-primary bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                            Unlock Access
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-slate-500 hover:text-slate-300 w-full text-center mt-2"
                        >
                            Back to Email
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center pt-6 border-t border-slate-700">
                    <Link to="/register" className="btn-secondary">
                        Don't have a puzzle? <span className="text-blue-400 hover:text-blue-300">Create one</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
