import { GoogleGenAI, Modality, GroundingChunk } from "@google/genai";

// Assume process.env.API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

export const createImage = async (prompt: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error creating image:", error);
        throw new Error("Failed to create image. Please check the console for details.");
    }
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: imageBase64,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error editing image:", error);
        throw new Error("Failed to edit image. Please check the console for details.");
    }
};

export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: imageBase64,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze image. Please check the console for details.");
    }
};


export const generateChatResponse = async (prompt: string, location: GeolocationCoordinates | null) => {
    try {
        // Simple keyword detection for tool selection
        const locationKeywords = ['nearby', 'restaurants', 'directions', 'map', 'located', 'where is'];
        const isLocationQuery = locationKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

        const config: any = {
            tools: [{ googleSearch: {} }] // Default to Google Search
        };

        if (isLocationQuery && location) {
            config.tools.push({ googleMaps: {} });
            config.toolConfig = {
                retrievalConfig: {
                    latLng: {
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                }
            };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: config
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        return {
            text: response.text,
            sources: groundingChunks || [],
        };
    } catch (error) {
        console.error("Error generating chat response:", error);
        throw new Error("Failed to get response from chatbot. Please check the console for details.");
    }
};