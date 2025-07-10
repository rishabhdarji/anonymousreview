import z from 'zod';

export const usernameValidation = z
  .string()
  .min(3, { message: 'Username must be at least 3 characters long' })
  .max(10, { message: 'Username must be at most 10 characters long' })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
        .string()
        .email({ message: 'Invalid email address' })
        .toLowerCase(),
  password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(20, { message: 'Password must be at most 20 characters long' })
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                }),
        });