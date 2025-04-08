import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { Equipment } from '../../styles/types/CustomerTypes';

interface CustomerEquipmentProps {
  equipments: Equipment[];
  index: number;
  onAddEquipment: () => void;
  handleEquipmentChange: (index: number, updatedEquipment: Equipment) => void;
  handleRemoveEquipment: (index: number) => void;
}

const equipmentTypeOptions = ['Van', 'Reefer', 'Flatbed', 'Triaxle', 'Maxi', 'Btrain', 'Roll tite'];

const equipmentTypeSchema = z.object({
  equipments: z.enum(equipmentTypeOptions as [string, ...string[]], {
    errorMap: () => ({ message: 'Invalid equipment type' }),
  }).optional(),
});

const CustomerEquipment: React.FC<CustomerEquipmentProps> = ({ equipments, index, handleEquipmentChange, handleRemoveEquipment, onAddEquipment }) => {
  const equipment = equipments[index] ?? {};
  const [errors, setErrors] = useState<{ type?: string }>({});

  const validateAndSetEquipment = useCallback(
    (field: keyof Equipment, value: string) => {
      const sanitizedValue = DOMPurify.sanitize(value);
      let error = '';

      const updatedEquipment = { ...equipment, [field]: sanitizedValue };
      const result = equipmentTypeSchema.safeParse(updatedEquipment);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      handleEquipmentChange(index, updatedEquipment);
    },
    [equipment, handleEquipmentChange, index]
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
        <label htmlFor={`equipment-${index}`}>Equipment Type</label>
        <select
          id={`equipment-${index}`}
          name="equipment"
          value={equipment.equipment || ''}
          onChange={(e) => validateAndSetEquipment('equipment', e.target.value)}
          style={{ width: '180px', padding: '8px' }}
        >
          <option value="">Select Equipment</option>
          {equipmentTypeOptions.map((option) => (
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
        <button type="button" onClick={onAddEquipment} className="add-button">
          <PlusOutlined />
        </button>
        <button type="button" onClick={() => handleRemoveEquipment(index)} className="delete-button">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default CustomerEquipment;
