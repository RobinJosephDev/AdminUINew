import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User } from '../../styles/types/UserTypes';

interface UseEditUserProps {
  user: User | null;
  onUpdate: (updatedUser: User) => void;
  onClose: () => void;
}

const useEditUser = ({ user, onUpdate, onClose }: UseEditUserProps) => {
  const [formUser, setFormUser] = useState<User>({
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

  const API_URL = process.env.API_BASE_URL;
  useEffect(() => {
    if (user) {
      setFormUser({
        id: user.id || 0,
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: user.password || '',
        password_confirmation: user.password_confirmation || '',
        emp_code: user.emp_code || '',
        role: user.role || '',
        created_at: user.created_at || '',
        updated_at: user.updated_at || '',
      });
    }
  }, [user]);

  const validateUser = (): boolean => {
    return !!(formUser.name && formUser.username && formUser.password && formUser.emp_code && formUser.email && formUser.role);
  };

  const updateUser = async () => {
    if (!validateUser()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'You are not logged in. Please log in again.' });
        return;
      }

      const response = await axios.put<User>(`${API_URL}/user/${formUser.id}`, formUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({ icon: 'success', title: 'Success!', text: 'User details updated.' });
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.status === 401 ? 'Unauthorized. Please log in again.' : 'Failed to update user.',
      });
    }
  };

  return { formUser, setFormUser, updateUser };
};

export default useEditUser;
