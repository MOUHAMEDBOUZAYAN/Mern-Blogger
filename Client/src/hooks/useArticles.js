import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  getArticles, 
  createArticle, 
  updateArticle, 
  deleteArticle,
  searchArticles,
  filterArticlesByCategory,
  likeArticle,
  bookmarkArticle
} from '../api/articleService';

export const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    setLoading(true);
    setError(null);
    
    const subscription = getArticles().subscribe({
      next: (data) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setArticles([]);
        setLoading(false);
        toast.error("Failed to load articles");
      }
    });
    
    return () => subscription.unsubscribe();
  };

  const addArticle = (article) => {
    return new Promise((resolve, reject) => {
      createArticle(article).subscribe({
        next: (newArticle) => {
          setArticles(prev => [...prev, newArticle]);
          toast.success("Article added successfully");
          resolve(newArticle);
        },
        error: (err) => {
          setError(err.message);
          toast.error("Failed to add article");
          reject(err);
        }
      });
    });
  };

  const editArticle = (id, updatedArticle) => {
    return new Promise((resolve, reject) => {
      updateArticle(id, updatedArticle).subscribe({
        next: (updated) => {
          setArticles(prev => prev.map(article => 
            article.id === id ? updated : article
          ));
          toast.success("Article updated successfully");
          resolve(updated);
        },
        error: (err) => {
          setError(err.message);
          toast.error("Failed to update article");
          reject(err);
        }
      });
    });
  };

  const removeArticle = (id) => {
    return new Promise((resolve, reject) => {
      deleteArticle(id).subscribe({
        next: () => {
          setArticles(prev => prev.filter(article => article.id !== id));
          toast.success("Article deleted successfully");
          resolve();
        },
        error: (err) => {
          setError(err.message);
          toast.error("Failed to delete article");
          reject(err);
        }
      });
    });
  };

  const search = (query) => {
    setLoading(true);
    setError(null);
    
    searchArticles(query).subscribe({
      next: (results) => {
        setArticles(Array.isArray(results) ? results : []);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
        toast.error("Search failed");
      }
    });
  };

  const filterByCategory = (categoryId) => {
    setLoading(true);
    setError(null);
    
    filterArticlesByCategory(categoryId).subscribe({
      next: (filtered) => {
        setArticles(Array.isArray(filtered) ? filtered : []);
        setLoading(false);
      },
      error: (err) => {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to filter articles");
      }
    });
  };

  const like = (id) => {
    return new Promise((resolve, reject) => {
      likeArticle(id).subscribe({
        next: (updated) => {
          setArticles(prev => prev.map(article => 
            article.id === id ? updated : article
          ));
          resolve(updated);
        },
        error: (err) => {
          setError(err.message);
          toast.error("Failed to like article");
          reject(err);
        }
      });
    });
  };

  const bookmark = (id) => {
    return new Promise((resolve, reject) => {
      bookmarkArticle(id).subscribe({
        next: (updated) => {
          setArticles(prev => prev.map(article => 
            article.id === id ? updated : article
          ));
          resolve(updated);
        },
        error: (err) => {
          setError(err.message);
          toast.error("Failed to bookmark article");
          reject(err);
        }
      });
    });
  };

  return { 
    articles, 
    loading, 
    error, 
    addArticle, 
    editArticle, 
    removeArticle,
    search, 
    filterByCategory,
    fetchArticles,
    likeArticle: like,
    bookmarkArticle: bookmark
  };
};