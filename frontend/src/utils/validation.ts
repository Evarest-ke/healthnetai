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
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const nameSchema = z
  .string()
  .min(1, 'Full name is required')
  .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name must be less than 50 characters');

export const userTypeSchema = z.enum(['patient', 'provider'], {
  required_error: 'Please select a user type',
});