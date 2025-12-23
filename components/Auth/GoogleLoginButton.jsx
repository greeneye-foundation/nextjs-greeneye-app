import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useRouter } from 'next/router';
import { showNotification } from '@/components/Notification';
import { useTranslations } from 'next-intl';

const GoogleLoginButton = ({ onSuccess: customOnSuccess }) => {
  const router = useRouter();
  const t = useTranslations('login');
  const [loading, setLoading] = useState(false);

  const handleGoogleResponse = async (tokenResponse) => {
    setLoading(true);
    try {
      // Exchange the access token for user info
      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );

      // Send user info to your backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/auth/google`,
        {
          email: userInfoResponse.data.email,
          name: userInfoResponse.data.name,
          picture: userInfoResponse.data.picture,
          googleId: userInfoResponse.data.sub,
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
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('Google Login Failed:', error);
    showNotification('Google login failed. Please try again.', 'error');
    setLoading(false);
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: handleError,
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={loading}
      className="google-signin-button"
    >
      <svg
        className="google-icon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
          <path
            fill="#4285F4"
            d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
          />
          <path
            fill="#34A853"
            d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
          />
          <path
            fill="#FBBC05"
            d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
          />
          <path
            fill="#EA4335"
            d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
          />
        </g>
      </svg>
      <span>
        {loading ? (t('signingIn') || 'Signing in...') : (t('signInWithGoogle') || 'Sign in with Google')}
      </span>
    </button>
  );
};

export default GoogleLoginButton;
