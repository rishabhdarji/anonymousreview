import * as z from 'zod';

export const messageSchema = z.object({
  content: z
    .string()
    .min(3, { message: 'Minimum 3 letters should be written in the text.' })
    .max(500, { message: 'Message content must be at most 500 characters long' })
});
