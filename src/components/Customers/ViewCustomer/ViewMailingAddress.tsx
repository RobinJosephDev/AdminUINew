import { Customer } from '../../../styles/types/CustomerTypes';

interface ViewCustomerMailingAddressProps {
  formCustomer: Customer;
}

const ViewMailingAddressForm: React.FC<ViewCustomerMailingAddressProps> = ({ formCustomer }) => {
  return (
    <fieldset>
      <legend>Mailing Address</legend>
      <hr />
      {!formCustomer.sameAsPrimary && (
        <>
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Street</label>
              <div>{formCustomer.cust_mailing_address}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>City</label>
              <div>{formCustomer.cust_mailing_city}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>State</label>
              <div>{formCustomer.cust_mailing_state}</div>
            </div>
          </div>
          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Country</label>
              <div>{formCustomer.cust_mailing_country}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Postal Code</label>
              <div>{formCustomer.cust_mailing_postal}</div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Unit No</label>
              <div>{formCustomer.cust_mailing_unit_no}</div>
            </div>
          </div>
        </>
      )}
    </fieldset>
  );
};

export default ViewMailingAddressForm;
