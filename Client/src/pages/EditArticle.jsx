import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../hooks/useAuth';
import ArticleForm from '../components/ArticleForm';
import { getArticleById } from '../api/articleService';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const EditArticle = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { editArticle } = useArticles();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id).toPromise();
        if (!data) {
          throw new Error('Article not found');
        }
        setArticle(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleSubmit = async (values) => {
    // Basic validation
    if (!values.title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    
    if (!values.content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }
    
    try {
      await editArticle(id, values);
      toast.success("Article updated successfully");
      navigate(/articles/`${id}`);
    } catch (error) {
      toast.error("Failed to update article");
      console.error('Error updating article:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="mx-auto text-4xl text-white animate-pulse">✏</div>
              <p className="mt-4 text-white">Loading article for editing...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
              <h2 className="text-xl font-bold text-red-600">Error loading article</h2>
              <p className="mt-2 text-gray-600">{error}</p>
              <button
                onClick={() => navigate('/articles')}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
              >
                Back to Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
              <h2 className="text-xl font-bold text-gray-800">Article not found</h2>
              <p className="mt-2 text-gray-600">The article you're trying to edit doesn't exist.</p>
              <button
                onClick={() => navigate('/articles')}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
              >
                Back to Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user && user.id !== article.userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
              <h2 className="text-xl font-bold text-red-600">Unauthorized</h2>
              <p className="mt-2 text-gray-600">You are not authorized to edit this article</p>
              <button
                onClick={() => navigate('/articles')}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
              >
                Back to Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white mb-6 hover:text-emerald-200 transition"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Article</h1>
          <ArticleForm 
            initialValues={{
              title: article.title,
              content: article.content,
              categoryId: article.categoryId,
              category: article.category,
              image: article.image || ''
            }} 
            onSubmit={handleSubmit} 
          />
        </div>
      </div>
    </div>
  );
};

export default EditArticle;