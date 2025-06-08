import { useArticles } from '../hooks/useArticles';
import { Link } from 'react-router-dom';
import { FaPlus, FaBookOpen, FaSearch } from 'react-icons/fa';
import ArticleCard from '../components/ArticleCard';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../utils/motion';

const ArticleList = () => {
  const { articles, loading, error, removeArticle, search } = useArticles();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await removeArticle(id);
      } catch (err) {
        console.error('Error deleting article:', err);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    search(searchQuery);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
        <Navbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center min-h-[80vh]"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <FaBookOpen className="mx-auto text-4xl text-white" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-white"
            >
              Loading articles...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
        <Navbar />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center items-center min-h-[80vh]"
        >
          <div className="text-center p-6 bg-white rounded-lg shadow-xl max-w-md">
            <h2 className="text-xl font-bold text-red-600">Error loading articles</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <motion.div variants={fadeIn('right', 'tween', 0.2, 1)}>
            <h1 className="text-3xl font-bold text-white">Latest Articles</h1>
            <p className="text-emerald-100 mt-2">Discover and share knowledge with our community</p>
          </motion.div>
          <motion.div variants={fadeIn('left', 'tween', 0.2, 1)}>
            <Link
              to="/articles/create"
              className="flex items-center gap-2 bg-white hover:bg-emerald-100 text-emerald-800 px-6 py-3 rounded-lg shadow-md transition-all duration-300 font-medium hover:shadow-lg"
            >
              <FaPlus /> Create Article
            </Link>
          </motion.div>
        </motion.div>

        <motion.form 
          onSubmit={handleSearch} 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-4 py-3 pl-12 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 hover:text-emerald-800 transition"
            >
              <FaSearch />
            </button>
          </div>
        </motion.form>

        {!articles || articles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white bg-opacity-90 rounded-xl shadow-sm"
          >
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <FaBookOpen className="mx-auto text-5xl text-emerald-300 mb-4" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-700">No articles yet</h3>
            <p className="mt-2 text-gray-500 mb-6">Be the first to share your knowledge</p>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/articles/create"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
              >
                <FaPlus /> Create Article
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  variants={fadeIn('up', 'spring', index * 0.1, 0.75)}
                  layout
                >
                  <ArticleCard 
                    article={article} 
                    onDelete={() => handleDelete(article.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ArticleList;