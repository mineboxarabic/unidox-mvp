// components/AccessRequestsList.tsx
import React from 'react';

export interface AccessRequest {
    id: number;
    requester: string;
    documentId: number;
    documentName: string;
    requestDate: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface AccessRequestsListProps {
    requests: AccessRequest[];
    onApprove?: (id: number) => void;
    onReject?: (id: number) => void;
}

const AccessRequestsList: React.FC<AccessRequestsListProps> = ({
                                                                   requests,
                                                                   onApprove,
                                                                   onReject
                                                               }) => {
    return (
        <div className="space-y-2">
            {requests.map((request) => (
                <div key={request.id} className="border rounded-md p-3">
                    <div className="flex items-center">
                        {request.status === 'pending' ? (
                            <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                                En attente
                            </div>
                        ) : request.status === 'approved' ? (
                            <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Approuvée
                            </div>
                        ) : (
                            <div className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Rejetée
                            </div>
                        )}

                        <div className="ml-3">
                            <p className="text-sm font-medium">
                                {request.requester} a demandé l'accès à {request.documentName}
                            </p>
                            <p className="text-xs text-gray-500">
                                Demandé le {request.requestDate}
                            </p>
                        </div>

                        {request.status === 'pending' && (
                            <div className="ml-auto flex space-x-2">
                                {onApprove && (
                                    <button
                                        className="text-sm bg-green-600 text-white py-1 px-3 rounded"
                                        onClick={() => onApprove(request.id)}
                                    >
                                        Approuver
                                    </button>
                                )}
                                {onReject && (
                                    <button
                                        className="text-sm bg-red-600 text-white py-1 px-3 rounded"
                                        onClick={() => onReject(request.id)}
                                    >
                                        Rejeter
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AccessRequestsList;