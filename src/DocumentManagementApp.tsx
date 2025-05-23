import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentList from './components/DocumentList.tsx';
import UploadArea from './components/UploadArea';
import EmptyState from './components/EmptyState';
import DocumentDetails from './components/DocumentDetails.tsx';
import ProceduresList from './components/ProceduresList';
import { PREDEFINED_TAGS } from './utils/documentProcessor';

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

// Mock initial data
const initialDocuments: Document[] = [
    {
        id: 1,
        name: "Carte Nationale XYZ.pdf", // Example name
        type: "image", // This 'type' is the broad category for UI icons
        status: "Vérifié",
        validUntil: "27/03/2025",
        addedOn: "27/03/2024",
        tags: [PREDEFINED_TAGS.CARTE_IDENTITE, "Française"], // <<<< UPDATED
        size: "1.02Mb",
        content: null, // This would be the URL.createObjectURL from UploadArea for real files
        extractedInfo: { /* ... some data ... */ }
    },
    {
        id: 2,
        name: "Passeport ABC.jpg", // Example name
        type: "image",
        status: "Vérifié",
        validUntil: "27/03/2030",
        addedOn: "27/03/2024",
        tags: [PREDEFINED_TAGS.PASSEPORT, "Européen"], // <<<< UPDATED
        size: "2.50Mb",
        content: null,
        extractedInfo: { /* ... some data ... */ }
    },
    {
        id: 3,
        name: "Facture EDF.pdf",
        type: "invoice",
        status: "Vérifié",
        validUntil: "N/A",
        addedOn: "15/03/2024",
        tags: [PREDEFINED_TAGS.FACTURE_ELECTRICITE, PREDEFINED_TAGS.JUSTIFICATIF_DOMICILE], // <<<< UPDATED
        size: "0.50Mb",
        content: null
    },
    {
        id: 4,
        name: "Document-name.pdf",
        type: "invoice",
        status: "Vérifié",
        validUntil: "27/03/2025",
        addedOn: "27/03/2024",
        tags: ["Facture", "Justificatif de domicile"],
        size: "5.02Mb",
        content: null
    },
    {
        id: 5,
        name: "Document-name.pdf",
        type: "payment",
        status: "Vérifié",
        validUntil: "27/03/2025",
        addedOn: "27/03/2024",
        tags: ["Fiche de paie", "Entreprise A"],
        size: "5.02Mb",
        content: null
    },
    {
        id: 6,
        name: "Document-name.pdf",
        type: "generic",
        status: "Vérifié",
        validUntil: "27/03/2025",
        addedOn: "27/03/2024",
        tags: ["Document", "S-12"],
        size: "5.02Mb",
        content: null
    }
];

// Import document processor functions
import { processDocument } from './utils/documentProcessor';

const DocumentManagementApp = () => {
    // State management
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadArea, setShowUploadArea] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [procedures, setProcedures] = useState<any[]>([]); // Consider defining a Procedure interface
    const [accessRequests, setAccessRequests] = useState<any[]>([]); // Consider defining an AccessRequest interface
    const [activeTab, setActiveTab] = useState('documents');

    // Handle file upload
    const handleFileSelect = (processedDocumentsArray: Document[]) => {
        console.log('[DocumentManagementApp] handleFileSelect received:', processedDocumentsArray);
        if (processedDocumentsArray && processedDocumentsArray.length > 0) {
            // Add all the already processed documents to the list
            setDocuments(prevDocs => [...prevDocs, ...processedDocumentsArray]);

            // Optionally, hide the upload area or give feedback
            setShowUploadArea(false); // If you have this state
        }
    };
    
    // Filter documents based on search query
    const filteredDocuments = documents.filter((doc: Document) => {
        if (!searchQuery) return true;

        // Search in document name
        if (doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return true;
        }

        // Search in tags
        if (doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
            return true;
        }

        return false;
    });

    // Handle document selection
    const handleDocumentSelect = (doc: Document) => {
        setSelectedDocument(doc);
    };

    // Close document details modal
    const closeDocumentDetails = () => {
        setSelectedDocument(null);
    };

    // Add a new procedure
    const startNewProcedure = () => {
        const newProcedure = {
            id: procedures.length + 1,
            type: "Renouvellement de carte d'identité",
            status: "En cours",
            nextStep: "prendre rendez-vous en mairie"
        };

        setProcedures([...procedures, newProcedure]);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
                procedures={procedures.length}
                accessRequests={accessRequests.length}
                documentsCount={documents.length}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden ml-64">
                {/* Header */}
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    userName="Michel Armand"
                />

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 mt-16">
                    {showUploadArea ? (
                        // Upload Area
                        <UploadArea
                            onFileSelect={handleFileSelect}
                        />
                    ) : (
                        // Documents List View
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Documents récents</h2>
                                <button
                                    className="flex items-center bg-white text-gray-700 border border-gray-300 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none"
                                    onClick={() => setShowUploadArea(true)}
                                >
                                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Ajouter des documents
                                </button>
                            </div>

                            <DocumentList
                                documents={filteredDocuments}
                                onDocumentSelect={handleDocumentSelect}
                                onEditDocument={(doc: Document) => {
                                    // TODO: Implement document editing logic
                                    console.log('Edit document:', doc);
                                }}
                                onDeleteDocument={(doc: Document)=>{
                                    // TODO: Implement document deletion logic
                                    console.log('Delete document:', doc);
                                }}
                            />
                            
                            {/* Rest of your component */}
                            {/* ... */}
                        </>
                    )}
                </main>
            </div>

            {/* Document Details Modal */}
            {selectedDocument && (
                <DocumentDetails 
                    document={selectedDocument} 
                    onClose={closeDocumentDetails} 
                />
            )}
        </div>
    );
};

export default DocumentManagementApp;