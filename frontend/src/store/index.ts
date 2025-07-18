import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setToken: (token) => set({ token }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

interface AppState {
  sidebarOpen: boolean;
  currentSubject: string | null;
  currentChapter: string | null;
  darkMode: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  
  setSidebarOpen: (open: boolean) => void;
  setCurrentSubject: (subject: string | null) => void;
  setCurrentChapter: (chapter: string | null) => void;
  toggleDarkMode: () => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      currentSubject: null,
      currentChapter: null,
      darkMode: false,
      notifications: [],
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setCurrentSubject: (subject) => set({ currentSubject: subject }),
      
      setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
      
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
          },
        ],
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id),
      })),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        currentSubject: state.currentSubject,
        currentChapter: state.currentChapter,
      }),
    }
  )
);

interface LearningState {
  currentContent: any | null;
  progress: Record<string, number>;
  bookmarks: string[];
  recentlyViewed: string[];
  
  setCurrentContent: (content: any) => void;
  updateProgress: (contentId: string, progress: number) => void;
  addBookmark: (contentId: string) => void;
  removeBookmark: (contentId: string) => void;
  addToRecentlyViewed: (contentId: string) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      currentContent: null,
      progress: {},
      bookmarks: [],
      recentlyViewed: [],
      
      setCurrentContent: (content) => set({ currentContent: content }),
      
      updateProgress: (contentId, progress) => set((state) => ({
        progress: {
          ...state.progress,
          [contentId]: progress,
        },
      })),
      
      addBookmark: (contentId) => set((state) => ({
        bookmarks: [...state.bookmarks, contentId],
      })),
      
      removeBookmark: (contentId) => set((state) => ({
        bookmarks: state.bookmarks.filter(id => id !== contentId),
      })),
      
      addToRecentlyViewed: (contentId) => set((state) => ({
        recentlyViewed: [
          contentId,
          ...state.recentlyViewed.filter(id => id !== contentId),
        ].slice(0, 10), // Keep only last 10 items
      })),
    }),
    {
      name: 'learning-storage',
    }
  )
);

interface TestState {
  currentTest: any | null;
  currentAttempt: any | null;
  answers: Record<string, any>;
  timeRemaining: number;
  
  setCurrentTest: (test: any) => void;
  setCurrentAttempt: (attempt: any) => void;
  updateAnswer: (questionId: string, answer: any) => void;
  setTimeRemaining: (time: number) => void;
  clearTest: () => void;
}

export const useTestStore = create<TestState>((set) => ({
  currentTest: null,
  currentAttempt: null,
  answers: {},
  timeRemaining: 0,
  
  setCurrentTest: (test) => set({ currentTest: test }),
  
  setCurrentAttempt: (attempt) => set({ currentAttempt: attempt }),
  
  updateAnswer: (questionId, answer) => set((state) => ({
    answers: {
      ...state.answers,
      [questionId]: answer,
    },
  })),
  
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  
  clearTest: () => set({
    currentTest: null,
    currentAttempt: null,
    answers: {},
    timeRemaining: 0,
  }),
}));

interface AIState {
  chatHistory: Array<{
    id: string;
    type: 'user' | 'ai';
    message: string;
    timestamp: number;
    context?: any;
  }>;
  isProcessing: boolean;
  
  addMessage: (message: Omit<AIState['chatHistory'][0], 'id' | 'timestamp'>) => void;
  setProcessing: (processing: boolean) => void;
  clearHistory: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  chatHistory: [],
  isProcessing: false,
  
  addMessage: (message) => set((state) => ({
    chatHistory: [
      ...state.chatHistory,
      {
        ...message,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      },
    ],
  })),
  
  setProcessing: (processing) => set({ isProcessing: processing }),
  
  clearHistory: () => set({ chatHistory: [] }),
}));

// Custom hooks for easier usage
export const useAuth = () => useAuthStore();
export const useApp = () => useAppStore();
export const useLearning = () => useLearningStore();
export const useTest = () => useTestStore();
export const useAI = () => useAIStore();
