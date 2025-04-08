import { Lead } from "../../../styles/types/LeadTypes";

interface ViewAddressDetailsProps {
  formLead: Lead;
}

const ViewAddressDetails: React.FC<ViewAddressDetailsProps> = ({ formLead }) => {
  return (
    <fieldset className="form-section">
      <legend>Address Details</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="address">Address</label>
          <div>{formLead.address || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="unitNo">Unit No</label>
          <div>{formLead.unit_no || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="city">City</label>
          <div>{formLead.city || 'N/A'}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="state">State</label>
          <div>{formLead.state || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="country">Country</label>
          <div>{formLead.country || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="postalCode">Postal Code</label>
          <div>{formLead.postal_code || 'N/A'}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewAddressDetails;
