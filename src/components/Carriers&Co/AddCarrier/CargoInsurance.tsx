import { useState } from 'react';
import { Carrier } from '../../../styles/types/CarrierTypes';
import * as z from 'zod';
import DOMPurify from 'dompurify';
import { ZAxis } from 'recharts';

interface CargoInsuranceProps {
  carrier: Carrier;
  setCarrier: React.Dispatch<React.SetStateAction<Carrier>>;
}

const carrierSchema = z
  .object({
    ci_provider: z
      .string()
      .max(150, 'Cargo Insurance Provider must be at most 150 characters')
      .regex(/^[a-zA-Z0-9\s.,'-]*$/, 'Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed')
      .optional(),
    ci_policy_no: z
      .string()
      .max(50, 'Policy Number must be at most 50 characters')
      .regex(/^[a-zA-Z0-9\s.-]*$/, 'Only letters, numbers, spaces, periods, and hyphens allowed')
      .optional(),
    ci_coverage: z.number().optional(),
    ci_start_date: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'Start date must be in DD-MM-YYYY format' })
      .optional(),
    ci_end_date: z
      .string()
      .regex(/^\d{2}-\d{2}-\d{4}$/, { message: 'End date must be in DD-MM-YYYY format' })
      .optional(),
  })
  .refine((data) => !data.ci_start_date || !data.ci_end_date || new Date(data.ci_start_date) <= new Date(data.ci_end_date), {
    message: 'End date must be after or equal to start date',
    path: ['ci_end_date'],
  });

const CargoInsurance: React.FC<CargoInsuranceProps> = ({ carrier, setCarrier }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<boolean>(false);
  const API_URL = process.env.API_BASE_URL;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const sanitizeInput = (input: string) => DOMPurify.sanitize(input);

  const handleChange = (key: keyof Carrier, value: string | number) => {
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    const newCarrier = { ...carrier, [key]: sanitizedValue };
    const result = carrierSchema.safeParse(newCarrier);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
    setCarrier(newCarrier);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('coi_cert', file);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data); // Debugging log

      // ✅ Fix the response handling
      if (data.files?.coi_cert?.fileUrl) {
        // Ensure fileUrl is absolute
        const baseURL = API_URL.replace('/api', ''); // Get base URL from API
        const fullFileUrl = data.files.coi_cert.fileUrl.startsWith('http') ? data.files.coi_cert.fileUrl : `${baseURL}${data.files.coi_cert.fileUrl}`;

        setCarrier((prevCarrier) => ({
          ...prevCarrier,
          coi_cert: fullFileUrl, // Store full file URL
          coi_cert_name: data.files.coi_cert.fileName, // Store original filename
        }));
      } else {
        console.error('File URL not returned in response', data);
        alert('File upload failed: No file URL returned.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Network error during file upload.');
    } finally {
      setUploading(false);
    }
  };

  const fields = [
    { label: 'Cargo Insurance Provider', key: 'ci_provider', type: 'text', placeholder: 'Provider' },
    { label: 'Policy Number', key: 'ci_policy_no', type: 'text', placeholder: 'Policy Number' },
    { label: 'Coverage Amount', key: 'ci_coverage', type: 'number', placeholder: 'Coverage Amount' },
    { label: 'Start Date', key: 'ci_start_date', type: 'date' },
    { label: 'End Date', key: 'ci_end_date', type: 'date' },
  ];

  return (
    <fieldset className="form-section">
      <legend>Cargo Insurance Details</legend>
      <hr />
      <div className="form-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {fields.map(({ label, key, type, placeholder }) => (
          <div key={key} className="form-group" style={{ flex: 1 }}>
            <label htmlFor={key}>{label}</label>
            <input
              type={type}
              id={key}
              value={(carrier[key as keyof Carrier] as string | number) || ''}
              onChange={(e) => handleChange(key as keyof Carrier, type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={placeholder || ''}
            />
            {errors[key] && (
              <span className="error-text" style={{ color: 'red' }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="brokCarrAggmt">Certificate of Insurance</label>
          <input type="file" onChange={handleFileChange} />
          {typeof carrier.coi_cert === 'string' && carrier.coi_cert && (
            <div>
              <a href={carrier.coi_cert} target="_blank" rel="noopener noreferrer">
                Download Certificate of Insurance
              </a>
            </div>
          )}

          {uploading && <p>Uploading...</p>}
        </div>
      </div>
    </fieldset>
  );
};

export default CargoInsurance;
