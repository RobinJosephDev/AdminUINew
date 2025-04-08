import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { Lead } from '../../../styles/types/LeadTypes';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User } from '../../../styles/types/UserTypes';

interface EditAdditionalInfoProps {
  formLead: Lead;
  setFormLead: React.Dispatch<React.SetStateAction<Lead>>;
}

const addInfoSchema = z.object({
  follow_up_date: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Date must be in DD-MM-YYYY format' })
    .optional(),
  contact_person: z
    .string()
    .max(200, 'Contact name must be at most 200 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  lead_type: z.enum(['AB', 'BC', 'BDS', 'CA', 'DPD MAGMA', 'MB', 'ON', 'Super Leads', 'TBAB', 'USA'], {
    errorMap: () => ({ message: 'Invalid lead type' }),
  }),
  equipment_type: z
    .enum(['Van', 'Reefer', 'Flatbed', 'Triaxle', 'Maxi', 'Btrain', 'Roll tite'], {
      errorMap: () => ({ message: 'Invalid equipment type' }),
    })
    .optional(),
  assigned_to: z
    .string()
    .min(1, 'Assigned To is required')
    .max(200, 'Assigned To must be at most 200 characters long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Only letters, spaces, apostrophes, and hyphens allowed')
    .optional(),
  notes: z
    .string()
    .max(500, 'Notes must be at most 200 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
});

const EditAdditionalInfo: React.FC<EditAdditionalInfoProps> = ({ formLead, setFormLead }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const API_URL = process.env.API_BASE_URL;
    const [employees, setEmployees] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found. Please log in.');
        }
        const response = await axios.get<User[]>(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const employees = response.data.filter((user) => user.role === 'employee');
        setEmployees(employees);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        Swal.fire({
          icon: 'error',
          title: error.response?.status === 401 ? 'Unauthorized' : 'Error',
          text:
            error.response?.status === 401
              ? 'You are not authorized to view this data. Please log in again.'
              : 'An error occurred while fetching users. Please try again.',
        });
      }
    };
    fetchUsers();
  }, [API_URL]);

  const validateAndSetLead = (field: keyof Lead, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempLead = { ...formLead, [field]: sanitizedValue };
    const result = addInfoSchema.safeParse(tempLead);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormLead(tempLead);
  };

  const fields = [
    { label: 'Next Follow-Up Date', key: 'follow_up_date', type: 'date', placeholder: 'Enter follow-up date' },
    { label: 'Contact Person', key: 'contact_person', type: 'text', placeholder: 'Enter contact person' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Additional Information</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div className="form-group" key={key} style={{ flex: 1 }}>
            <label htmlFor={key}>{label}</label>
            <input
              type={type}
              id={key}
              placeholder={placeholder}
              value={(formLead[key as keyof Lead] as string | number) || ''}
              onChange={(e) => validateAndSetLead(key as keyof Lead, e.target.value)}
            />
            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="equipmentType">Equipment Type</label>
          <select
            id="equipmentType"
            value={formLead.equipment_type || ''}
            onChange={(e) => setFormLead((prevLead) => ({ ...prevLead, equipment_type: e.target.value }))}
          >
            <option value="">Select Equipment Type</option>
            <option value="Van">Van</option>
            <option value="Reefer">Reefer</option>
            <option value="Flatbed">Flatbed</option>
            <option value="Triaxle">Triaxle</option>
            <option value="Maxi">Maxi</option>
            <option value="Btrain">Btrain</option>
            <option value="Roll tite">Roll tite</option>
          </select>
          {errors.equipment_type && (
            <span className="error" style={{ color: 'red' }}>
              {errors.equipment_type}
            </span>
          )}
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="assignedTo">Assigned To</label>
          <select id="assignedTo" value={formLead.assigned_to} onChange={(e) => validateAndSetLead('assigned_to', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map((user) => (
              <option key={user.name} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.assigned_to && (
            <span className="error" style={{ color: 'red' }}>
              {errors.assigned_to}
            </span>
          )}
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            placeholder="Enter notes"
            value={formLead.notes || ''}
            onChange={(e) => validateAndSetLead('notes', e.target.value)}
            style={{ width: '100%', minHeight: '100px' }}
          />
          {errors.notes && (
            <span className="error" style={{ color: 'red' }}>
              {errors.notes}
            </span>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default EditAdditionalInfo;
