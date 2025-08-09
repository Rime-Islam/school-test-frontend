import type { IUser } from "./user.interface";

export interface IQuestion {
  _id: string; 
  createdBy: IUser; 
  text: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswer: string;
  competency: "grammar" | "vocabulary" | "writing";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  timeLimit: number;
  createdAt?: string; 
  updatedAt?: string;
}

export interface QuestionFormData {
  text: string;
  competency: string;
  level: string;
  timeLimit: number;
  options: { text: string }[];
  correctIndex: number;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionPayload {
  text: string;
  competency: string;
  level: string;
  timeLimit: number;
  options: QuestionOption[];
}
