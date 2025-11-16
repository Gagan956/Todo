import type { Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}
interface AuthRequest extends Request {
    body: {
        name?: string;
        email: string;
        password: string;
        resetToken?: string;
        confirmPassword?: string;
        currentPassword?: string;
        newPassword?: string;
    };
}
export declare const signup: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (req: Request, res: Response) => Response<any, Record<string, any>>;
export declare const forgotPassword: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const resetPassword: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCurrentUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
