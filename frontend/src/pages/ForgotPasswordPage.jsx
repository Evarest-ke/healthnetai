import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your email address and we'll send you a link to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage; 