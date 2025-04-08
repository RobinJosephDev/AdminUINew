import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../UserProvider';
import ViewGeneral from './ViewGeneral';
import ViewCarrierDetails from './ViewCarrierDetails';
import ViewLiabilityInsurance from './ViewLiabilityInsurance';
import ViewCargoInsurance from './ViewCargoInsurance';
import ViewPrimaryAddress from './ViewPrimaryAddress';
import ViewMailingAddress from './ViewMailingAddress';
import ViewCarrierContact from './ViewCarrierContact';
import ViewCarrierEquipment from './ViewCarrierEquipment';
import ViewCarrierLane from './ViewCarrierLane';
import { Carrier } from '../../../styles/types/CarrierTypes';

interface ViewCarrierFormProps {
  carrier: Carrier | null;
  onClose: () => void;
}

const ViewCarrierForm: React.FC<ViewCarrierFormProps> = ({ carrier, onClose }) => {
  const users = useContext(UserContext);
  const [formCarrier, setFormCarrier] = useState<Carrier>({
    id: 0,
    dba: '',
    legal_name: '',
    remit_name: '',
    acc_no: '',
    branch: '',
    website: '',
    fed_id_no: '',
    pref_curr: '',
    pay_terms: '',
    form_1099: false,
    advertise: false,
    advertise_email: '',
    carr_type: '',
    rating: '',
    brok_carr_aggmt: '',
    docket_no: '',
    dot_number: '',
    wcb_no: '',
    ca_bond_no: '',
    us_bond_no: '',
    scac: '',
    csa_approved: false,
    hazmat: false,
    smsc_code: '',
    approved: false,
    li_provider: '',
    li_policy_no: '',
    li_coverage: 0,
    li_start_date: '',
    li_end_date: '',
    ci_provider: '',
    ci_policy_no: '',
    ci_coverage: 0,
    ci_start_date: '',
    ci_end_date: '',
    coi_cert: '',
    primary_address: '',
    primary_city: '',
    primary_state: '',
    primary_country: '',
    primary_postal: '',
    primary_phone: '',
    sameAsPrimary: false,
    mailing_address: '',
    mailing_city: '',
    mailing_state: '',
    mailing_country: '',
    mailing_postal: '',
    mailing_phone: '',
    int_notes: '',
    contacts: [],
    equipments: [],
    lanes: [],
    created_at: '',
    updated_at: '',
  });

  const API_URL = process.env.API_BASE_URL;
  
  useEffect(() => {
    if (carrier) {
      setFormCarrier({
        ...carrier,
        contacts: Array.isArray(carrier.contacts) ? carrier.contacts : JSON.parse((carrier.contacts as any) || '[]'),
        equipments: Array.isArray(carrier.equipments) ? carrier.equipments : JSON.parse((carrier.equipments as any) || '[]'),
        lanes: Array.isArray(carrier.lanes) ? carrier.lanes : JSON.parse((carrier.lanes as any) || '[]'),
      });
    }
  }, [carrier]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewGeneral formCarrier={formCarrier} />
        <ViewCarrierDetails formCarrier={formCarrier} />
        <ViewLiabilityInsurance formCarrier={formCarrier} />
        <ViewCargoInsurance formCarrier={formCarrier} />
        <ViewPrimaryAddress formCarrier={formCarrier} />
        <ViewMailingAddress formCarrier={formCarrier} />
        <fieldset className="form-section">
          <legend>Contacts</legend>
          <hr />
          <div className="form-row">
            {formCarrier.contacts.map((contact, index) => (
              <ViewCarrierContact key={index} contact={contact} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Equipments</legend>
          <hr />
          <div className="form-row">
            {formCarrier.equipments.map((equipment, index) => (
              <ViewCarrierEquipment key={index} equipment={equipment} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Lanes</legend>
          <hr />
          <div className="form-row">
            {formCarrier.lanes.map((lane, index) => (
              <ViewCarrierLane key={index} lane={lane} index={index} />
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

export default ViewCarrierForm;
