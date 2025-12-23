# Google OAuth Integration - Frontend Documentation

This document provides comprehensive instructions for implementing Google OAuth authentication on the frontend that integrates with the NodeGreenEye backend.

## Table of Contents

1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Implementation Methods](#implementation-methods)
4. [React Implementation Examples](#react-implementation-examples)
5. [Vue.js Implementation Examples](#vuejs-implementation-examples)
6. [Vanilla JavaScript Implementation](#vanilla-javascript-implementation)
7. [Best Practices](#best-practices)
8. [Error Handling](#error-handling)
9. [Testing](#testing)

## Overview

The frontend can integrate with the backend Google OAuth in two ways:
1. **Server-Side Redirect Flow** - Simple redirect to backend OAuth endpoint
2. **Client-Side Token Flow** - Using Google Sign-In SDK (Recommended)

## Setup Instructions

### 1. Get Google Client ID

You'll need the Google Client ID from the Google Cloud Console (same one configured in backend):

```
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. Choose Your Implementation Method

- **Server-Side Flow**: Simple, less code, but full page redirects
- **Client-Side Flow**: Better UX, more control, recommended for SPAs

## Implementation Methods

### Method 1: Server-Side Redirect Flow (Simple)

This method redirects users to the backend, which handles the OAuth flow.

#### Advantages:
- Simple implementation
- No Google SDK needed
- Backend handles everything

#### Disadvantages:
- Full page redirect
- Less control over UX
- Harder to customize

#### Implementation:

**HTML/JSX:**
```html
<a href="http://localhost:5000/api/users/auth/google">
  Sign in with Google
</a>
```

**Success Callback Handler:**

Create a route at `/auth/google/success` to handle the redirect:

```javascript
// Extract token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
  // Save token to localStorage
  localStorage.setItem('authToken', token);

  // Redirect to dashboard or home
  window.location.href = '/dashboard';
}
```

---

### Method 2: Client-Side Token Flow (Recommended)

This method uses Google Sign-In SDK to get an access token, then sends it to your backend for verification.

#### Advantages:
- Better UX (no full page redirect)
- More control over the flow
- Consistent with modern SPA architecture
- Can customize button appearance

#### Disadvantages:
- Requires Google SDK setup
- Slightly more complex

## React Implementation Examples

### Option A: Using @react-oauth/google (Recommended)

#### 1. Install Dependencies

```bash
npm install @react-oauth/google
```

#### 2. Setup Google OAuth Provider

**App.js or main entry file:**

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      {/* Your app components */}
      <YourApp />
    </GoogleOAuthProvider>
  );
}

export default App;
```

#### 3. Create Login Component

**components/GoogleLoginButton.jsx:**

```jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the access token to your backend
      const response = await axios.post(
        'http://localhost:5000/api/users/auth/google/token',
        {
          token: credentialResponse.credential
        }
      );

      // Save the JWT token from your backend
      localStorage.setItem('authToken', response.data.token);

      // Save user data
      localStorage.setItem('user', JSON.stringify({
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        isAdmin: response.data.isAdmin
      }));

      // Redirect or update state
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to login with Google. Please try again.');
    }
  };

  const handleError = () => {
    console.error('Login Failed');
    alert('Google login failed. Please try again.');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
      theme="filled_blue"
      size="large"
      text="signin_with"
      shape="rectangular"
    />
  );
};

export default GoogleLoginButton;
```

#### 4. Create Context for Auth State (Optional but Recommended)

**context/AuthContext.jsx:**

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async (googleToken) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/auth/google/token',
        { token: googleToken }
      );

      const userData = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar,
        isAdmin: response.data.isAdmin
      };

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Using the Context:**

```jsx
import { useAuth } from './context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const { loginWithGoogle } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential);

    if (result.success) {
      window.location.href = '/dashboard';
    } else {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => alert('Login failed')}
      />
    </div>
  );
}
```

---

### Option B: Using react-google-login (Alternative)

#### 1. Install Package

```bash
npm install react-google-login
```

#### 2. Implementation

```jsx
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

const GoogleLoginButton = () => {
  const onSuccess = async (response) => {
    try {
      const result = await axios.post(
        'http://localhost:5000/api/users/auth/google/token',
        {
          token: response.accessToken
        }
      );

      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data));
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('Error:', error);
      alert('Login failed');
    }
  };

  const onFailure = (response) => {
    console.error('Login failed:', response);
    alert('Google login failed');
  };

  return (
    <GoogleLogin
      clientId="YOUR_GOOGLE_CLIENT_ID"
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
      responseType="token"
    />
  );
};
```

---

## Vue.js Implementation Examples

### Using vue3-google-login

#### 1. Install Package

```bash
npm install vue3-google-login
```

#### 2. Setup in main.js

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App);

app.use(vue3GoogleLogin, {
  clientId: 'YOUR_GOOGLE_CLIENT_ID'
});

app.mount('#app');
```

#### 3. Login Component

```vue
<template>
  <div class="login-page">
    <h1>Login</h1>
    <GoogleLogin
      :callback="handleLoginSuccess"
      prompt
    >
      <button class="google-btn">
        Sign in with Google
      </button>
    </GoogleLogin>
  </div>
</template>

<script>
import { GoogleLogin } from 'vue3-google-login';
import axios from 'axios';

export default {
  name: 'LoginPage',
  components: {
    GoogleLogin
  },
  methods: {
    async handleLoginSuccess(response) {
      try {
        const result = await axios.post(
          'http://localhost:5000/api/users/auth/google/token',
          {
            token: response.access_token
          }
        );

        // Save token and user data
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data));

        // Redirect to dashboard
        this.$router.push('/dashboard');

      } catch (error) {
        console.error('Login error:', error);
        alert('Failed to login with Google');
      }
    }
  }
};
</script>
```

---

## Vanilla JavaScript Implementation

### Using Google Sign-In JavaScript Library

#### 1. Add Google Script to HTML

```html
<!DOCTYPE html>
<html>
<head>
  <meta name="google-signin-client_id" content="YOUR_GOOGLE_CLIENT_ID">
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
<body>
  <div id="g_id_onload"
       data-client_id="YOUR_GOOGLE_CLIENT_ID"
       data-callback="handleCredentialResponse">
  </div>
  <div class="g_id_signin" data-type="standard"></div>

  <script src="app.js"></script>
</body>
</html>
```

#### 2. Handle Response in JavaScript

**app.js:**

```javascript
async function handleCredentialResponse(response) {
  try {
    // Send credential to your backend
    const result = await fetch('http://localhost:5000/api/users/auth/google/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: response.credential
      })
    });

    const data = await result.json();

    if (result.ok) {
      // Save token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      // Redirect
      window.location.href = '/dashboard.html';
    } else {
      alert('Login failed: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during login');
  }
}
```

---

## Best Practices

### 1. Environment Variables

Store your Google Client ID in environment variables:

**React (.env):**
```
REACT_APP_GOOGLE_CLIENT_ID=your_client_id
REACT_APP_API_URL=http://localhost:5000
```

**Usage:**
```javascript
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const apiUrl = process.env.REACT_APP_API_URL;
```

### 2. Token Management

```javascript
// Save token
const saveAuthToken = (token, userData) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(userData));
};

// Get token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Clear token
const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getAuthToken();
};
```

### 3. Axios Interceptor for Auth Token

```javascript
import axios from 'axios';

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4. Protected Routes (React Router)

```jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Usage in router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## Error Handling

### Common Errors and Solutions

#### 1. "popup_closed_by_user"

**Error:** User closed the Google login popup

**Solution:**
```javascript
const handleError = (error) => {
  if (error.error === 'popup_closed_by_user') {
    // User cancelled, don't show error
    console.log('Login cancelled by user');
  } else {
    alert('An error occurred during login');
  }
};
```

#### 2. Network Errors

```javascript
const loginWithGoogle = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/auth/google/token`,
      { token },
      { timeout: 10000 } // 10 second timeout
    );
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    } else if (error.response.status === 401) {
      throw new Error('Invalid Google token');
    } else {
      throw new Error('Login failed. Please try again.');
    }
  }
};
```

#### 3. Invalid Token Error

```javascript
// Implement retry logic
const loginWithRetry = async (token, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await loginWithGoogle(token);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

---

## Testing

### Manual Testing Steps

1. **Test New User Registration**
   - Click "Sign in with Google"
   - Complete Google login
   - Verify redirect to dashboard
   - Check localStorage for token and user data

2. **Test Existing User Login**
   - Logout
   - Login again with same Google account
   - Verify immediate login

3. **Test Account Linking**
   - Create account with email/password
   - Login with Google using same email
   - Verify accounts are linked

### Automated Testing (Jest + React Testing Library)

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './LoginPage';

describe('Google Login', () => {
  test('renders Google login button', () => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <LoginPage />
      </GoogleOAuthProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('handles successful login', async () => {
    // Mock axios
    const mockPost = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        token: 'fake-jwt-token',
        name: 'Test User',
        email: 'test@example.com'
      }
    });

    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <LoginPage />
      </GoogleOAuthProvider>
    );

    // Simulate Google login
    // ... test implementation
  });
});
```

---

## Security Considerations

### 1. Never Store Sensitive Data in localStorage

```javascript
// DON'T store sensitive data
localStorage.setItem('password', 'xxx'); // ❌

// DO store only necessary data
localStorage.setItem('authToken', token); // ✅
localStorage.setItem('user', JSON.stringify({
  id, name, email, avatar // Only non-sensitive data
})); // ✅
```

### 2. Use HTTPS in Production

```javascript
// Check protocol in production
if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
```

### 3. Implement Token Refresh

```javascript
// Check token expiration
const isTokenExpired = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};
```

---

## Complete Example: React App with Google OAuth

**App.js:**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
```

## Support and Resources

- [Google Sign-In Documentation](https://developers.google.com/identity/gsi/web)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Backend API Documentation](./GOOGLE_AUTH_BACKEND.md)

## Troubleshooting

### Google Button Not Showing

1. Check client ID is correct
2. Verify Google SDK is loaded
3. Check browser console for errors
4. Ensure domain is authorized in Google Console

### Token Not Working

1. Verify backend URL is correct
2. Check CORS settings on backend
3. Ensure token is being sent in request
4. Verify backend is receiving token correctly

For more help, refer to the backend documentation or contact support.
