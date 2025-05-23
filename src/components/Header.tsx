// components/Header.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    userName: string;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, userName }) => {
    return (
        <header className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">

            <div className="relative rounded-md shadow-sm w-2/5">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Recherche..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex items-center">
                <button className="flex items-center bg-white text-gray-700 border border-gray-300 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none">
                    {userName}
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <div className="ml-2 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {userName.split(' ').map(name => name[0]).join('')}
          </span>
                </div>
            </div>

        </header>

    );
};

export default Header;