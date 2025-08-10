import type { IQuestion } from "./question.interface";

export interface IAssessmentAnswer {
  questionId: string; 
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface IAssessmentResult {
  step: 1 | 2 | 3;
  score: number;
  certifiedLevel?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
}

export interface IAssessmentSession {
  _id: string; 
  userId: string; 
  currentStep: 1 | 2 | 3;
  status: "in-progress" | "completed" | "abandoned";
  answers?: IAssessmentAnswer[];
  results?: IAssessmentResult[];
  highestCertifiedLevels?: ("A1" | "A2" | "B1" | "B2" | "C1" | "C2")[];
}

export interface AssessmentCardProps {
  currentStep: number;
  answers?: any[];
  questions?: IQuestion[];
}