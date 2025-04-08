import { useState } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';
import { Followup } from '../../../styles/types/FollowupTypes';

interface AdditionalInfoProps {
  followupEdit: Followup;
  setFollowupEdit: React.Dispatch<React.SetStateAction<Followup>>;
}

const addInfoSchema = z.object({
  next_follow_up_date: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Date must be in DD-MM-YYYY format' })
    .optional(),
  contact_person: z
    .string()
    .max(200, 'Contact name must be at most 200 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
  equipment: z.enum(['Van', 'Reefer', 'Flatbed', 'Triaxle', 'Maxi', 'Btrain', 'Roll tite'], {
    errorMap: () => ({ message: 'Invalid equipment type' }),
  }).optional(),
  notes: z
    .string()
    .max(500, 'Notes must be at most 500 characters long')
    .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
    .optional(),
});

const EditFuAddInfo: React.FC<AdditionalInfoProps> = ({ followupEdit, setFollowupEdit }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetFollowup = (field: keyof Followup, value: string) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    let error = '';

    const tempFollowup = { ...followupEdit, [field]: sanitizedValue };
    const result = addInfoSchema.safeParse(tempFollowup);

    if (!result.success) {
      const fieldError = result.error.errors.find((err) => err.path[0] === field);
      error = fieldError ? fieldError.message : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFollowupEdit(tempFollowup);
  };

  const fields = [
    { label: 'Next Follow-Up Date', key: 'next_follow_up_date', type: 'date', placeholder: 'Enter follow-up date' },
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
              value={(followupEdit[key as keyof Followup] as string | number) || ''}
              onChange={(e) => validateAndSetFollowup(key as keyof Followup, e.target.value)}
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
            value={followupEdit.equipment || ''}
            onChange={(e) => setFollowupEdit((prevFollowup) => ({ ...prevFollowup, equipment: e.target.value }))}
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
          {errors.equipment && (
            <span className="error" style={{ color: 'red' }}>
              {errors.equipment}
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
            value={followupEdit.notes || ''}
            onChange={(e) => validateAndSetFollowup('notes', e.target.value)}
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

export default EditFuAddInfo;
