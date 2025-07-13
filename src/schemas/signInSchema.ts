import z from 'zod';

export const signInSchema = z.object({
    identifier : z
        .string().length(6, { message: 'Identifier must be exactly 6 characters long' })
        .regex(/^[0-9]+$/, { message: 'Identifier must contain only numbers' }),
    password: z
        .string()  
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(20, { message: 'Password must be at most 20 characters long' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                })
        });
