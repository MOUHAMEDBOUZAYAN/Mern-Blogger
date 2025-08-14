import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, Heart, Bookmark, Edit3, Trash2, 
  Eye, Clock, User, Share2, MoreVertical, Calendar,
  Tag, ArrowRight
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
    if (!dateString || dateString === 'Invalid Date') return 'Recently';
    
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
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
        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Image Section */}
        <div className="relative overflow-hidden">
          {article.imageUrl && !imageError ? (
            <motion.img
              variants={imageVariants}
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center">
              <Eye className="w-16 h-16 text-emerald-500 dark:text-emerald-400 opacity-60" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
              <Tag className="w-3 h-3 mr-1" />
              {article.category || 'General'}
            </span>
          </div>

          {/* Reading Time Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              <Clock className="w-3 h-3 mr-1" />
              {readingTime} min read
            </span>
          </div>

          {/* Action Menu */}
          {user && (user.id === article.userId || user.role === 'admin') && (
            <div className="absolute top-4 right-16" ref={menuRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <MoreVertical size={16} />
              </motion.button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                  >
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <Edit3 size={14} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Author and Date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {article.author || 'Anonymous'}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(article.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Title and Excerpt */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {article.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
              {article.content?.substring(0, 120) || 'No content available...'}
              {article.content && article.content.length > 120 && '...'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <motion.button 
                onClick={handleLike}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 group/like"
              >
                <Heart className={`w-5 h-5 transition-all ${
                  isLiked 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-gray-400 group-hover/like:text-red-500'
                }`} />
                <span className={`text-sm font-medium transition-colors ${
                  isLiked 
                    ? 'text-red-500' 
                    : 'text-gray-500 group-hover/like:text-red-500'
                }`}>
                  {likes}
                </span>
              </motion.button>
              
              <Link 
                to={`/articles/${article.id}#comments`}
                className="flex items-center space-x-2 group/comment"
              >
                <MessageCircle className="w-5 h-5 text-gray-400 group-hover/comment:text-emerald-500 transition-colors" />
                <span className="text-sm font-medium text-gray-500 group-hover/comment:text-emerald-500 transition-colors">
                  {article.commentCount || 0}
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={handleBookmark}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isBookmarked ? "Remove bookmark" : "Bookmark article"}
              >
                <Bookmark className={`w-5 h-5 transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`} />
              </motion.button>
              
              <motion.button 
                onClick={handleShare}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Share article"
              >
                <Share2 className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
              </motion.button>
            </div>
          </div>

          {/* Read More Button */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link
              to={`/articles/${article.id}`}
              className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm group/readmore"
            >
              Read more
              <ArrowRight className="w-4 h-4 ml-1 group-hover/readmore:translate-x-1 transition-transform" />
            </Link>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delete Article
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete "{article.title}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsDeleting(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArticleCard;