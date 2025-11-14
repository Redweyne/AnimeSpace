import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, Sparkles, Loader2, X, Image as ImageIcon, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function CreateMoment() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    anime_name: "",
    episode: "",
    description: "",
    image_url: "",
    tags: []
  });
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => base44.auth.redirectToLogin());
  }, []);

  const createMomentMutation = useMutation({
    mutationFn: (data) => base44.entities.AnimeMoment.create(data),
    onSuccess: () => {
      navigate(createPageUrl("Feed"));
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData({ ...formData, image_url: file_url });
    setUploading(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMomentMutation.mutate(formData);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">Create New Moment</span>
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Share Your Epic Moment
          </h1>
          <p className="text-xl text-gray-600">Tell us what made this scene unforgettable</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label className="text-lg font-bold text-gray-800">Moment Screenshot</Label>
                <div className="relative">
                  {formData.image_url ? (
                    <div className="relative group">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-80 object-cover rounded-2xl shadow-xl"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-2xl flex items-center justify-center">
                        <Button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: "" })}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 rounded-full"
                        >
                          <X className="w-5 h-5 mr-2" />
                          Remove
                        </Button>
                      </div>
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span className="font-bold text-sm">Uploaded</span>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-purple-300 rounded-2xl cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-500 hover:bg-purple-100/50 transition-all group">
                      <div className="flex flex-col items-center justify-center py-12">
                        {uploading ? (
                          <>
                            <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" />
                            <p className="text-lg font-bold text-purple-600">Uploading...</p>
                          </>
                        ) : (
                          <>
                            <div className="relative mb-4">
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                                <ImageIcon className="w-10 h-10 text-white" />
                              </div>
                            </div>
                            <p className="text-xl font-bold text-gray-700 mb-2">Upload Screenshot</p>
                            <p className="text-sm text-gray-500">PNG, JPG or GIF (MAX. 10MB)</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-lg font-bold text-gray-800">
                  Moment Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., The Most Epic Power-Up Scene"
                  required
                  className="text-lg py-6 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                />
              </div>

              {/* Anime Name & Episode */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="anime_name" className="text-lg font-bold text-gray-800">
                    Anime Name *
                  </Label>
                  <Input
                    id="anime_name"
                    value={formData.anime_name}
                    onChange={(e) => setFormData({ ...formData, anime_name: e.target.value })}
                    placeholder="e.g., One Piece"
                    required
                    className="text-lg py-6 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="episode" className="text-lg font-bold text-gray-800">
                    Episode / Arc
                  </Label>
                  <Input
                    id="episode"
                    value={formData.episode}
                    onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
                    placeholder="e.g., Episode 1015"
                    className="text-lg py-6 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-bold text-gray-800">
                  Why Is This Moment Special? *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what made this moment special and why it resonated with you..."
                  rows={6}
                  required
                  className="text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl resize-none"
                />
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-lg font-bold text-gray-800">Tags</Label>
                <div className="flex gap-3">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="e.g., action, emotional, plot-twist"
                    className="text-lg py-6 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag}
                    className="px-8 py-6 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {formData.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 cursor-pointer hover:from-purple-200 hover:to-pink-200 px-4 py-2 text-sm font-bold border-2 border-purple-300"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      #{tag}
                      <X className="w-4 h-4 ml-2" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("Feed"))}
                  className="flex-1 py-6 text-lg font-bold rounded-xl border-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMomentMutation.isPending}
                  className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {createMomentMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Post Moment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}