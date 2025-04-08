import { Customer } from '../../../styles/types/CustomerTypes';

interface ViewCustomerPrimaryAddressProps {
  formCustomer: Customer;
}

const ViewPrimaryAddress: React.FC<ViewCustomerPrimaryAddressProps> = ({ formCustomer }) => {

  return (
    <fieldset>
      <legend>Primary Address</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Street</label>
          <div>{formCustomer.cust_primary_address}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <div>{formCustomer.cust_primary_city}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <div>{formCustomer.cust_primary_state}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <div>{formCustomer.cust_primary_country}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <div>{formCustomer.cust_primary_postal}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Unit No</label>
          <div>{formCustomer.cust_primary_unit_no}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewPrimaryAddress;
