import { FC, useEffect, useState } from 'react';
import { Vendor } from '../../../styles/types/VendorTypes';
import ViewVendorType from './ViewVendorType';
import ViewVendorDetails from './ViewVendorDetails';
import ViewVendorPrimaryAddress from './ViewVendorPrimaryAddress';
import ViewVendorMailingAddress from './ViewVendorMailingAddress';
import ViewVendorAdditional from './ViewVendorAdditional';
import ViewVendorAR from './ViewVendorAR';
import ViewVendorAP from './ViewVendorAP';
import ViewVendorBanking from './ViewVendorBanking';
import ViewVendorCargoInsurance from './ViewVendorCargoInsurance';
import ViewVendorLiabilityInsurance from './ViewVendorLiabilityInsurance';
import ViewVendorContact from './ViewVendorContact';

interface ViewVendorFormProps {
  vendor?: Vendor;
  onClose: () => void;
}

const ViewVendorForm: FC<ViewVendorFormProps> = ({ vendor, onClose }) => {
  const [formVendor, setFormVendor] = useState<Vendor>({
    id: 0,
    type: '',
    legal_name: '',
    remit_name: '',
    vendor_type: '',
    service: '',
    primary_address: '',
    primary_city: '',
    primary_state: '',
    primary_country: '',
    primary_postal: '',
    primary_email: '',
    primary_phone: '',
    primary_fax: '',
    scac: '',
    docket_number: '',
    vendor_code: '',
    gst_hst_number: '',
    qst_number: '',
    ca_bond_number: '',
    website: '',
    sameAsPrimary: false,
    mailing_address: '',
    mailing_city: '',
    mailing_state: '',
    mailing_country: '',
    mailing_postal: '',
    mailing_email: '',
    mailing_phone: '',
    mailing_fax: '',
    us_tax_id: '',
    payroll_no: '',
    wcb_no: '',
    ar_name: '',
    ar_email: '',
    ar_contact_no: '',
    ar_ext: '',
    ap_name: '',
    ap_email: '',
    ap_contact_no: '',
    ap_ext: '',
    bank_name: '',
    bank_phone: '',
    bank_email: '',
    bank_us_acc_no: '',
    bank_cdn_acc_no: '',
    bank_address: '',
    cargo_company: '',
    cargo_policy_start: '',
    cargo_policy_end: '',
    cargo_ins_amt: 0,
    liab_company: '',
    liab_policy_start: '',
    liab_policy_end: '',
    liab_ins_amt: 0,
    contacts: [{ name: '', phone: '', email: '', fax: '', designation: '' }],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (vendor) {
      const parsedContacts = Array.isArray(vendor.contacts) ? vendor.contacts : JSON.parse(vendor.contacts || '[]');
      setFormVendor({
        ...vendor,
        contacts: parsedContacts.length > 0 ? parsedContacts : [],
      });
    }
  }, [vendor]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewVendorType formVendor={formVendor} />
        <ViewVendorDetails formVendor={formVendor} />
        <ViewVendorPrimaryAddress formVendor={formVendor} />
        <ViewVendorMailingAddress formVendor={formVendor} />
        <ViewVendorAdditional formVendor={formVendor} />
        <ViewVendorAR formVendor={formVendor} />
        <ViewVendorAP formVendor={formVendor} />
        <ViewVendorBanking formVendor={formVendor} />
        <ViewVendorCargoInsurance formVendor={formVendor} />
        <ViewVendorLiabilityInsurance formVendor={formVendor} />

        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {Array.isArray(formVendor.contacts) &&
              formVendor.contacts.map((contact, index) => <ViewVendorContact key={index} contact={contact} index={index} />)}
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

export default ViewVendorForm;
