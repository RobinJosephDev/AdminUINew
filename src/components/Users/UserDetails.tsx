import React, { useState } from 'react';
import { z } from 'zod';
import { User } from '../../styles/types/UserTypes';

interface UserDetailsProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const userSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name cannot exceed 200 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  username: z
    .string()
    .min(1, 'Username is required')
    .max(255, 'Username cannot be more than 255 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters long')
    .max(200, 'Password cannot exceed 200 characters'),
  password_confirmation: z
    .string()
    .min(12, 'Password confirmation is required')
    .max(200, 'Password confirmation cannot exceed 200 characters'),
  emp_code: z
    .string()
    .min(1, 'Employee code is required')
    .max(100, 'Employee code cannot be more than 100 characters')
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, 'Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed'),
  role: z.enum(['Admin', 'Employee', 'Carrier', 'Customer'], {
    errorMap: () => ({ message: 'Invalid role selection' }),
  }),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
});

const roles = ['Admin', 'Employee', 'Carrier', 'Customer'];

const UserDetails: React.FC<UserDetailsProps> = ({ user, setUser }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetField = (field: keyof User, value: string) => {
    let tempUser = { ...user, [field]: value };
    const result = userSchema.safeParse(tempUser);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      setErrors((prevErrors) => ({ ...prevErrors, [field]: fieldError?.message || '' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }

    setUser(tempUser);
  };

  return (
    <fieldset>
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="form-group">
          <label htmlFor="name">Name <span style={{ color: 'red' }}>*</span></label>
          <input
            id="name"
            type="text"
            value={user.name || ''}
            onChange={(e) => validateAndSetField('name', e.target.value)}
            placeholder="Enter Name"
          />
          {errors.name && <span className="error" style={{ color: 'red' }}>{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="username">Username <span style={{ color: 'red' }}>*</span></label>
          <input
            id="username"
            type="text"
            value={user.username || ''}
            onChange={(e) => validateAndSetField('username', e.target.value)}
            placeholder="Enter Username"
          />
          {errors.username && <span className="error" style={{ color: 'red' }}>{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email <span style={{ color: 'red' }}>*</span></label>
          <input
            id="email"
            type="email"
            value={user.email || ''}
            onChange={(e) => validateAndSetField('email', e.target.value)}
            placeholder="Enter Email"
          />
          {errors.email && <span className="error" style={{ color: 'red' }}>{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password <span style={{ color: 'red' }}>*</span></label>
          <input
            id="password"
            type="password"
            value={user.password || ''}
            onChange={(e) => validateAndSetField('password', e.target.value)}
            placeholder="Enter Password"
          />
          {errors.password && <span className="error" style={{ color: 'red' }}>{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password_confirmation">Confirm Password <span style={{ color: 'red' }}>*</span></label>
          <input
            id="password_confirmation"
            type="password"
            value={user.password_confirmation || ''}
            onChange={(e) => validateAndSetField('password_confirmation', e.target.value)}
            placeholder="Confirm Password"
          />
          {errors.password_confirmation && <span className="error" style={{ color: 'red' }}>{errors.password_confirmation}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="emp_code">Employee Code <span style={{ color: 'red' }}>*</span></label>
          <input
            id="emp_code"
            type="text"
            value={user.emp_code || ''}
            onChange={(e) => validateAndSetField('emp_code', e.target.value)}
            placeholder="Employee Code"
          />
          {errors.emp_code && <span className="error" style={{ color: 'red' }}>{errors.emp_code}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role <span style={{ color: 'red' }}>*</span></label>
          <select
            id="role"
            value={user.role || ''}
            onChange={(e) => validateAndSetField('role', e.target.value)}
          >
            <option value="" disabled>Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.role && <span className="error" style={{ color: 'red' }}>{errors.role}</span>}
        </div>
      </div>
    </fieldset>
  );
};

export default UserDetails;
