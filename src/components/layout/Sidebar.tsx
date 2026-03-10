import React from 'react';
import { Book, BookOpen, Edit3, Home, LogOut, Notebook, User, UserCircle, ScrollText, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  showMobileToggle?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose, showMobileToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      icon: <Home />,
      label: 'Dashboard',
    },
    {
      path: '/manuscripts',
      icon: <Book />,
      label: 'Manuscripts',
    },
    {
      path: '/characters',
      icon: <User />,
      label: 'Characters',
    },
    {
      path: '/chapters',
      icon: <ScrollText />,
      label: 'Chapters',
    },
    {
      path: '/notes',
      icon: <Notebook />,
      label: 'Notes',
    },
    {
      path: '/editor',
      icon: <Edit3 />,
      label: 'Editor',
    },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  }

  return (
    <>
      {showMobileToggle && isOpen && (
        <button
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Close menu"
        />
      )}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 min-h-screen border-r border-slate-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          showMobileToggle ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        }`}
      >
      {/* Header */}
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Scriptoria</h1>
        </div>
        {showMobileToggle && onClose && (
          <button onClick={onClose} className="p-2 md:hidden rounded hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-1 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-slate-800 text-white border-l-4 border-purple-500'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Profile & Logout */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700 space-y-2">
        <Link
          to="/profile"
          className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
            location.pathname === '/profile'
              ? 'bg-slate-800 text-white border-l-4 border-purple-500'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <UserCircle className="w-5 h-5 mr-3" />
          Profile
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
    </>
  )
}