import React, { useState } from 'react';
import { createImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

const ImageCreator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!prompt) {
            setError("Please provide a prompt to generate an image.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const generatedBase64 = await createImage(prompt);
            setGeneratedImage(`data:image/png;base64,${generatedBase64}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Image Creator</h2>
                <p className="text-slate-400">Describe the image you want to create using the power of AI.</p>
            </div>
            
            <div className="w-full max-w-2xl flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'A photorealistic image of a cat wearing a tiny wizard hat'"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                    rows={4}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Sparkles className="w-5 h-5" />
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </div>

            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg w-full max-w-2xl">{error}</p>}
            
            <div className="w-full max-w-2xl aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center mt-4">
                {isLoading && <Spinner />}
                {generatedImage && <img src={generatedImage} alt="Generated" className="rounded-lg shadow-md max-h-full max-w-full" />}
                {!isLoading && !generatedImage && (
                    <div className="text-center text-slate-400">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                        <p>Your generated image will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageCreator;