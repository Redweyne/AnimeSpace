import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MessageCircle, Send, Loader2, Sparkles, Flame } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function MomentDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState("");
  
  const urlParams = new URLSearchParams(window.location.search);
  const momentId = urlParams.get('id');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: moment, isLoading: momentLoading } = useQuery({
    queryKey: ['moment', momentId],
    queryFn: async () => {
      const moments = await base44.entities.AnimeMoment.list();
      return moments.find(m => m.id === momentId);
    },
    enabled: !!momentId,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', momentId],
    queryFn: () => base44.entities.Comment.filter({ moment_id: momentId }, '-created_date'),
    initialData: [],
    enabled: !!momentId,
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      const userEmail = user?.email;
      if (!userEmail || !moment) return;
      
      const hasLiked = moment.likes?.includes(userEmail);
      const newLikes = hasLiked
        ? moment.likes.filter(email => email !== userEmail)
        : [...(moment.likes || []), userEmail];
      
      await base44.entities.AnimeMoment.update(momentId, { likes: newLikes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moment', momentId] });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: (content) => base44.entities.Comment.create({
      moment_id: momentId,
      content
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', momentId] });
      setCommentText("");
    },
  });

  const handleLike = () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    toggleLikeMutation.mutate();
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    if (commentText.trim()) {
      createCommentMutation.mutate(commentText);
    }
  };

  if (momentLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Card className="p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-96 w-full mb-4 rounded-2xl" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
      </div>
    );
  }

  if (!moment) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Moment not found</p>
      </div>
    );
  }

  const hasLiked = user?.email && moment.likes?.includes(user.email);
  const isPopular = (moment.likes?.length || 0) >= 3;

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {moment.image_url && (
          <div className="absolute inset-0 opacity-20">
            <img src={moment.image_url} alt="" className="w-full h-full object-cover blur-sm" />
          </div>
        )}
        
        <div className="relative max-w-5xl mx-auto px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Feed"))}
            className="mb-6 text-white hover:bg-white/20 border border-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 text-sm px-3 py-1">
                  {moment.anime_name}
                </Badge>
                {moment.episode && (
                  <Badge variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/30">
                    {moment.episode}
                  </Badge>
                )}
                {isPopular && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
                    <Flame className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{moment.title}</h1>
              <p className="text-purple-100 text-sm">
                Posted {format(new Date(moment.created_date), 'MMMM d, yyyy')} by {moment.created_by}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-2xl bg-white overflow-hidden mb-8">
            {moment.image_url && (
              <div className="relative">
                <img 
                  src={moment.image_url} 
                  alt={moment.title}
                  className="w-full max-h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}

            <div className="p-8">
              {moment.tags && moment.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {moment.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      className="bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 px-3 py-1"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
                {moment.description}
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleLike}
                  size="lg"
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    hasLiked 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{moment.likes?.length || 0} Likes</span>
                </Button>
                <div className="flex items-center gap-2 text-gray-600 px-4 py-3 bg-gray-50 rounded-xl">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">{comments.length} Comments</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              Discussion
            </h2>
            <p className="text-gray-600">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</p>
          </div>

          {user && (
            <Card className="p-6 mb-8 border-none shadow-xl bg-gradient-to-br from-white to-purple-50/30">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts about this moment..."
                  rows={4}
                  className="resize-none border-purple-200 focus:border-purple-400 bg-white"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!commentText.trim() || createCommentMutation.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 shadow-lg"
                  >
                    {createCommentMutation.isPending ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    Post Comment
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <AnimatePresence>
            <div className="space-y-4">
              {commentsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="p-6">
                      <Skeleton className="h-4 w-32 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </Card>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <Card className="p-12 text-center border-none shadow-xl bg-gradient-to-br from-white to-gray-50">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No comments yet</h3>
                  <p className="text-gray-600">Be the first to share your thoughts!</p>
                </Card>
              ) : (
                comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {comment.created_by[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-900">{comment.created_by}</span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(comment.created_date), 'MMM d, yyyy • h:mm a')}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}