// components/DocumentDetails.tsx
import React from 'react';
import { formatDocumentInfo } from '../utils/documentProcessor.tsx';
export interface Document {
    id: number;
    name: string;
    type: 'image' | 'invoice' | 'payment' | 'generic';
    status: string;
    validUntil: string;
    addedOn: string;
    tags: string[];
    size: string;
    content: string | null;
    extractedInfo?: Record<string, any>;
}
interface DocumentDetailsProps {
    document: Document | null;
    onClose: () => void;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({ document, onClose }) => {
    if (!document) {
        return null;
    }

    // Format the extracted information for display
    const formattedInfo = document.extractedInfo ? formatDocumentInfo(document.extractedInfo) : {};

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-3/4 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Détails du document</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Informations du document</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-sm font-medium text-gray-600">Nom</div>
                                    <div className="text-sm">{document.name}</div>

                                    <div className="text-sm font-medium text-gray-600">Type</div>
                                    <div className="text-sm capitalize">
                                        {document.type === 'image' && 'Document d\'identité'}
                                        {document.type === 'invoice' && 'Facture'}
                                        {document.type === 'payment' && 'Document de paiement'}
                                        {document.type === 'generic' && 'Document générique'}
                                    </div>

                                    <div className="text-sm font-medium text-gray-600">Statut</div>
                                    <div className="text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {document.status}
                    </span>
                                    </div>

                                    <div className="text-sm font-medium text-gray-600">Ajouté le</div>
                                    <div className="text-sm">{document.addedOn}</div>

                                    <div className="text-sm font-medium text-gray-600">Valide jusqu'au</div>
                                    <div className="text-sm">{document.validUntil}</div>

                                    <div className="text-sm font-medium text-gray-600">Taille</div>
                                    <div className="text-sm">{document.size}</div>

                                    <div className="text-sm font-medium text-gray-600">Tags</div>
                                    <div className="text-sm">
                                        <div className="flex flex-wrap gap-1">
                                            {document.tags.map((tag, index) => (
                                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">Informations extraites</h3>
                            {Object.keys(formattedInfo).length > 0 ? (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(formattedInfo).map(([key, value]) => (
                                            <React.Fragment key={key}>
                                                <div className="text-sm font-medium text-gray-600">{key}</div>
                                                <div className="text-sm">{value}</div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                                    Aucune information extraite disponible
                                </div>
                            )}
                        </div>
                    </div>

                    {document.content && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium mb-4">Aperçu du document</h3>
                            <div className="border rounded-lg p-2 flex justify-center">
                                {document.type === 'image' ? (
                                    <img
                                        src={document.content}
                                        alt={document.name}
                                        className="max-h-96 object-contain"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center p-4 h-96 w-full bg-gray-50">
                                        <div className="text-center">
                                            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                            <p>Aperçu non disponible</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                L'aperçu n'est pas disponible pour ce type de document
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Fermer
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Télécharger
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetails;