import { create } from 'zustand';
import axios from 'axios';
import { use } from 'react';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  
  loadUser: async () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;

    if (!token) {
      set({ user: null, loading: false });
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      const res = await axios.get('/api/auth/me');
      set({ user: res.data.user ?? null });
    } catch (err) {
      console.error('Error loading user', err);

      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];

      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password) => {
    const res = await axios.post('/api/auth/register', { email, password });

    const { token, user } = res.data;

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    set({ user });

    return res.data;
  },

  signIn: async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });

    const { token, user } = res.data;

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    set({ user });

    return res.data;
  },

  signOut: () => {
    
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    set({ user: null });
  }
}));