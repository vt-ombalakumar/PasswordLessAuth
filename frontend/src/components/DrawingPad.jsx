import { useRef, useEffect, useState } from 'react';

const DrawingPad = ({ onDraw, label }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawing, setHasDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 300;
        canvas.height = 300;

        // Initial white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Drawing settings
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 15; // Thicker lines for better recognition
        ctx.lineCap = 'round';
    }, []);

    const getCoordinates = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if (event.touches) {
            return {
                x: (event.touches[0].clientX - rect.left) * scaleX,
                y: (event.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        e.preventDefault(); // Prevent scrolling on touch
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasDrawing(true);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const canvas = canvasRef.current;
            const dataUrl = canvas.toDataURL('image/png');
            if (onDraw) onDraw(dataUrl);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasDrawing(false);
        if (onDraw) onDraw(null);
    };

    return (
        <div className="flex flex-col items-center">
            {label && <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>}
            <div className="relative border-2 border-slate-600 rounded-lg overflow-hidden shadow-lg bg-white touch-none">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="cursor-crosshair block"
                    style={{ width: '100%', maxWidth: '300px', height: 'auto', aspectRatio: '1/1' }}
                />
            </div>

            <button
                type="button"
                onClick={clearCanvas}
                className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors uppercase font-bold tracking-wider"
                disabled={!hasDrawing}
                style={{ opacity: hasDrawing ? 1 : 0.5, cursor: hasDrawing ? 'pointer' : 'default' }}
            >
                Clear Canvas
            </button>
        </div>
    );
};

export default DrawingPad;
