export type User = {
  id: string;
  name: string;
  nickname: string;
  color: string;
  icon: string;
  avatar?: string;
  content: string;
};

export type QuizQuestion = {
  id: string;
  year: number;
  q: string;
  a: string;
  o: string[];
};

export type QuizExplanation = {
  correctAnswerIndex: number; // 0-based index (A=0, B=1, C=2, D=3)
  explanation: string;
};

export type QuizExplanations = {
  [questionId: string]: QuizExplanation;
};

export type UsersData = {
  [key: string]: User;
};

export type QuizData = {
  [key: string]: QuizQuestion[];
};
