import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Sparkles, Home, Plus, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen">
      {/* Glassmorphic Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-white/50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Feed")} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AnimeMoments
                </h1>
                <p className="text-xs text-gray-500 font-semibold">Where Fans Unite</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Link 
                to={createPageUrl("Feed")} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  location.pathname === createPageUrl("Feed")
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Feed</span>
              </Link>
              <Link 
                to={createPageUrl("CreateMoment")} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                  location.pathname === createPageUrl("CreateMoment")
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>Create</span>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 hover:bg-purple-50 rounded-xl px-3 py-2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-md opacity-50"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-black text-sm">
                            {user.full_name?.[0] || user.email[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <span className="hidden md:inline font-bold text-gray-800">{user.full_name || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-xl border-white/50 shadow-2xl">
                    <DropdownMenuItem onClick={handleLogout} className="font-semibold">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/50 bg-white/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-2">
                <Link 
                  to={createPageUrl("Feed")} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    location.pathname === createPageUrl("Feed")
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-gray-600 hover:bg-purple-50"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  Feed
                </Link>
                <Link 
                  to={createPageUrl("CreateMoment")} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    location.pathname === createPageUrl("CreateMoment")
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-gray-600 hover:bg-purple-50"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Create Moment
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white mt-20">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black">AnimeMoments</h3>
                <p className="text-sm text-purple-200">Share your passion</p>
              </div>
            </div>
            <p className="text-purple-200 text-sm">
              © 2024 AnimeMoments. Built with ❤️ by anime fans, for anime fans.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}