import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User } from '../../styles/types/UserTypes';

const API_URL = process.env.API_BASE_URL;
export const useAddUser = (onClose: () => void, onSuccess: () => void) => {
  const [user, setUser] = useState<User>({
    id: 0,
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    emp_code: '',
    role: '',
    created_at: '',
    updated_at: '',
  });

  const validateUser = (): boolean => {
    return !!(user.name && user.username && user.password && user.emp_code && user.email && user.role);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateUser()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }

    try {
      let response;
      const token = localStorage.getItem('token');

      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      if (user.id) {
        response = await axios.put<User>(`${API_URL}/user/${user.id}`, user, { headers });
        Swal.fire('Success!', 'User details updated.', 'success');
      } else {
        response = await axios.post<User>(`${API_URL}/user`, user, { headers });
        Swal.fire('Success!', 'User added successfully.', 'success');
      }

      clearUserForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving/updating user:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while saving/updating the user.', 'error');
    }
  };

  const clearUserForm = (): void => {
    setUser({
      id: 0,
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      emp_code: '',
      role: '',
      created_at: '',
      updated_at: '',
    });
  };

  return { user, setUser, handleSubmit };
};
