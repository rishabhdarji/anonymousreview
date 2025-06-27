import { Resend } from 'resend';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const resend = new Resend(process.env.RESEND_API_KEY);