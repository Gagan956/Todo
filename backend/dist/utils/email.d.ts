export declare const verifyEmailConnection: () => Promise<boolean>;
export declare const sendEmail: (to: string, subject: string, html: string, text?: string) => Promise<void>;
export declare const sendWelcomeEmail: (email: string, name: string) => Promise<void>;
export declare const sendResetPasswordEmail: (email: string, token: string) => Promise<void>;
export declare const sendPasswordChangedEmail: (email: string, name: string) => Promise<void>;
declare const _default: {
    sendEmail: (to: string, subject: string, html: string, text?: string) => Promise<void>;
    sendWelcomeEmail: (email: string, name: string) => Promise<void>;
    sendResetPasswordEmail: (email: string, token: string) => Promise<void>;
    sendPasswordChangedEmail: (email: string, name: string) => Promise<void>;
    verifyEmailConnection: () => Promise<boolean>;
};
export default _default;
