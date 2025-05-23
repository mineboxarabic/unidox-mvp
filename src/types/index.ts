// src/types/index.ts

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

export interface Procedure {
    id: number;
    type: string;
    status: string;
    nextStep?: string;
}

export interface AccessRequest {
    id: number;
    requester: string;
    documentId: number;
    documentName: string;
    requestDate: string;
    status: 'pending' | 'approved' | 'rejected';
}