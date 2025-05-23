// components/EmptyState.tsx
import React from 'react';

interface EmptyStateProps {
    type: 'procedures' | 'requests' | 'identity' | 'expiring';
    message: string;
    buttonText?: string;
    onClick?: () => void;
    icon?: 'document' | 'calendar' | 'folder';
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   type,
                                                   message,
                                                   buttonText,
                                                   onClick,
                                                   icon = 'document'
                                               }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="mb-4 h-16 w-16 text-gray-400 border-2 border-dashed rounded-lg flex items-center justify-center">
                {icon === 'document' && (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                )}
                {icon === 'calendar' && (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                )}
                {icon === 'folder' && (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                )}
            </div>
            <p className="text-gray-500 mb-4">{message}</p>
            {buttonText && onClick && (
                <button
                    onClick={onClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default EmptyState;