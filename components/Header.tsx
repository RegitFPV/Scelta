import React from 'react';
import { AdminIcon, LogoutIcon } from './icons';

interface HeaderProps {
  appTitle: string;
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ appTitle, isAdmin, onAdminClick, onLogout }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-20 shadow-lg shadow-slate-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-500">
            {appTitle}
          </h1>
          {isAdmin ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-colors"
            >
              <LogoutIcon className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <button
              onClick={onAdminClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500 transition-colors"
            >
              <AdminIcon className="w-5 h-5" />
              Admin Panel
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;