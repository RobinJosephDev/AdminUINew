import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FC, useCallback, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { Contact } from '../../styles/types/LeadTypes';

interface LeadContactFormProps {
  contacts: Contact[];
  index: number;
  onAddContact: () => void;
  handleContactChange: (index: number, updatedContact: Contact) => void;
  handleRemoveContact: (index: number) => void;
}

const contactSchema = z.object({
  name: z
    .string()
    .max(200, 'Name must be at most 200 characters')
    .regex(/^[a-zA-Z\s.,'-]+$/, 'Only letters, spaces, apostrophes, periods,commas and hyphens allowed')
    .optional(),
  phone: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
  email: z.string().max(255, 'Email must be at most 255 characters').email('Invalid email format').optional(),
});

const LeadContactForm: FC<LeadContactFormProps> = ({ contacts, index, handleContactChange, handleRemoveContact, onAddContact }) => {
  const contact = contacts[index] ?? {};
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetContact = useCallback(
    (field: keyof Contact, value: string) => {
      const sanitizedValue = DOMPurify.sanitize(value);
      let error = '';

      const updatedContact = { ...contact, [field]: sanitizedValue };
      const result = contactSchema.safeParse(updatedContact);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      handleContactChange(index, updatedContact);
    },
    [contact, handleContactChange, index]
  );

  const fields = [
    { label: 'Name', key: 'name', type: 'text', placeholder: 'Enter name' },
    { label: 'Phone', key: 'phone', type: 'tel', placeholder: 'Enter phone' },
    { label: 'Email', key: 'email', type: 'email', placeholder: 'Enter email' },
  ];

  return (
    <fieldset className="form-section" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div className="form-group" key={key} style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor={`${key}-${index}`}>{label}</label>
            <input
              id={`${key}-${index}`}
              type={type}
              name={key}
              value={(contact[key as keyof Contact] as string) || ''}
              onChange={(e) => validateAndSetContact(key as keyof Contact, e.target.value)}
              placeholder={placeholder}
            />
            {errors[key] && (
              <span className="error" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
  

      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
        <button type="button" onClick={onAddContact} className="add-button">
          <PlusOutlined />
        </button>
        <button type="button" onClick={() => handleRemoveContact(index)} className="delete-button">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default LeadContactForm;
