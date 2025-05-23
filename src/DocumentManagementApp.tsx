import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentList from './components/DocumentList.tsx';
import UploadArea from './components/UploadArea';
import EmptyState from './components/EmptyState';
import DocumentDetails from './components/DocumentDetails.tsx';
import ProceduresList from './components/ProceduresList';
import { PREDEFINED_TAGS } from './utils/documentProcessor'; // <<<< ADD THIS (adjust path if you moved PREDEFINED_TAGS to a constants.ts file)

// Mock initial data
const initialDocuments = [
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
    const [documents, setDocuments] = useState(initialDocuments);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadArea, setShowUploadArea] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [procedures, setProcedures] = useState([]);
    const [accessRequests, setAccessRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('documents');

    // Handle file upload
    const handleFileSelect = (processedDocumentsArray: any[]) => {
        console.log('[DocumentManagementApp] handleFileSelect received:', processedDocumentsArray);
        if (processedDocumentsArray && processedDocumentsArray.length > 0) {
            // Add all the already processed documents to the list
            setDocuments(prevDocs => [...prevDocs, ...processedDocumentsArray]);

            // Optionally, hide the upload area or give feedback
            setShowUploadArea(false); // If you have this state
        }
    };
    // Filter documents based on search query
    const filteredDocuments = documents.filter(doc => {
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
    const handleDocumentSelect = (doc) => {
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
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    userName="Michel Armand"
                />

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4">
                    {showUploadArea ? (
                        // Upload Area
                        <UploadArea
                            isUploading={isUploading}
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
                            />

                            {/* Procedures and Requests Sections */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {/* Procedures */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">Suivis des démarches</h3>
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                                            onClick={startNewProcedure}
                                        >
                                            Commencer une démarche
                                        </button>
                                    </div>

                                    {procedures.length > 0 ? (
                                        <ProceduresList
                                            procedures={procedures}
                                            onComplete={(id) => {
                                                setProcedures(
                                                    procedures.map(p =>
                                                        p.id === id
                                                            ? {...p, status: "Terminée", nextStep: undefined}
                                                            : p
                                                    )
                                                );
                                            }}
                                        />
                                    ) : (
                                        <EmptyState
                                            type="procedures"
                                            message="Aucune démarche en cours"
                                            buttonText="Commencer une démarche"
                                            onClick={startNewProcedure}
                                        />
                                    )}
                                </div>

                                {/* Access Requests */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium">Demandes d'accès en cours</h3>
                                    </div>

                                    <EmptyState
                                        type="requests"
                                        message="Aucune demande d'accès en cours"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {/* Identity Documents - REWRITTEN */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-lg font-medium mb-4">Pièces d'Identité</h3>
                                    {(() => { // IIFE to manage filtered list rendering
                                        const identityDocs = documents.filter(doc =>
                                            doc.tags.includes(PREDEFINED_TAGS.CARTE_IDENTITE) ||
                                            doc.tags.includes(PREDEFINED_TAGS.PASSEPORT) ||
                                            doc.tags.includes(PREDEFINED_TAGS.TITRE_SEJOUR) ||
                                            doc.tags.includes(PREDEFINED_TAGS.PERMIS_CONDUIRE) ||
                                            doc.tags.includes(PREDEFINED_TAGS.LIVRET_FAMILLE) // Optional: as it's an official family ID doc
                                        );

                                        if (identityDocs.length > 0) {
                                            return (
                                                <div className="space-y-2"> {/* Use space-y for better list item spacing */}
                                                    {identityDocs.map(doc => (
                                                        <div key={doc.id} className="flex items-center p-2 border rounded-md hover:bg-gray-50"> {/* Improved styling */}
                                                            <div className="h-6 w-6 mr-3 bg-blue-100 text-blue-500 rounded flex items-center justify-center">
                                                                {/* You can have different icons based on doc.type or specific tags */}
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4m-6 6h.01M9 16h.01M15 16h.01M12 16h.01M12 12h.01M12 9h.01M12 6h.01" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 text-sm font-medium text-gray-800">{doc.name}</div>
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${
                                                                doc.status === "Vérifié" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                            }`}>
                                {doc.status}
                            </span>
                                                            <div className="flex flex-wrap gap-1"> {/* Use flex-wrap for tags */}
                                                                {doc.tags.slice(0, 2).map((tag, index) => ( // Show first 2 tags, for example
                                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                        {tag}
                                    </span>
                                                                ))}
                                                                {doc.tags.length > 2 && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                        +{doc.tags.length - 2}
                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <EmptyState
                                                    type="identity"
                                                    message="Aucune pièce d'identité correspondante."
                                                    icon="folder" // Changed icon
                                                />
                                            );
                                        }
                                    })()}
                                </div>

                                {/* Justificatifs de Domicile - NEW SECTION EXAMPLE */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-lg font-medium mb-4">Justificatifs de Domicile</h3>
                                    {(() => {
                                        const proofOfAddressDocs = documents.filter(doc =>
                                            doc.tags.includes(PREDEFINED_TAGS.JUSTIFICATIF_DOMICILE) || // Primary check
                                            // Or check for specific types if generateTags doesn't always add the generic JUSTIFICATIF_DOMICILE
                                            doc.tags.includes(PREDEFINED_TAGS.QUITANCE_LOYER) ||
                                            doc.tags.includes(PREDEFINED_TAGS.FACTURE_ELECTRICITE) ||
                                            doc.tags.includes(PREDEFINED_TAGS.FACTURE_GAZ) ||
                                            doc.tags.includes(PREDEFINED_TAGS.FACTURE_EAU) ||
                                            doc.tags.includes(PREDEFINED_TAGS.ASSURANCE_HABITATION)
                                        );

                                        if (proofOfAddressDocs.length > 0) {
                                            return (
                                                <div className="space-y-2">
                                                    {proofOfAddressDocs.map(doc => (
                                                        <div key={doc.id} className="flex items-center p-2 border rounded-md hover:bg-gray-50">
                                                            <div className="h-6 w-6 mr-3 bg-teal-100 text-teal-500 rounded flex items-center justify-center">
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 text-sm font-medium text-gray-800">{doc.name}</div>
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-2 ${
                                                                doc.status === "Vérifié" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                            }`}>
                                {doc.status}
                            </span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {doc.tags.slice(0, 2).map((tag, index) => (
                                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                        {tag}
                                    </span>
                                                                ))}
                                                                {doc.tags.length > 2 && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                        +{doc.tags.length - 2}
                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <EmptyState
                                                    type="requests" // You might want a new type or more generic styling
                                                    message="Aucun justificatif de domicile correspondant."
                                                    icon="document"
                                                />
                                            );
                                        }
                                    })()}
                                </div>

                                {/* You can add more sections here for other tag categories if you wish */}
                                {/* Example: Financial Documents, Vehicle Documents, etc. */}

                                {/* Expiring Documents section (original, keep if useful) */}
                                <div className="bg-white rounded-lg shadow-sm p-4">
                                    <h3 className="text-lg font-medium mb-4">Documents arrivant à expiration</h3>
                                    {/* Logic for expiring documents would need to parse doc.validUntil */}
                                    <EmptyState
                                        type="expiring"
                                        message="Aucun document n'arrive à expiration prochainement (logique à implémenter)"
                                        icon="calendar"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DocumentManagementApp;