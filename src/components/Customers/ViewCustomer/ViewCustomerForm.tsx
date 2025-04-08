import { FC, useEffect, useState } from 'react';
import ViewCustomerInfo from './ViewCustomerInfo';
import ViewAccountsPayable from './ViewAccountsPayable';
import ViewPrimaryAddress from './ViewPrimaryAddress';
import ViewMailingAddressForm from './ViewMailingAddress';
import ViewCustomBroker from './ViewCustomBroker';
import ViewCustomerCredit from './ViewCustomerCredit';
import ViewCustomerContact from './ViewCustomerContact';
import ViewCustomerEquipment from './ViewCustomerEquipment';
import { Customer, Equipment, Contact } from '../../../styles/types/CustomerTypes';

interface ViewCustomerFormProps {
  customer: Customer;
  onClose: () => void;
}

const ViewCustomerForm: FC<ViewCustomerFormProps> = ({ customer, onClose }) => {
  const [formCustomer, setFormCustomer] = useState<Customer>({
    id: 0,
    cust_type: '',
    cust_name: '',
    cust_ref_no: '',
    cust_website: '',
    cust_email: '',
    cust_contact_no: '',
    cust_contact_no_ext: '',
    cust_tax_id: '',
    cust_primary_address: '',
    cust_primary_city: '',
    cust_primary_state: '',
    cust_primary_country: '',
    cust_primary_postal: '',
    cust_primary_unit_no: '',
    sameAsPrimary: false,
    cust_mailing_address: '',
    cust_mailing_city: '',
    cust_mailing_state: '',
    cust_mailing_country: '',
    cust_mailing_postal: '',
    cust_mailing_unit_no: '',
    cust_ap_name: '',
    cust_ap_address: '',
    cust_ap_city: '',
    cust_ap_state: '',
    cust_ap_country: '',
    cust_ap_postal: '',
    cust_ap_unit_no: '',
    cust_ap_email: '',
    cust_ap_phone: '',
    cust_ap_phone_ext: '',
    cust_ap_fax: '',
    cust_broker_name: '',
    cust_bkp_notes: '',
    cust_bkspl_notes: '',
    cust_credit_status: '',
    cust_credit_mop: '',
    cust_credit_appd: '',
    cust_credit_expd: '',
    cust_credit_terms: 0,
    cust_credit_limit: 0,
    cust_credit_notes: '',
    cust_credit_application: false,
    cust_credit_currency: '',
    cust_sbk_agreement: '',
    cust_credit_agreement: '',
    cust_contact: [],
    cust_equipment: [],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (customer) {
      setFormCustomer((prevState) => ({
        ...prevState,
        ...customer,
        cust_contact: Array.isArray(customer.cust_contact) ? customer.cust_contact : JSON.parse(customer.cust_contact || '[]'),
        cust_equipment: Array.isArray(customer.cust_equipment) ? customer.cust_equipment : JSON.parse(customer.cust_equipment || '[]'),
      }));
    }
  }, [customer]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewCustomerInfo formCustomer={formCustomer} />
        <ViewPrimaryAddress formCustomer={formCustomer} />
        <ViewMailingAddressForm formCustomer={formCustomer} />
        <ViewAccountsPayable formCustomer={formCustomer} />
        <ViewCustomBroker formCustomer={formCustomer} />
        <ViewCustomerCredit formCustomer={formCustomer} />

        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {formCustomer.cust_contact.map((contact: Contact, index: number) => (
              <ViewCustomerContact key={index} contact={contact} index={index} />
            ))}
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Equipments</legend>
          <hr />
          <div className="form-row">
            {formCustomer.cust_equipment.map((equipment: Equipment, index: number) => (
              <ViewCustomerEquipment key={index} equipment={equipment} index={index} />
            ))}
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewCustomerForm;
