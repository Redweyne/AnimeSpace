import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Flame, Sparkles, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function FeaturedMoment({ moment, onLike, onClick, userEmail }) {
  const hasLiked = userEmail && moment.likes?.includes(userEmail);
  const isPopular = (moment.likes?.length || 0) >= 3;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <Card 
        className="group relative border-none shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden bg-gradient-to-br from-white to-purple-50/30 cursor-pointer"
        onClick={() => onClick(moment.id)}
      >
        {/* Featured Badge */}
        <div className="absolute top-6 left-6 z-20">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm animate-pulse">
            <Sparkles className="w-4 h-4" />
            FEATURED
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-80 lg:h-full overflow-hidden">
            {moment.image_url ? (
              <>
                <img 
                  src={moment.image_url} 
                  alt={moment.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                <Sparkles className="w-24 h-24 text-purple-400" />
              </div>
            )}
            
            {/* Overlay Stats */}
            <div className="absolute bottom-6 left-6 right-6 flex gap-3">
              <div className="flex-1 bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-lg">
                <p className="text-xs text-gray-500 mb-1">Anime</p>
                <p className="font-bold text-purple-600 truncate">{moment.anime_name}</p>
              </div>
              {moment.episode && (
                <div className="bg-white/95 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Episode</p>
                  <p className="font-bold text-gray-800">{moment.episode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Tags */}
              {moment.tags && moment.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {moment.tags.slice(0, 4).map((tag) => (
                    <Badge 
                      key={tag} 
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300 px-3 py-1 text-xs font-semibold"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title */}
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                {moment.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                {moment.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  Posted {format(new Date(moment.created_date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike(moment.id, moment.likes);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all ${
                    hasLiked 
                      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${hasLiked ? 'fill-current' : ''}`} />
                  <span className="text-lg">{moment.likes?.length || 0}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 px-4 py-3 rounded-2xl font-bold"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-lg">Discuss</span>
                </Button>
              </div>

              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg group"
              >
                <span>View Details</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
      </Card>
    </motion.div>
  );
}