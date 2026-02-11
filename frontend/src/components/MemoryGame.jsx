import { useState, useEffect } from 'react';

const AVAILABLE_ICONS = [
    '🚀', '🌈', '🎨', '🎸', '🍦', '🍕', '💎', '💡',
    '🦄', '🌺', '⚡', '🔥', '🌟', '🍀', '🍎', '🍒',
    '🐯', '🐙', '🦋', '🌵', '🍄', '🌍', '🌙', '🚲',
    '⚓', '🎈', '🎁', '🏆', '⚽', '🏀', '🎮', '🧩',
    '🎲', '🎻', '🎷', '📷', '📺', '💻', '🤖', '👾'
];

const MemoryGame = ({ onGameEnd }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [moves, setMoves] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        shuffleCards();
    }, []);

    const shuffleCards = () => {
        // Select 8 random icons from the pool
        const shuffledPool = [...AVAILABLE_ICONS].sort(() => Math.random() - 0.5);
        const selectedIcons = shuffledPool.slice(0, 8);

        // Create pairs and shuffle
        const cardPairs = [...selectedIcons, ...selectedIcons];
        const shuffled = cardPairs
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ id: index, icon }));

        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setDisabled(false);
        setGameOver(false);
    };

    const handleCardClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(id)) return;

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true);
            const firstId = flipped[0];
            const secondId = id;
            setFlipped([firstId, secondId]);
            setMoves((m) => m + 1);

            if (cards[firstId].icon === cards[secondId].icon) {
                setSolved((prev) => [...prev, firstId, secondId]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (!gameOver && solved.length === 16 && cards.length > 0) {
            setGameOver(true);
            // Game Over
            // Score calculation: High score is better. Max possible - moves * factor
            // Let's simpler: 100 base - moves * 2. Min 10.
            const calculatedScore = Math.max(10, 100 - moves * 2);
            setTimeout(() => onGameEnd(calculatedScore, moves), 500);
        }
    }, [solved, moves, onGameEnd, gameOver, cards.length]);

    return (
        <div className="w-full max-w-md mx-auto relative">
            <div className="flex justify-between items-center mb-4 text-slate-300">
                <span>Moves: {moves}</span>
                <button onClick={shuffleCards} className="text-sm text-blue-400 hover:text-blue-300">Restart</button>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`
                            aspect-square rounded-xl cursor-pointer transition-all duration-500 transform
                            flex items-center justify-center text-3xl
                            ${flipped.includes(card.id) || solved.includes(card.id)
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 rotate-y-180 scale-100 shadow-lg shadow-purple-500/30'
                                : 'bg-slate-800 hover:bg-slate-700 scale-95'}
                        `}
                    >
                        <span className={`transition-opacity duration-300 ${flipped.includes(card.id) || solved.includes(card.id) ? 'opacity-100' : 'opacity-0'}`}>
                            {card.icon}
                        </span>
                    </div>
                ))}
            </div>

            {gameOver && (
                <div className="absolute inset-0 z-10 bg-slate-900/90 rounded-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <span className="text-5xl mb-4">🏆</span>
                    <h3 className="text-2xl font-bold text-white mb-2">Game Complete!</h3>
                    <div className="text-slate-300 mb-6 text-center">
                        <p>Moves: <span className="text-white font-mono">{moves}</span></p>
                    </div>
                    <button
                        onClick={shuffleCards}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default MemoryGame;
