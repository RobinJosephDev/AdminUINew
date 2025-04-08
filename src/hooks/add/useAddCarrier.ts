import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Carrier, Contact, Equipment, Lane } from '../../styles/types/CarrierTypes';

const API_URL = process.env.API_BASE_URL;
export const useAddCarrier = (onClose: () => void, onSuccess: () => void) => {
  const defaultCarrier: Carrier = {
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
    brok_carr_aggmt: null,
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
    coi_cert: null,
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
  };
  const [carrier, setCarrier] = useState<Carrier>(defaultCarrier);

  const validateCarrier = (): boolean => {
    return !!carrier.dba && !!carrier.legal_name;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateCarrier()) {
      Swal.fire('Validation Error', 'Please fill in all required fields.', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'No token found', 'error');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();

      Object.keys(carrier).forEach((key) => {
        const value = carrier[key as keyof Carrier];

        if (key === 'form_1099' || key === 'advertise' || key === 'approved' || key === 'csa_approved' || key === 'hazmat') {
          formData.append(key, value ? '1' : '0');
        } else if (key !== 'brok_carr_aggmt' && key !== 'coi_cert') {
          formData.append(key, String(value || ''));
        }
      });

      if (carrier.brok_carr_aggmt && carrier.brok_carr_aggmt instanceof File) {
        formData.append('brok_carr_aggmt', carrier.brok_carr_aggmt);
      }

      if (carrier.coi_cert && carrier.coi_cert instanceof File) {
        formData.append('coi_cert', carrier.coi_cert);
      }

      const response = carrier.id
        ? await axios.put(`${API_URL}/carrier/${carrier.id}`, carrier, { headers })
        : await axios.post(`${API_URL}/carrier`, carrier, { headers });

      Swal.fire(carrier.id ? 'Success!' : 'Saved!', 'Carrier added successfully.', 'success');
      clearCarrierForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving/updating carrier:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while processing the carrier.', 'error');
    }
  };

  const clearCarrierForm = (): void => {
    setCarrier({
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
      brok_carr_aggmt: null,
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
      coi_cert: null,
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
  };

  const handleAddContact = () => {
    setCarrier((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', phone: '', email: '', fax: '', designation: '' }],
    }));
  };

  const handleRemoveContact = (index: number) => {
    setCarrier((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index),
    }));
  };

  const handleContactChange = (index: number, updatedContact: Contact) => {
    const updatedContacts = carrier.contacts.map((contact, i) => (i === index ? updatedContact : contact));
    setCarrier((prevCarrier) => ({
      ...prevCarrier,
      contacts: updatedContacts,
    }));
  };

  const handleAddEquipment = () => {
    setCarrier((prev) => ({ ...prev, equipments: [...prev.equipments, { equipment: '' }] }));
  };

  const handleRemoveEquipment = (index: number) => {
    setCarrier((prev) => ({
      ...prev,
      equipments: prev.equipments.filter((_, i) => i !== index),
    }));
  };

  const handleEquipmentChange = (index: number, updatedEquipment: Equipment) => {
    const updatedEquipments = carrier.equipments.map((equipment, i) => (i === index ? updatedEquipment : equipment));
    setCarrier((prevCarrier) => ({
      ...prevCarrier,
      equipments: updatedEquipments,
    }));
  };

  const handleAddLane = () => {
    setCarrier((prev) => ({ ...prev, lanes: [...prev.lanes, { from: '', to: '' }] }));
  };

  const handleRemoveLane = (index: number) => {
    setCarrier((prev) => ({
      ...prev,
      lanes: prev.lanes.filter((_, i) => i !== index),
    }));
  };

  const handleLaneChange = (index: number, updatedLane: Lane) => {
    const updatedLanes = carrier.lanes.map((lane, i) => (i === index ? updatedLane : lane));
    setCarrier((prevCarrier) => ({
      ...prevCarrier,
      lanes: updatedLanes,
    }));
  };

  return {
    carrier,
    setCarrier,
    handleSubmit,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
    handleAddEquipment,
    handleRemoveEquipment,
    handleEquipmentChange,
    handleAddLane,
    handleRemoveLane,
    handleLaneChange,
    clearCarrierForm,
  };
};
