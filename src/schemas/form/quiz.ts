import {z} from 'zod';

export const quizCreationSchema = z.object({
    topic: z.string().min(4, { message: 'Topic must be at least 4 characters long.' }).max(50),
    type: z.enum(["mcq", "open_ended"]),
    amount: z.number().min(1, { message: 'Amount must be at least 1.' }).max(20, { message: 'Amount cannot exceed 20.' })
});
