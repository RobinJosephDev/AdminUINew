import { FC } from 'react';
import { Carrier } from '../../../styles/types/CarrierTypes';

interface ViewPrimaryAddressProps {
  formCarrier: Carrier;
}

const ViewPrimaryAddress: FC<ViewPrimaryAddressProps> = ({ formCarrier }) => {
  return (
    <fieldset>
      <legend>Primary Address</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressStreet">Street</label>
          <span>{formCarrier.primary_address || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressCity">City</label>
          <span>{formCarrier.primary_city || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressState">State</label>
          <span>{formCarrier.primary_state || 'N/A'}</span>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressCountry">Country</label>
          <span>{formCarrier.primary_country || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressPostalCode">Postal Code</label>
          <span>{formCarrier.primary_postal || 'N/A'}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="primaryAddressUnitNo">Phone</label>
          <span>{formCarrier.primary_phone || 'N/A'}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewPrimaryAddress;
