import { useNavigate } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../hooks/useAuth';
import ArticleForm from '../components/ArticleForm';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const CreateArticle = () => {
  const { addArticle } = useArticles();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await addArticle({
        ...values,
        userId: user.id,
        author: user.name,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: []
      });
      toast.success('Article created successfully!');
      navigate('/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error('Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-4xl mx-auto">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-emerald-200 transition mb-8"
          >
            <FiArrowLeft className="mr-2" />
            Back to Articles
          </motion.button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-2"
              >
                Create New Article
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="opacity-90"
              >
                Share your knowledge with the community
              </motion.p>
            </div>
            
            <div className="p-6 md:p-8">
              <ArticleForm 
                onSubmit={handleSubmit} 
                loading={isSubmitting}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="font-medium text-lg text-gray-800 mb-4">Tips for a good article</h3>
            <ul className="space-y-3 text-gray-600">
              {[
                "Clear and catchy title",
                "Structure your content with paragraphs",
                "Add relevant images",
                "Choose the right category"
              ].map((tip, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start"
                >
                  <span className="text-emerald-500 mr-2">•</span>
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateArticle;