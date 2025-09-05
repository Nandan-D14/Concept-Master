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
  message?: string;
  data: T;
}

export const mockAPI = {
  auth: {
    signUp: async (data: any): Promise<ApiResponse<{ token: string; user: User }>> => {
      console.log('Mock API: Signing up with', data);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              token: 'mock-token-123',
              user: {
                id: '1',
                email: data.email,
                name: data.name,
                class: parseInt(data.class),
                board: data.board,
                subscription: { type: 'free', startDate: new Date().toISOString(), endDate: new Date().toISOString(), isActive: true },
                progress: { totalXP: 0, currentLevel: 1, badges: [], completedChapters: [], bookmarks: [] },
                remainingDays: 30,
              },
            },
          });
        }, 1000);
      });
    },
    signIn: async (data: any): Promise<ApiResponse<{ token: string; user: User }>> => {
      console.log('Mock API: Signing in with', data);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              token: 'mock-token-123',
              user: {
                id: '1',
                email: data.email,
                name: 'Mock User',
                class: 10,
                board: 'CBSE',
                subscription: { type: 'free', startDate: new Date().toISOString(), endDate: new Date().toISOString(), isActive: true },
                progress: { totalXP: 0, currentLevel: 1, badges: [], completedChapters: [], bookmarks: [] },
                remainingDays: 30,
              },
            },
          });
        }, 1000);
      });
    },
    googleSignIn: async (): Promise<ApiResponse<{ token: string; user: User }>> => {
      console.log('Mock API: Google Sign In');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              token: 'mock-token-google',
              user: {
                id: '2',
                email: 'google@example.com',
                name: 'Mock Google User',
                class: 10,
                board: 'CBSE',
                subscription: { type: 'free', startDate: new Date().toISOString(), endDate: new Date().toISOString(), isActive: true },
                progress: { totalXP: 0, currentLevel: 1, badges: [], completedChapters: [], bookmarks: [] },
                remainingDays: 30,
              },
            },
          });
        }, 1000);
      });
    },
  },
};