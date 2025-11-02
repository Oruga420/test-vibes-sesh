import React, { useState } from 'react';
import { fileToBase64, analyzeImage } from '../services/geminiService';
import Spinner from './common/Spinner';
import FileUpload from './common/FileUpload';
import { Bot } from 'lucide-react';

const ImageAnalyzer: React.FC = () => {
    const [image, setImage] = useState<{ file: File, url: string } | null>(null);
    const [prompt, setPrompt] = useState<string>('Describe this image in detail.');
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (file: File) => {
        setImage({ file, url: URL.createObjectURL(file) });
        setAnalysis('');
        setError(null);
    };

    const handleSubmit = async () => {
        if (!image || !prompt) {
            setError("Please upload an image and provide a prompt.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis('');
        try {
            const base64Image = await fileToBase64(image.file);
            const result = await analyzeImage(prompt, base64Image, image.file.type);
            setAnalysis(result);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Image Analyzer</h2>
                <p className="text-slate-400">Upload an image and ask a question about its content.</p>
            </div>
            
            {!image && <FileUpload onFileSelect={handleFileSelect} labelText="PNG, JPG, WEBP, etc." />}

            {image && (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center">
                        <img src={image.url} alt="To be analyzed" className="rounded-lg shadow-md max-h-80 w-auto" />
                         <button 
                            onClick={() => { setImage(null); setAnalysis(''); setPrompt('Describe this image in detail.'); }}
                            className="mt-4 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition disabled:opacity-50 text-sm"
                            disabled={isLoading}
                        >
                            Change Image
                        </button>
                    </div>

                    <div className="flex-grow flex flex-col gap-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'What is in this image?' or 'Is there a dog in this picture?'"
                            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                            rows={3}
                            disabled={isLoading}
                        />
                         <button
                            onClick={handleSubmit}
                            disabled={isLoading || !prompt}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Analyzing...' : 'Analyze Image'}
                        </button>

                        {isLoading && (
                            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg flex justify-center items-center">
                                <Spinner />
                            </div>
                        )}

                        {analysis && (
                            <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Bot className="w-5 h-5 text-cyan-400" /> Analysis Result</h3>
                                <div className="prose prose-invert prose-sm max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />') }} />
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg mt-4">{error}</p>}
        </div>
    );
};

export default ImageAnalyzer;