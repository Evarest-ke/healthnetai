import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { emailSchema } from '../../utils/validation';
import { Link } from 'react-router-dom';

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await forgotPasswordSchema.parseAsync({ email });
      // Add your password reset logic here
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mb-4 text-green-600">
          Password reset instructions have been sent to your email.
        </div>
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-500 transition-colors"
        >
          Return to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email Address"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        placeholder="Enter your email address"
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        icon={<ArrowRight className="h-4 w-4" />}
      >
        Reset Password
      </Button>

      <div className="text-sm text-center">
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm; 