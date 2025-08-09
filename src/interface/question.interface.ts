
export interface IQuestion {
  _id: string; 
  createdBy: string; 
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
