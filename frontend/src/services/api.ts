import axios, { AxiosResponse } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  class: number;
  board: string;
  googleId?: string;
  subscription: {
    type: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  progress: {
    totalXP: number;
    currentLevel: number;
    badges: Array<{
      name: string;
      earnedAt: string;
      description: string;
    }>;
    completedChapters: Array<{
      subject: string;
      chapter: string;
      completedAt: string;
      score: number;
    }>;
    bookmarks: Array<{
      subject: string;
      chapter: string;
      topic: string;
      bookmarkedAt: string;
    }>;
  };
  remainingDays: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Content {
  _id: string;
  title: string;
  description: string;
  subject: string;
  class: number;
  chapter: string;
  topic: string;
  type: string;
  difficulty: string;
  content: {
    text?: string;
    videoUrl?: string;
    pdfUrl?: string;
    imageUrls?: string[];
  };
  keyPoints: string[];
  views: number;
  likes: number;
  bookmarks: number;
  createdAt: string;
}

export interface Doubt {
  _id: string;
  title: string;
  description: string;
  subject: string;
  chapter: string;
  topic?: string;
  type: string;
  difficulty: string;
  status: string;
  answers: Array<{
    _id: string;
    answerType: string;
    content: string;
    helpful: number;
    notHelpful: number;
    createdAt: string;
  }>;
  createdAt: string;
}

export interface Test {
  _id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  difficulty: string;
  duration: number;
  totalMarks: number;
  questions: Array<{
    _id: string;
    question: string;
    type: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
    marks: number;
  }>;
  schedule: {
    startDate: string;
    endDate: string;
  };
}

// Auth API
export const authAPI = {
  register: (data: {
    name: string;
    email: string;
    password?: string; // Optional for Google Sign-In
    class: number;
    board: string;
  }): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> =>
    api.post('/auth/register', data),

  login: (data: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> =>
    api.post('/auth/login', data),

  googleLogin: (data: {
    idToken: string;
  }): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> =>
    api.post('/auth/google', data),

  getMe: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get('/auth/me'),

  updateProfile: (data: Partial<User>): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.post('/auth/update-profile', data),

  logout: (): Promise<AxiosResponse<ApiResponse<{}>>> =>
    api.post('/auth/logout'),
};

// Content API
export const contentAPI = {
  getContent: (params?: {
    subject?: string;
    chapter?: string;
    type?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AxiosResponse<ApiResponse<{ content: Content[]; pagination: any }>>> =>
    api.get('/content', { params }),

  getContentById: (id: string): Promise<AxiosResponse<ApiResponse<Content>>> =>
    api.get(`/content/${id}`),

  getSubjects: (studentClass: number): Promise<AxiosResponse<ApiResponse<string[]>>> =>
    api.get(`/content/subjects/${studentClass}`),

  getChapters: (subject: string): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get(`/content/chapters/${subject}`),

  getFeatured: (): Promise<AxiosResponse<ApiResponse<Content[]>>> =>
    api.get('/content/featured'),

  getPopular: (): Promise<AxiosResponse<ApiResponse<Content[]>>> =>
    api.get('/content/popular'),

  bookmarkContent: (id: string): Promise<AxiosResponse<ApiResponse<{ bookmarked: boolean }>>> =>
    api.post(`/content/bookmark/${id}`),

  getBookmarks: (): Promise<AxiosResponse<ApiResponse<any[]>>> =>
    api.get('/content/bookmarks'),

  markComplete: (id: string, score?: number): Promise<AxiosResponse<ApiResponse<{ completed: boolean }>>> =>
    api.post(`/content/complete/${id}`, { score }),

  getProgress: (): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get('/content/progress'),
};

// Doubts API
export const doubtsAPI = {
  createDoubt: (data: {
    title: string;
    description: string;
    subject: string;
    chapter: string;
    topic?: string;
    type: string;
    difficulty?: string;
  }): Promise<AxiosResponse<ApiResponse<{ doubt: Doubt; aiAnswer?: string; hasAIAnswer: boolean }>>> =>
    api.post('/doubts', data),

  getDoubts: (params?: {
    status?: string;
    subject?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<ApiResponse<{ doubts: Doubt[]; pagination: any }>>> =>
    api.get('/doubts', { params }),

  getDoubtById: (id: string): Promise<AxiosResponse<ApiResponse<Doubt>>> =>
    api.get(`/doubts/${id}`),

  addAnswer: (id: string, content: string): Promise<AxiosResponse<ApiResponse<Doubt>>> =>
    api.post(`/doubts/${id}/answer`, { content }),

  resolveDoubt: (id: string): Promise<AxiosResponse<ApiResponse<Doubt>>> =>
    api.post(`/doubts/${id}/resolve`),

  submitFeedback: (id: string, rating: number, comment?: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post(`/doubts/${id}/feedback`, { rating, comment }),

  getPopularDoubts: (): Promise<AxiosResponse<ApiResponse<Doubt[]>>> =>
    api.get('/doubts/popular'),

  voteDoubt: (id: string, type: 'upvote' | 'downvote'): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post(`/doubts/${id}/vote`, { type }),
};

// AI API
export const aiAPI = {
  simplifyText: (text: string, subject?: string): Promise<AxiosResponse<ApiResponse<{
    simplified: string;
    example: string;
    keyPoints: string[];
    definitions: Record<string, string>;
  }>>> =>
    api.post('/ai/simplify', { text, subject }),

  explainConcept: (concept: string, subject: string): Promise<AxiosResponse<ApiResponse<{
    concept: string;
    explanation: string;
    subject: string;
    studentClass: number;
  }>>> =>
    api.post('/ai/explain', { concept, subject }),

  generateSummary: (content: string, topic?: string): Promise<AxiosResponse<ApiResponse<{
    originalContent: string;
    summary: string;
    topic?: string;
    studentClass: number;
  }>>> =>
    api.post('/ai/generate-summary', { content, topic }),

  generateQuestions: (
    subject: string,
    chapter: string,
    difficulty?: string,
    count?: number
  ): Promise<AxiosResponse<ApiResponse<{
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  }>>> =>
    api.post('/ai/generate-questions', { subject, chapter, difficulty, count }),

  generateStudyPlan: (
    subject: string,
    timeFrame?: string
  ): Promise<AxiosResponse<ApiResponse<{
    studyPlan: {
      weeklyPlan: string[];
      dailySchedule: string[];
      priorities: string[];
      practiceSchedule: string[];
      revisionStrategy: string[];
    };
  }>>> =>
    api.post('/ai/study-plan', { subject, timeFrame }),

  getUsageStats: (): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get('/ai/usage-stats'),

  submitFeedback: (
    type: string,
    rating: number,
    comment?: string
  ): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post('/ai/feedback', { type, rating, comment }),

  chat: (message: string, history: Array<{ role: string; text: string }>, systemInstruction?: string): Promise<AxiosResponse<ApiResponse<{ response: string }>>> =>
    api.post('/ai/chat', { message, history, systemInstruction }),
};

// Tests API
export const testsAPI = {
  getTests: (params?: {
    type?: string;
    subject?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<ApiResponse<{ tests: Test[]; pagination: any }>>> =>
    api.get('/tests', { params }),

  startTest: (id: string): Promise<AxiosResponse<ApiResponse<{
    attemptId: string;
    test: Test;
    startTime: string;
  }>>> =>
    api.post(`/tests/${id}/start`),

  getAttempts: (params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<ApiResponse<{ attempts: any[]; pagination: any }>>> =>
    api.get('/tests/attempts', { params }),
};

// Users API
export const usersAPI = {
  getDashboard: (): Promise<AxiosResponse<ApiResponse<{
    user: any;
    progress: any;
    stats: any;
    recent: any;
  }>>> =>
    api.get('/users/dashboard'),

  getLeaderboard: (): Promise<AxiosResponse<ApiResponse<{
    topUsers: any[];
    userRank: number;
    userXP: number;
    userLevel: number;
  }>>> =>
    api.get('/users/leaderboard'),
};

export default api;
