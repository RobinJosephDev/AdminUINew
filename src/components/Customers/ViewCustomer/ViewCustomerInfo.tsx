import { Customer } from '../../../styles/types/CustomerTypes';

interface ViewCustomerInfoProps {
  formCustomer: Customer;
}

const ViewCustomerInfo: React.FC<ViewCustomerInfoProps> = ({ formCustomer }) => {
  return (
    <fieldset>
      <legend>Customer Information</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Customer Type</label>
          <div>{formCustomer.cust_type}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Customer Name</label>
          <div>{formCustomer.cust_name}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Customer Ref No.</label>
          <div>{formCustomer.cust_ref_no}</div>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Website</label>
          <div>{formCustomer.cust_website}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <div>{formCustomer.cust_email}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No</label>
          <div>{formCustomer.cust_contact_no}</div>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No Ext</label>
          <div>{formCustomer.cust_contact_no_ext}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Tax ID</label>
          <div>{formCustomer.cust_tax_id}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <div></div> {/* Empty div for spacing */}
        </div>
      </div>
    </fieldset>
  );
};

export default ViewCustomerInfo;
