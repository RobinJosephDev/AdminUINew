import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { Lane } from '../../styles/types/CarrierTypes';

interface CarrierLaneProps {
  lanes: Lane[];
  index: number;
  onAddLane: () => void;
  handleLaneChange: (index: number, updatedLane: Lane) => void;
  handleRemoveLane: (index: number) => void;
}
const laneOptions = [
  'AB',
  'AK',
  'AL',
  'AR',
  'AZ',
  'BC',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MB',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NB',
  'NC',
  'ND',
  'NE',
  'NH',
  'NJ',
  'NL',
  'NM',
  'NS',
  'NV',
  'NY',
  'OH',
  'OK',
  'ON',
  'OR',
  'PA',
  'PE',
  'QC',
  'RI',
  'SC',
  'SD',
  'SK',
  'TN',
  'TX',
  'UT',
  'VA',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
];
const laneSchema = z.object({
  type: z.enum(laneOptions as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid lane' }),
  }).optional(),
});
const CarrierLane: React.FC<CarrierLaneProps> = ({ lanes, index, handleLaneChange, handleRemoveLane, onAddLane }) => {
  const lane = lanes[index] ?? {};
  const [errors, setErrors] = useState<{ type?: string }>({});

  const validateAndSetLane = useCallback(
    (field: keyof Lane, value: string) => {
      const sanitizedValue = DOMPurify.sanitize(value);
      let error = '';

      const updatedLane = { ...lane, [field]: sanitizedValue };
      const result = laneSchema.safeParse(updatedLane);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      handleLaneChange(index, updatedLane);
    },
    [lane, handleLaneChange, index]
  );

  return (
    <fieldset
      className="form-section"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor={`lane-${index}`}>From</label>
        <select
          id={`lane-${index}`}
          name="type"
          value={lane.from || ''}
          onChange={(e) => validateAndSetLane('from', e.target.value)}
          style={{ width: '180px', padding: '8px' }}
        >
          <option value="">Select Lane</option>
          {laneOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.type && (
          <span className="error" style={{ color: 'red' }}>
            {errors.type}
          </span>
        )}
      </div>
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor={`lane-${index}`}>To</label>
        <select
          id={`lane-${index}`}
          name="type"
          value={lane.to || ''}
          onChange={(e) => validateAndSetLane('to', e.target.value)}
          style={{ width: '180px', padding: '8px' }}
        >
          <option value="">Select Lane</option>
          {laneOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.type && (
          <span className="error" style={{ color: 'red' }}>
            {errors.type}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
        <button type="button" onClick={onAddLane} className="add-button">
          <PlusOutlined />
        </button>
        <button type="button" onClick={() => handleRemoveLane(index)} className="delete-button">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default CarrierLane;
