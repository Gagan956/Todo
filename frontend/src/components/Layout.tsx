import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useLogout, useGetCurrentUser } from "../api/hooks";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout: clearAuth, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();
  const { data: userData } = useGetCurrentUser();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentUser = userData?.user || user;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      clearAuth();
      navigate("/login", { replace: true });
    } catch {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-xl shadow">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  Todo App
                </h1>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  disabled={logoutMutation.isLoading}
                  className="flex items-center space-x-3 px-4 py-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-150 group"
                >
                  <div className="flex items-center space-x-2">
                    <div className="bg-indigo-100 p-2 rounded-full ring-1 ring-indigo-200">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>

                    <div className="text-left">
                      <p className="font-medium text-gray-900 leading-none">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-gray-500 leading-none">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg ring-1 ring-black/10 z-50 origin-top-right
                    animate-[dropdown_0.15s_ease-out]"
                  >
                    <div className="py-2">

                      {/* User Details */}
                      <div className="px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser?.email}
                        </p>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isLoading}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50 transition"
                      >
                        {logoutMutation.isLoading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Logging out...</span>
                          </>
                        ) : (
                          <>
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </>
                        )}
                      </button>

                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
