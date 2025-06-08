import axios from 'axios';
import { from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:3001/articles';

// Configure default headers for all requests
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for error handling
axios.interceptors.request.use(
  config => {
    // Add authorization header if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const getArticles = () => {
  return from(axios.get(API_URL)).pipe(
    map(response => Array.isArray(response.data) ? response.data : []),
    catchError(error => {
      console.error('Error fetching articles:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch articles');
    })
  );
};

export const getArticleById = (id) => {
  return from(axios.get(`${API_URL}/${id}`)).pipe(
    map(response => response.data),
    catchError(error => {
      console.error(`Error fetching article ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to fetch article');
    })
  );
};

export const createArticle = (article) => {
  return from(axios.post(API_URL, article)).pipe(
    map(response => response.data),
    catchError(error => {
      console.error('Error creating article:', error);
      throw new Error(error.response?.data?.message || 'Failed to create article');
    })
  );
};

export const updateArticle = (id, article) => {
  return from(axios.put(`${API_URL}/${id}`, article)).pipe(
    map(response => response.data),
    catchError(error => {
      console.error(`Error updating article ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to update article');
    })
  );
};

export const deleteArticle = (id) => {
  return from(axios.delete(`${API_URL}/${id}`)).pipe(
    map(response => response.data),
    catchError(error => {
      console.error(`Error deleting article ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to delete article');
    })
  );
};

export const searchArticles = (query) => {
  return from(axios.get(`${API_URL}?q=${encodeURIComponent(query)}`)).pipe(
    map(response => Array.isArray(response.data) ? response.data : []),
    catchError(error => {
      console.error('Error searching articles:', error);
      throw new Error(error.response?.data?.message || 'Failed to search articles');
    })
  );
};

export const filterArticlesByCategory = (categoryId) => {
  return from(axios.get(`${API_URL}?categoryId=${categoryId}`)).pipe(
    map(response => Array.isArray(response.data) ? response.data : []),
    catchError(error => {
      console.error('Error filtering articles by category:', error);
      throw new Error(error.response?.data?.message || 'Failed to filter articles');
    })
  );
};

export const likeArticle = (id) => {
  return from(axios.patch(`${API_URL}/${id}/like`)).pipe(
    map(response => response.data),
    catchError(error => {
      console.error(`Error liking article ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to like article');
    })
  );
};

export const bookmarkArticle = (id) => {
  return from(axios.patch(`${API_URL}/${id}/bookmark`)).pipe(
    map(response => response.data),
    catchError(error => {
      console.error(`Error bookmarking article ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Failed to bookmark article');
    })
  );
};