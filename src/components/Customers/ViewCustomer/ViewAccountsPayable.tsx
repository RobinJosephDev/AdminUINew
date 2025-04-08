import { Customer } from '../../../styles/types/CustomerTypes';

type ViewAccountsPayableProps = {
  formCustomer: Customer;
};

function ViewAccountsPayable({ formCustomer }: ViewAccountsPayableProps) {
  return (
    <fieldset>
      <legend>Accounts Payable</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Name</label>
          <div>{formCustomer.cust_ap_name}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Street</label>
          <div>{formCustomer.cust_ap_address}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <div>{formCustomer.cust_ap_city}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <div>{formCustomer.cust_ap_state}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <div>{formCustomer.cust_ap_country}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <div>{formCustomer.cust_ap_postal}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Unit No</label>
          <div>{formCustomer.cust_ap_unit_no}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <div>{formCustomer.cust_ap_email}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone</label>
          <div>{formCustomer.cust_ap_phone}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone Ext</label>
          <div>{formCustomer.cust_ap_phone_ext}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Fax</label>
          <div>{formCustomer.cust_ap_fax}</div>
        </div>
      </div>
    </fieldset>
  );
}

export default ViewAccountsPayable;
