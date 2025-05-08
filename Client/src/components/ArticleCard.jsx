import { Link, useNavigate } from 'react-router-dom';
import { FaRegComment, FaHeart, FaRegHeart, FaRegBookmark, FaBookmark, FaEdit, FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { deleteArticle, likeArticle, bookmarkArticle } from '../api/articleService';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ArticleCard = ({ article, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(article.isLiked || false);
  const [likes, setLikes] = useState(article.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to like articles");
      return;
    }
    
    likeArticle(article.id).subscribe({
      next: (updated) => {
        setIsLiked(updated.isLiked);
        setLikes(updated.likes);
        toast.success(updated.isLiked ? "Article liked" : "Article unliked");
      },
      error: (err) => {
        console.error('Error liking article:', err);
        toast.error("Failed to like article");
      }
    });
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to bookmark articles");
      return;
    }
    
    bookmarkArticle(article.id).subscribe({
      next: (updated) => {
        setIsBookmarked(updated.isBookmarked);
        toast.success(updated.isBookmarked ? "Article bookmarked" : "Bookmark removed");
      },
      error: (err) => {
        console.error('Error bookmarking article:', err);
        toast.error("Failed to bookmark article");
      }
    });
  };

  const confirmDeleteArticle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Open a custom confirmation dialog or modal here
    setIsDeleting(true);
  };
  
  const handleDelete = (confirmed) => {
    setIsDeleting(false);
    
    if (!confirmed) return;
    
    deleteArticle(article.id).subscribe({
      next: () => {
        if (onDelete) {
          onDelete(article.id);
          toast.success("Article deleted successfully");
        }
      },
      error: (err) => {
        console.error('Error deleting article:', err);
        toast.error("Failed to delete article");
      }
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/articles/${article.id}/edit`);
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3
      }
    }
  };

  // Custom delete confirmation dialog
  const DeleteConfirmation = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setIsDeleting(false)}
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg p-6 w-80 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-800 mb-3">Confirm Delete</h3>
        <p className="text-gray-600 mb-5">Are you sure you want to delete this article? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => handleDelete(false)}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(true)}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {isDeleting && <DeleteConfirmation />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <div className="h-full">
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col border border-gray-100"
          >
            <Link to={`/articles/${article.id}`} className="block">
              {article.image && (
                <motion.div 
                  className="overflow-hidden"
                  variants={imageVariants}
                  animate={isHovered ? "hover" : "initial"}
                >
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
              )}
            </Link>
            
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full transition-colors duration-300 hover:bg-emerald-200">
                  {article.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <Link to={`/articles/${article.id}`} className="block">
                <h2 className="text-xl font-bold text-gray-800 mb-3 transition-colors duration-300 hover:text-emerald-600">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                  {article.content.substring(0, 200)}...
                </p>
              </Link>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-gray-500">
                  <motion.button 
                    onClick={handleLike}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-1 group"
                  >
                    {isLiked ? (
                      <FaHeart className="text-red-500 transition-colors duration-300" />
                    ) : (
                      <FaRegHeart className="transition-colors duration-300 group-hover:text-red-500" />
                    )}
                    <span className="text-xs transition-colors duration-300 group-hover:text-red-500">
                      {likes}
                    </span>
                  </motion.button>
                  
                  <div className="flex items-center space-x-1 group">
                    <FaRegComment className="text-sm transition-colors duration-300 group-hover:text-emerald-500" />
                    <span className="text-xs transition-colors duration-300 group-hover:text-emerald-500">
                      {article.commentCount || 0}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {user && user.id === article.userId && (
                    <>
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <button
                          onClick={handleEdit}
                          className="text-gray-400 hover:text-emerald-500 transition-colors duration-300"
                          aria-label="Edit article"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.1 }}>
                        <button
                          onClick={confirmDeleteArticle}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                          aria-label="Delete article"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </motion.div>
                    </>
                  )}
                  
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <button 
                      onClick={handleBookmark}
                      className="text-gray-400 hover:text-yellow-500 transition-colors duration-300"
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark article"}
                    >
                      {isBookmarked ? (
                        <FaBookmark className="text-yellow-500" />
                      ) : (
                        <FaRegBookmark />
                      )}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default ArticleCard;