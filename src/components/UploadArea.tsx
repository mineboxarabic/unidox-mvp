// components/UploadArea.tsx
import React, { useState } from 'react';
import { processDocument } from '../utils/documentProcessor';

interface UploadAreaProps {
    onFileSelect: (documents: any[]) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect }) => {
    // Add these state variables at the top of your component
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [processingStatus, setProcessingStatus] = useState<string>('');

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            // Set uploading state to true at the beginning
            setIsUploading(true);

            try {
                const files = event.target.files;
                const processedFiles = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // Update status for current file
                    setProcessingStatus(`Analyzing ${file.name} (${i+1}/${files.length})...`);

                    // Process document with Gemini
                    const processedData = await processDocument(file);

                    // Create new document with extracted data
                    const newDocument = {
                        id: Date.now() + i,
                        name: file.name,
                        type: processedData.type,
                        status: processedData.status,
                        validUntil: processedData.validUntil,
                        addedOn: processedData.addedOn,
                        tags: processedData.tags,
                        size: `${(file.size / (1024 * 1024)).toFixed(2)}Mb`,
                        content: URL.createObjectURL(file),
                        extractedInfo: processedData.extractedInfo
                    };

                    processedFiles.push(newDocument);
                }

                // Add all documents to the list
                onFileSelect(processedFiles);

            } catch (error) {
                console.error("Error processing files:", error);
                setProcessingStatus('Error processing document');
            } finally {
                // Set uploading state to false when done or if there's an error
                setIsUploading(false);
                setProcessingStatus('');
            }
        }
    };

    return (
        <div className="h-full p-4">
            <div className="text-center my-4">
                <h2 className="text-2xl font-bold text-blue-500">Importez des documents pour commencer</h2>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-80 flex flex-col items-center justify-center bg-white p-12">
                {isUploading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-lg">{processingStatus || 'Traitement de votre document...'}</p>
                        <p className="text-gray-600 mt-2">Nous analysons votre document avec Gemini AI</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <svg className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-lg">Glissez-déposez des documents ici</p>
                        <p className="text-gray-600 mb-4">ou</p>
                        <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                            Cliquez pour ajouter des fichiers
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png,.txt"
                            />
                        </label>
                        <p className="text-gray-500 text-sm mt-4">
                            PDF, images et documents d'identité acceptés
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadArea;