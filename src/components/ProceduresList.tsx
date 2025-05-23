// components/ProceduresList.tsx
import React from 'react';

export interface Procedure {
    id: number;
    type: string;
    status: string;
    nextStep?: string;
}

interface ProceduresListProps {
    procedures: Procedure[];
    onComplete?: (id: number) => void;
}

const ProceduresList: React.FC<ProceduresListProps> = ({ procedures, onComplete }) => {
    return (
        <div className="space-y-2">
            {procedures.map((procedure) => (
                <div key={procedure.id} className="border rounded-md p-3">
                    <div className="flex items-center">
                        {procedure.status === "En cours" ? (
                            <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                                En cours
                            </div>
                        ) : procedure.status === "Terminée" ? (
                            <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Terminée
                            </div>
                        ) : (
                            <div className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                {procedure.status}
                            </div>
                        )}
                        <div className="ml-3">
                            <p className="text-sm font-medium">{procedure.type}</p>
                            {procedure.nextStep && (
                                <p className="text-xs text-gray-500">
                                    Prochaine étape : {procedure.nextStep}
                                </p>
                            )}
                        </div>
                        <div className="ml-auto">
                            {procedure.status === "En cours" && onComplete && (
                                <button
                                    className="text-sm bg-gray-800 text-white py-1 px-3 rounded"
                                    onClick={() => onComplete(procedure.id)}
                                >
                                    Terminer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProceduresList;