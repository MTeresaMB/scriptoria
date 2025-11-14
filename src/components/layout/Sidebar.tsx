import { Book, BookOpen, Edit3, Home, Link, LogOut, Notebook, User } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLocation } from "react-router-dom";

export const Sidebar: React.FC = () => {
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
    <div className="w-64 bg-slate-900 min-h-screen border-r border-slate-700">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Scriptoria</h1>
        </div>
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
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
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

      {/* Sign Out Button */}
      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}