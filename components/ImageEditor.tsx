import React, { useState } from 'react';
import { fileToBase64, editImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import FileUpload from './common/FileUpload';
import { Wand2 } from 'lucide-react';

const ImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<{ file: File, url: string } | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (file: File) => {
        setOriginalImage({ file, url: URL.createObjectURL(file) });
        setEditedImage(null);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!originalImage || !prompt) {
            setError("Please upload an image and provide an editing prompt.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImage(null);
        try {
            const base64Image = await fileToBase64(originalImage.file);
            const editedBase64 = await editImage(prompt, base64Image, originalImage.file.type);
            setEditedImage(`data:image/png;base64,${editedBase64}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Image Editor</h2>
                <p className="text-slate-400">Upload an image and describe the changes you want to make.</p>
            </div>
            
            {!originalImage && <FileUpload onFileSelect={handleFileSelect} labelText="PNG, JPG, WEBP, etc." />}

            {originalImage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="font-semibold text-slate-300">Original</h3>
                        <img src={originalImage.url} alt="Original" className="rounded-lg shadow-md max-h-96 w-auto" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <h3 className="font-semibold text-slate-300">Edited</h3>
                        <div className="w-full aspect-square bg-slate-700/50 rounded-lg flex items-center justify-center">
                            {isLoading && <Spinner />}
                            {editedImage && <img src={editedImage} alt="Edited" className="rounded-lg shadow-md max-h-96 w-auto" />}
                            {!isLoading && !editedImage && <span className="text-slate-400">Your edited image will appear here</span>}
                        </div>
                    </div>
                </div>
            )}
            
            {originalImage && (
                <div className="flex flex-col gap-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'Add a retro filter' or 'Make the sky look like a sunset'"
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                        rows={3}
                        disabled={isLoading}
                    />
                    <div className="flex justify-end gap-4">
                        <button 
                            onClick={() => { setOriginalImage(null); setEditedImage(null); setPrompt(''); }}
                            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Start Over
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !prompt}
                            className="flex items-center justify-center gap-2 px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Wand2 className="w-5 h-5" />
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            )}
            
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </div>
    );
};

export default ImageEditor;