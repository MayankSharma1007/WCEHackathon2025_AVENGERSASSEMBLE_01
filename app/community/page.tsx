"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  Trash2,
  ThumbsUp,
  ThumbsUpIcon,
  Share2,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface TrendingItem {
  id: number;
  source: string;
  time: string;
  title: string;
  image: string;
}

const trendingItems: TrendingItem[] = [
  {
    id: 201,
    source: "Hindustan Times on MSN",
    time: "18h",
    title:
      "IMD predicts rain for Delhi-NCR, parts of north India on Holi | Weather updates",
    image: "/images/trending1.jpg",
  },
  {
    id: 202,
    source: "Indian Express",
    time: "2d",
    title:
      "Weather Update: IMD Warns Of 2 Cyclonic Formations, Heavy Rain Likely Across 18 States",
    image: "/images/trending2.jpg",
  },
  {
    id: 203,
    source: "India TV News",
    time: "1d",
    title:
      "Weather update: IMD predicts rainfall in these states till March 15 due to cyclones...",
    image: "/images/trending3.jpg",
  },
];

interface Post {
  id: number;
  author: string;
  location: string;
  content: string;
  image?: string;
  likes: number;
  time: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Fetch feed posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append("content", content);
    formData.append("author", "You");
    formData.append("location", "Your Location");
    formData.append("time", "Just now");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
      const updatedPosts = await response.json();
      setPosts(updatedPosts);
      setContent("");
      setImage(null);
      setImageFile(null);
      toast({
        title: "Success",
        description: "Your post has been shared with the community!",
      });
    } catch (error) {
      console.error("Error posting:", error);
      toast({
        title: "Error",
        description: "Failed to share your post.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch("/api/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });
      if (response.ok) {
        const updatedPosts = await response.json();
        setPosts(updatedPosts);
        toast({
          title: "Success",
          description: "Your post has been deleted.",
        });
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete your post.",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (postId: number) => {
    // Dummy like function: simply increment local like count
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      newSet.add(postId);
      return newSet;
    });
    toast({
      title: "Success",
      description: "You liked the post!",
    });
  };

  const handleShare = async (post: Post) => {
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    const shareData = {
      title: `Post by ${post.author}`,
      text: post.content,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Success",
          description: "Post shared successfully!",
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Success",
          description: "Post URL copied to clipboard!",
        });
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      toast({
        title: "Error",
        description: "Failed to share the post.",
        variant: "destructive",
      });
    }
  };

  const handleComment = (postId: number) => {
    // Dummy handler for comment button
    toast({
      title: "Info",
      description: "Comment functionality not implemented.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      {/* Small Create Post Button */}
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCreateForm((prev) => !prev)}
        >
          +
        </Button>
      </div>

      {/* Create Post Form */}
      {showCreateForm && (
        <Card className="p-4 mb-6">
          <form onSubmit={handlePost} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Image</label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <Upload className="h-4 w-4 mr-2" strokeWidth={1.5} />
                  Upload Image
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {image && (
                <div className="relative w-full max-w-md mx-auto">
                  <Image
                    src={image}
                    alt="Preview"
                    width={500}
                    height={300}
                    className="rounded-md"
                    style={{ objectFit: "contain" }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImage(null);
                      setImageFile(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    Remove
                  </Button>
                </div>
              )}
            </div>
            <Button type="submit" disabled={!content.trim()}>
              Post
            </Button>
          </form>
        </Card>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6">Community</h1>
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          {/* FEED TAB */}
          <TabsContent value="feed" className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-sm text-muted-foreground">
                        {post.location} • {post.time}
                      </p>
                    </div>
                    <p>{post.content}</p>
                    {post.image && (
                      <div className="relative w-full max-h-96 overflow-hidden rounded-md">
                        <Image
                          src={post.image}
                          alt="Post image"
                          width={500}
                          height={300}
                          className="rounded-md"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    )}
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                      >
                        {likedPosts.has(post.id) ? (
                          <ThumbsUpIcon
                            className="h-4 w-4 mr-2 fill-current text-blue-500"
                            strokeWidth={1.5}
                          />
                        ) : (
                          <ThumbsUp
                            className="h-4 w-4 mr-2"
                            strokeWidth={1.5}
                          />
                        )}
                        {post.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleComment(post.id)}
                      >
                        <MessageSquare
                          className="h-4 w-4 mr-2"
                          strokeWidth={1.5}
                        />
                        Comment
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(post)}
                      >
                        <Share2 className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        Share
                      </Button>
                      {post.author === "You" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" strokeWidth={1.5} />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* TRENDING TAB */}
          <TabsContent value="trending" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {trendingItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-4 space-y-3">
                    <div className="relative w-full h-40">
                      <Image
                        src={item.image}
                        alt="Trending item image"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{item.source}</span>
                      <span>{item.time}</span>
                    </div>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
