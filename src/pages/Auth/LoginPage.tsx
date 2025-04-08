import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import '../../styles/Auth.css';
import axios from 'axios';
import { useUser } from '../../UserProvider';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const API_URL = process.env.API_BASE_URL;
  const { setUserRole } = useUser();

  const sanitizeInput = (input: string): string => input.replace(/[<>"/=]/g, '');

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          username: sanitizeInput(values.username),
          password: sanitizeInput(values.password),
        },
        {
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
        }
      );

      console.log('Login Response:', response);

      if (response.data.token) {
        handleLoginSuccess(response.data);
      } else {
        message.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);

      if (axios.isAxiosError(error)) {
        console.error('Error Response Data:', error.response?.data);

        if (error.response?.status === 429) {
          message.error('Too many failed login attempts. Please wait before trying again.');
        } else {
          message.error(error.response?.data?.error || 'Login failed.');
        }
      } else {
        message.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (data: { token: string; user: { id: number; role: string } }) => {
    const expiryTime = Date.now() + 1 * 60 * 60 * 1000;

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id.toString());
    localStorage.setItem('userRole', data.user.role);
    localStorage.setItem('tokenExpiry', expiryTime.toString());

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  
    setUserRole(data.user.role);
  
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };  

  if (redirect) {
    window.location.href = '/';
  }
  

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Admin Login</h2>
        <Form onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="auth-button" loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
