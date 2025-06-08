import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, Heart, Bookmark, Edit3, Trash2, 
  Eye, Clock, User, Share2, MoreVertical 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ArticleCard = ({ article, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(article.isLiked || false);
  const [likes, setLikes] = useState(article.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const menuRef = useRef(null);

  // Calculate reading time
  useEffect(() => {
    const wordsPerMinute = 200;
    const wordCount = article.content?.split(' ').length || 0;
    const time = Math.ceil(wordCount / wordsPerMinute);
    setReadingTime(time);
  }, [article.content]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please log in to like articles");
      navigate('/login');
      return;
    }
    
    try {
      // Optimistic update
      setIsLiked(!isLiked);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      
      // API call would go here
      // const result = await likeArticle(article.id);
      
      toast.success(isLiked ? "Like removed" : "Article liked");
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikes(prev => isLiked ? prev + 1 : prev - 1);
      toast.error("Failed to like article");
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please log in to bookmark articles");
      navigate('/login');
      return;
    }
    
    try {
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Bookmark removed" : "Article bookmarked");
    } catch (error) {
      setIsBookmarked(isBookmarked);
      toast.error("Failed to bookmark article");
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/articles/${article.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.content.substring(0, 100) + '...',
          url: url
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare(url);
        }
      }
    } else {
      fallbackShare(url);
    }
  };

  const fallbackShare = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/articles/${article.id}/edit`);
    setIsMenuOpen(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleting(true);
    setIsMenuOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(article.id);
      toast.success("Article deleted successfully");
    } catch (error) {
      toast.error("Failed to delete article");
    }
    setIsDeleting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      <motion.article
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col hover:border-emerald-200 transition-all duration-300"
      >
        {/* Image Section */}
        <Link to={`/articles/${article.id}`} className="block relative overflow-hidden">
          {article.image && !imageError ? (
            <motion.img 
              src={article.image} 
              alt={article.title}
              variants={imageVariants}
              className="w-full h-48 object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center">
              <div className="text-center text-white">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <span className="text-sm font-medium opacity-90">
                  {article.category || 'Article'}
                </span>
              </div>
            </div>
          )}
          
          {/* Overlay with reading time */}
          <div className="absolute top-3 left-3">
            <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {readingTime} min read
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold rounded-full border border-white/20">
              {article.category || 'General'}
            </span>
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Header with menu */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-1" />
              <span className="font-medium">{article.author || 'Anonymous'}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(article.createdAt)}</span>
            </div>
            
            {user && user.id === article.userId && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
                
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]"
                    >
                      <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          {/* Title and Content */}
          <Link to={`/articles/${article.id}`} className="block flex-grow">
            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {article.title}
            </h2>
            
            <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
              {article.content?.substring(0, 150)}...
            </p>
          </Link>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <motion.button 
                onClick={handleLike}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 group/like"
              >
                <Heart className={`w-4 h-4 transition-all ${
                  isLiked 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-gray-400 group-hover/like:text-red-500'
                }`} />
                <span className={`text-sm transition-colors ${
                  isLiked 
                    ? 'text-red-500' 
                    : 'text-gray-500 group-hover/like:text-red-500'
                }`}>
                  {likes}
                </span>
              </motion.button>
              
              <Link 
                to={`/articles/${article.id}#comments`}
                className="flex items-center space-x-1 group/comment"
              >
                <MessageCircle className="w-4 h-4 text-gray-400 group-hover/comment:text-emerald-500 transition-colors" />
                <span className="text-sm text-gray-500 group-hover/comment:text-emerald-500 transition-colors">
                  {article.commentCount || 0}
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={handleBookmark}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title={isBookmarked ? "Remove bookmark" : "Bookmark article"}
              >
                <Bookmark className={`w-4 h-4 transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`} />
              </motion.button>
              
              <motion.button 
                onClick={handleShare}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Share article"
              >
                <Share2 className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDeleting(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-96 shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Article</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "<span className="font-medium">{article.title}</span>"? 
                  This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleting(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArticleCard;