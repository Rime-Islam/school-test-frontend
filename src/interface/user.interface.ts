export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string; 
  role: "admin" | "student" | "supervisor";
  emailVerified: boolean;
  otp?: {
    code?: string;
    expiresAt?: Date | string; 
  } | null;
  createdAt?: Date | string;
  updatedAt?: Date | string; 
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

export type UserRole = IUser['role']; 
