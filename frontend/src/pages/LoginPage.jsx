import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <AuthLayout
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
      >
        <LoginForm />
      </AuthLayout>
    </div>
  );
};

export default LoginPage; 