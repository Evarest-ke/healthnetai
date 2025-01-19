import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import SignUpForm from '../components/auth/SignUpForm';

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <AuthLayout
        title="Create an Account"
        subtitle="Join the HealthNet Management Platform"
      >
        <SignUpForm />
      </AuthLayout>
    </div>
  );
};

export default SignUpPage; 