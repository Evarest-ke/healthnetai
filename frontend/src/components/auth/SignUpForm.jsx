import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { handleApiError } from '../../middleware/errorHandler';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { emailSchema, passwordSchema, nameSchema, userTypeSchema } from '../../utils/validation';
import { Link } from 'react-router-dom';
import { authService } from '../../services/auth';

const signUpSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  userType: userTypeSchema,
});

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    userType: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      await signUpSchema.parseAsync(formData);

      // Send data to backend using auth service
      const response = await authService.signup(formData);

      // Store token if returned
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // Redirect based on user type
        const redirectPath = formData.userType === 'admin' 
          ? '/network/dashboard'
          : '/dashboard';
        
        navigate(redirectPath);
      } else {
        throw new Error('No token received from server');
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
        handleApiError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        name="fullName"
        type="text"
        autoComplete="name"
        required
        placeholder="Enter your full name"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
      />

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
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      <Select
        label="I am a"
        name="userType"
        required
        value={formData.userType}
        onChange={handleChange}
        error={errors.userType}
        options={[
          { value: '', label: 'Select user type' },
          { value: 'admin', label: 'Network Admin' },
        ]}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        icon={<ArrowRight className="h-4 w-4" />}
      >
        Create Account
      </Button>

      <div className="text-sm text-center">
        <span className="text-gray-500">Already have an account?</span>{' '}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm; 