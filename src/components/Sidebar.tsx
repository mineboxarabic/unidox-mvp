// components/Sidebar.tsx
import React from 'react';
import { FileText, Folder, Archive, User, Navigation, Bell, Settings, HelpCircle, LogOut } from 'lucide-react';

interface SidebarProps {
    procedures: number;
    accessRequests: number;
    documentsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ procedures, accessRequests, documentsCount }) => {
    return (
        <div className="w-64 bg-white p-4 border-r border-gray-200">
            <div className="text-2xl font-bold mb-8">Logo</div>

            <nav className="space-y-1">
                <div className="flex items-center px-2 py-3 text-gray-700 bg-gray-200 rounded">
                    <FileText className="mr-3 h-5 w-5" />
                    <span>Tableau de bord</span>
                </div>

                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <Folder className="mr-3 h-5 w-5" />
                    <span>Tout les documents</span>
                    <span className="ml-auto bg-gray-200 py-1 px-2 rounded-full text-xs">{documentsCount || 36}</span>
                </div>

                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <Archive className="mr-3 h-5 w-5" />
                    <span>Démarches en cours</span>
                    <span className="ml-auto bg-gray-200 py-1 px-2 rounded-full text-xs">{procedures || 3}</span>
                </div>

                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <Folder className="mr-3 h-5 w-5" />
                    <span>Toutes mes démarches</span>
                    <span className="ml-auto bg-gray-200 py-1 px-2 rounded-full text-xs">12</span>
                </div>

                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <User className="mr-3 h-5 w-5" />
                    <span>Pièces d'identités</span>
                    <span className="ml-auto bg-gray-200 py-1 px-2 rounded-full text-xs">4</span>
                </div>

                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <Archive className="mr-3 h-5 w-5" />
                    <span>Demandes d'accès en cours</span>
                    <span className="ml-auto bg-gray-200 py-1 px-2 rounded-full text-xs">{accessRequests || 8}</span>
                </div>

                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <Navigation className="mr-3 h-5 w-5" />
                    <span>Element de navigation</span>
                </div>
            </nav>

            <div className="mt-auto pt-8">
                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <Bell className="mr-3 h-5 w-5" />
                    <span>Notifications</span>
                </div>

                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <Settings className="mr-3 h-5 w-5" />
                    <span>Paramètres</span>
                </div>

                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <HelpCircle className="mr-3 h-5 w-5" />
                    <span>Centre d'aide</span>
                </div>

                <div className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-100 rounded">
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Déconnexion</span>
                </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">Passez à pro</p>
                <p className="text-xs text-gray-600">Lorem ipsum dolor sit amet consectetur. Semper placerat amet volutpat facilisis. Aenean turpis.</p>
                <button className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded">
                    Découvrez Unidox PRO
                </button>
            </div>
        </div>
    );
};

export default Sidebar;