import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemoryGame from './MemoryGame';
import { saveScore, getScores } from '../api';

const Welcome = () => {
    const [user, setUser] = useState(null);
    const [scores, setScores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchScores(parsedUser.email);
        }
    }, [navigate]);

    const fetchScores = async (email) => {
        try {
            const data = await getScores(email);
            if (Array.isArray(data)) {
                setScores(data);
            }
        } catch (error) {
            console.error("Failed to fetch scores", error);
        }
    };

    const handleGameEnd = async (score, moves) => {
        if (!user) return;
        try {
            console.log("Saving score:", score, "Moves:", moves);
            const response = await saveScore(user.email, score, moves);
            console.log("Score save response:", response);
            // Refresh scores
            fetchScores(user.email);
        } catch (error) {
            console.error("Failed to save score", error);
            alert("Failed to save score. Please check console for details.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-900 px-4 py-8">
            <div className="w-full max-w-5xl">
                <header className="flex justify-between items-center mb-10 px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="text-xl">🎉</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Welcome, <span className="text-blue-400">{user.name}</span>
                            </h1>
                            <p className="text-sm text-slate-400">Puzzle Master</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-colors">
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Game Section */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>🎮</span> Memory Challenge
                        </h2>
                        <MemoryGame onGameEnd={handleGameEnd} />
                    </div>

                    {/* History Section */}
                    <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 h-fit">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span>📜</span> Score History
                        </h2>

                        {scores.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 bg-slate-800/50 rounded-xl border border-slate-700/50 border-dashed">
                                <span className="text-4xl block mb-2">🎲</span>
                                <p>No games played yet.</p>
                                <p className="text-sm">Complete a game to see your stats!</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-slate-700/50">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="text-xs uppercase bg-slate-700 text-slate-300">
                                        <tr>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3 text-center">Moves</th>
                                            <th className="px-4 py-3 text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50 bg-slate-800/50">
                                        {scores.map((score) => (
                                            <tr key={score.id} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div>{new Date(score.date).toLocaleDateString()}</div>
                                                    <div className="text-xs text-slate-500">{new Date(score.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="px-4 py-3 text-center font-mono text-slate-300">{score.moves || '-'}</td>
                                                <td className="px-4 py-3 text-right font-mono text-blue-400 font-bold">{score.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
