import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#-_]{8,}$/,
    'Password must contain at least one letter and one number'
  );

export const nameSchema = z
  .string()
  .min(1, 'Full name is required')
  .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name must be less than 50 characters');

export const userTypeSchema = z.enum(['admin'], {
  required_error: 'Please select a user type',
});
