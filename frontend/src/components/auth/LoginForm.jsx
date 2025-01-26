import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { emailSchema, passwordSchema } from '../../utils/validation';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/auth';

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First validate the form data
      await loginSchema.parseAsync(formData);
      
      console.log("==Response login send====")

      // Make API call to login endpoint
      const response = await authService.login(formData);
      
      console.log("==Response====", response)

      // Store the token
      localStorage.setItem('token', response.token);
      
      // Redirect based on user role
      if (response.role === 'admin') {
        navigate('/network/dashboard');
      } else if (response.role === 'doctor') {
        navigate('/dashboard/doctor');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0];
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        // Handle API errors
        toast.error(error.response?.data?.error || 'Failed to login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email Address"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="Enter your email address"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        tooltip="We'll never share your email"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        tooltip="Your password should be private and secure"
      />

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        icon={<ArrowRight className="h-4 w-4" />}
      >
        Sign In
      </Button>

      <div className="text-sm text-center">
        <span className="text-gray-500">Don't have an account?</span>{' '}
        <Link
          to="/signup"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm; 