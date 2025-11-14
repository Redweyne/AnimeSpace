import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import MomentCard from "../components/anime/MomentCard";
import FeaturedMoment from "../components/anime/FeaturedMoment";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Flame, Clock, Search, Sparkles, TrendingUp, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Feed() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: moments, isLoading } = useQuery({
    queryKey: ['moments', sortBy],
    queryFn: async () => {
      const data = await base44.entities.AnimeMoment.list('-created_date');
      if (sortBy === 'popular') {
        return [...data].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      }
      return data;
    },
    initialData: [],
  });

  const filteredMoments = moments.filter(moment => 
    moment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    moment.anime_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    moment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredMoment = filteredMoments.length > 0 ? filteredMoments[0] : null;
  const regularMoments = filteredMoments.slice(1);

  const toggleLikeMutation = useMutation({
    mutationFn: async ({ momentId, currentLikes }) => {
      const userEmail = user?.email;
      if (!userEmail) return;
      
      const hasLiked = currentLikes?.includes(userEmail);
      const newLikes = hasLiked
        ? currentLikes.filter(email => email !== userEmail)
        : [...(currentLikes || []), userEmail];
      
      await base44.entities.AnimeMoment.update(momentId, { likes: newLikes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moments'] });
    },
  });

  const handleLike = (momentId, currentLikes) => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    toggleLikeMutation.mutate({ momentId, currentLikes });
  };

  const handleMomentClick = (momentId) => {
    navigate(createPageUrl("MomentDetail") + `?id=${momentId}`);
  };

  const totalLikes = moments.reduce((sum, m) => sum + (m.likes?.length || 0), 0);

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-6 shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span className="font-semibold text-sm">Trending Now</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                AnimeMoments
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium">
              Discover, share, and celebrate the most epic anime moments with a passionate community
            </p>
            
            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 mb-10"
            >
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-white/50">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-gray-800">{moments.length}</span>
                <span className="text-gray-600">Moments</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-white/50">
                <Star className="w-5 h-5 text-pink-600" />
                <span className="font-bold text-gray-800">{totalLikes}</span>
                <span className="text-gray-600">Reactions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-white/50">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-gray-800">Hot</span>
                <span className="text-gray-600">This Week</span>
              </div>
            </motion.div>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for anime, moments, tags..."
                    className="pl-16 pr-6 py-7 text-lg bg-white/90 backdrop-blur-xl border-2 border-white/50 shadow-2xl rounded-3xl focus:border-purple-400 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Sort Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center gap-4 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mr-4">Explore</h2>
          <button
            onClick={() => setSortBy("recent")}
            className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              sortBy === "recent"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-105"
                : "bg-white/70 backdrop-blur-xl text-gray-700 hover:bg-white shadow-md border border-white/50"
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Latest
            </span>
          </button>
          <button
            onClick={() => setSortBy("popular")}
            className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              sortBy === "popular"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50 scale-105"
                : "bg-white/70 backdrop-blur-xl text-gray-700 hover:bg-white shadow-md border border-white/50"
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Most Popular
            </span>
          </button>
        </motion.div>

        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-96 w-full rounded-3xl" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-96 w-full rounded-3xl" />
              ))}
            </div>
          </div>
        ) : filteredMoments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-3">
              {searchQuery ? "No moments found" : "No moments yet"}
            </h3>
            <p className="text-gray-600 text-xl">
              {searchQuery ? "Try a different search term" : "Be the first to share an epic anime moment!"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Featured Moment */}
            {featuredMoment && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FeaturedMoment
                  moment={featuredMoment}
                  onLike={handleLike}
                  onClick={handleMomentClick}
                  userEmail={user?.email}
                />
              </motion.div>
            )}

            {/* Regular Moments Grid */}
            <AnimatePresence mode="popLayout">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularMoments.map((moment, index) => (
                  <motion.div
                    key={moment.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  >
                    <MomentCard
                      moment={moment}
                      onLike={handleLike}
                      onCommentClick={handleMomentClick}
                      userEmail={user?.email}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}