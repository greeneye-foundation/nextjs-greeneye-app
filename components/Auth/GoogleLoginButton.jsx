import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/router';
import { showNotification } from '@/components/Notification';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';

const GoogleLoginButton = ({ onSuccess: customOnSuccess }) => {
  const router = useRouter();
  const t = useTranslations('login');
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/api/auth/google', {
        token: credentialResponse.credential
      });

      const userData = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        isAdmin: response.data.isAdmin,
      };

      login(userData, response.data.token);

      showNotification(t('loginSuccess') || 'Login successful!', 'success');

      if (customOnSuccess) {
        customOnSuccess(response.data);
      }

      setTimeout(() => {
        router.push('/profile');
      }, 500);
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to login with Google. Please try again.';
      showNotification(errorMessage, 'error');
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
    showNotification('Google login failed. Please try again.', 'error');
  };

  return (
    <div className="google-login-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="360"
        logo_alignment="left"
        useOneTap={true}
        auto_select={true}
        context="signin"
      />
    </div>
  );
};

export default GoogleLoginButton;
