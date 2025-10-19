export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    difficulty: 'easy' | 'medium' | 'complex';
    completed: boolean;
    createdAt: any; // Firestore Timestamp
  }
  
  export interface UserProfile {
    id: string;
    username: string;
    email: string;
    points: number;
  }
  