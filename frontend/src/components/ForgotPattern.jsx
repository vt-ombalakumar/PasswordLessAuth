import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPattern, resetPattern } from '../api';
import DrawingPad from './DrawingPad';

const ForgotPattern = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code & New Pattern
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [imageData, setImageData] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await forgotPattern(email);
            if (response.error) {
                setError(response.error);
            } else {
                setMessage('Reset code sent! Check the backend terminal/console.');
                setStep(2);
            }
        } catch (err) {
            setError('Failed to send reset code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!imageData) {
            setError('Please draw your new pattern.');
            return;
        }

        setLoading(true);

        try {
            const response = await resetPattern(email, code, imageData);
            if (response.error) {
                setError(response.error);
            } else {
                alert('Pattern reset successfully! You can now log in with your new pattern.');
                navigate('/login');
            }
        } catch (err) {
            setError('Failed to reset pattern. Please verify the code and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4">
            <div className="auth-card">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-center mb-8">
                    Recover Identity
                </h2>

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
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-900/20 py-2 rounded">{error}</p>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetSubmit} className="space-y-6">
                        <div className="text-center text-sm text-slate-400 mb-4">
                            Code sent to <span className="text-white font-mono">{email}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Reset Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                className="input-field text-center font-mono tracking-widest text-xl"
                                placeholder="000000"
                                maxLength="6"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-700">
                            <p className="text-xs uppercase tracking-wide text-slate-500 mb-4 font-bold text-center">Draw New Pattern</p>
                            <DrawingPad onDraw={setImageData} />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center bg-red-900/20 py-2 rounded">{error}</p>}
                        {message && <p className="text-green-500 text-sm text-center bg-green-900/20 py-2 rounded">{message}</p>}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Resetting...' : 'Set New Pattern'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="btn-secondary">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPattern;
