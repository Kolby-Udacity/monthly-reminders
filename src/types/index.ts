import { z } from 'zod';

export const reminderSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  due: z.number(),
  notes: z.string(),
  completed: z.boolean(),
});

export const reminderListSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  reminders: z.array(reminderSchema).optional(),
});

export type Reminder = z.infer<typeof reminderSchema>;
export type ReminderList = z.infer<typeof reminderListSchema>;
