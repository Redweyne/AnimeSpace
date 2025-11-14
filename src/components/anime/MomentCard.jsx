import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Sparkles, Eye } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function MomentCard({ moment, onLike, onCommentClick, userEmail }) {
  const hasLiked = userEmail && moment.likes?.includes(userEmail);
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <Card 
        className="group relative border-none shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white cursor-pointer h-full flex flex-col"
        onClick={() => onCommentClick(moment.id)}
      >
        {/* Image Section with Overlay */}
        <div className="relative h-64 overflow-hidden">
          {moment.image_url ? (
            <>
              <img 
                src={moment.image_url} 
                alt={moment.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Floating Like Count */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current text-red-500' : ''}`} />
                <span className="font-bold text-sm">{moment.likes?.length || 0}</span>
              </motion.div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-purple-400" />
            </div>
          )}
          
          {/* Anime Badge - Bottom Left */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg border border-white/50">
              <p className="font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-sm truncate">
                {moment.anime_name}
              </p>
              {moment.episode && (
                <p className="text-xs text-gray-600 font-semibold">{moment.episode}</p>
              )}
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/95 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform">
              <Eye className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-gray-800">View Moment</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags */}
          {moment.tags && moment.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {moment.tags.slice(0, 2).map((tag) => (
                <Badge 
                  key={tag} 
                  className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 border border-purple-200 text-xs font-semibold px-2 py-1"
                >
                  #{tag}
                </Badge>
              ))}
              {moment.tags.length > 2 && (
                <Badge className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1">
                  +{moment.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
            {moment.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
            {moment.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(moment.id, moment.likes);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-bold ${
                  hasLiked 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{moment.likes?.length || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-xl font-bold"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 font-semibold">
              {format(new Date(moment.created_date), 'MMM d')}
            </p>
          </div>
        </div>

        {/* Card Border Glow on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-3xl" style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          }}></div>
        </div>
      </Card>
    </motion.div>
  );
}