import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const ArticleContext = createContext(null);

export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder for article service functions
  const articleService = {
    getArticles: async () => {
      // Simulate API call
      return new Promise(resolve => setTimeout(() => resolve([]), 500));
    },
    createArticle: async (article) => {
      // Simulate API call
      return new Promise(resolve => setTimeout(() => resolve({ id: Date.now(), ...article }), 500));
    },
    updateArticle: async (id, updates) => {
      // Simulate API call
      return new Promise(resolve => setTimeout(() => resolve({ id, ...updates }), 500));
    },
    deleteArticle: async (id) => {
      // Simulate API call
      return new Promise(resolve => setTimeout(() => resolve(id), 500));
    },
  };

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await articleService.getArticles();
      setArticles(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }, [articleService]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const addArticle = async (article) => {
    try {
      const newArticle = await articleService.createArticle(article);
      setArticles(prev => [...prev, newArticle]);
      toast.success('Article created successfully!');
      return newArticle;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create article');
      throw err;
    }
  };

  const editArticle = async (id, updates) => {
    try {
      const updatedArticle = await articleService.updateArticle(id, updates);
      setArticles(prev => prev.map(art => art.id === id ? updatedArticle : art));
      toast.success('Article updated successfully!');
      return updatedArticle;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update article');
      throw err;
    }
  };

  const removeArticle = async (id) => {
    try {
      await articleService.deleteArticle(id);
      setArticles(prev => prev.filter(art => art.id !== id));
      toast.success('Article deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete article');
      throw err;
    }
  };

  return (
    <ArticleContext.Provider value={{
      articles,
      loading,
      error,
      fetchArticles,
      addArticle,
      editArticle,
      removeArticle
    }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};
