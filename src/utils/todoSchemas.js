import { z } from 'zod';

export const TODO_TITLE_MAX = 200;
export const EMAIL_MAX = 254;
export const PASSWORD_MAX = 128;

export const todoTitleSchema = z
  .string()
  .trim()
  .min(1, { error: 'Please enter a task.' })
  .max(TODO_TITLE_MAX, {
    error: `Task must be ${TODO_TITLE_MAX} characters or fewer.`,
  });

export const loginSchema = z.object({
  email: z
    .email({ error: 'Please enter a valid email address.' })
    .max(EMAIL_MAX, { error: 'Email address is too long.' }),
  password: z
    .string()
    .min(1, { error: 'Password is required.' })
    .max(PASSWORD_MAX, { error: 'Password is too long.' }),
});

export function validateTodoTitle(value) {
  return todoTitleSchema.safeParse(value);
}

export function isValidTodoTitle(value) {
  return todoTitleSchema.safeParse(value).success;
}

export function flattenFieldErrors(error) {
  return z.flattenError(error).fieldErrors;
}
