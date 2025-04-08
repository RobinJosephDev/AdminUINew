import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FC, useCallback, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import { Product } from '../../styles/types/FollowupTypes';

interface FuProductFormProps {
  products: Product[];
  index: number;
  onAddProduct: () => void;
  handleProductChange: (index: number, updatedProduct: Product) => void;
  handleRemoveProduct: (index: number) => void;
}

const productSchema = z.object({
  name: z
    .string()
    .max(200, 'Name must be at most 200 characters')
    .regex(/^[a-zA-Z\s.,'-]+$/, 'Only letters, spaces, apostrophes, periods,commas and hyphens allowed')
    .optional(),
  quantity: z
    .string()
    .max(30, 'Phone cannot exceed 30 characters')
    .regex(/^[0-9-+()\s]*$/, 'Invalid phone format')
    .optional(),
});

const FuProductForm: FC<FuProductFormProps> = ({ products, index, handleProductChange, handleRemoveProduct, onAddProduct }) => {
  const product = products[index] ?? {};
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndSetProduct = useCallback(
    (field: keyof Product, value: string) => {
      const sanitizedValue = DOMPurify.sanitize(value);
      let error = '';

      const updatedProduct = { ...product, [field]: sanitizedValue };
      const result = productSchema.safeParse(updatedProduct);

      if (!result.success) {
        const fieldError = result.error.errors.find((err) => err.path[0] === field);
        error = fieldError ? fieldError.message : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
      handleProductChange(index, updatedProduct);
    },
    [product, handleProductChange, index]
  );

  const fields = [
    { label: 'Name', key: 'name', type: 'text', placeholder: 'Enter name' },
    { label: 'Quantity', key: 'phone', type: 'text', placeholder: 'Enter quantity' },
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
            value={(product[key as keyof Product] as string) || ''}
            onChange={(e) => validateAndSetProduct(key as keyof Product, e.target.value)}
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
        <button type="button" onClick={onAddProduct} className="add-button">
          <PlusOutlined />
        </button>
        <button type="button" onClick={() => handleRemoveProduct(index)} className="delete-button">
          <DeleteOutlined />
        </button>
      </div>
    </fieldset>
  );
};

export default FuProductForm;
