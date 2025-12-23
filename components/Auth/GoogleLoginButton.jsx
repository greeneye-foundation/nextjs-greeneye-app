import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/router';
import { showNotification } from '@/components/Notification';
import { useTranslations } from 'next-intl';

const GoogleLoginButton = ({ onSuccess: customOnSuccess }) => {
  const router = useRouter();
  const t = useTranslations('login');

  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the credential token to your backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/auth/google/token`,
        {
          token: credentialResponse.credential
        }
      );

      // Save the JWT token from your backend
      localStorage.setItem('authToken', response.data.token);

      // Save user data (optional)
      const userData = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        isAdmin: response.data.isAdmin
      };
      localStorage.setItem('user', JSON.stringify(userData));

      // Show success notification
      showNotification(t('loginSuccess') || 'Login successful!', 'success');

      // Call custom onSuccess if provided
      if (customOnSuccess) {
        customOnSuccess(response.data);
      }

      // Redirect to profile page
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
