import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Vendor, Contact } from '../../styles/types/VendorTypes';

const API_URL = process.env.API_BASE_URL;
export const useAddVendor = (onClose: () => void, onSuccess: () => void) => {
  const [vendor, setVendor] = useState<Vendor>({
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
    contacts: [],
    created_at: '',
    updated_at: '',
  });

  const validateVendor = (): boolean => {
    return !!vendor.type && !!vendor.legal_name && !!vendor.remit_name && !!vendor.vendor_type && !!vendor.service;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateVendor()) {
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
      const response = vendor.id
        ? await axios.put(`${API_URL}/vendor/${vendor.id}`, vendor, { headers })
        : await axios.post(`${API_URL}/vendor`, vendor, { headers });

      Swal.fire(vendor.id ? 'Success!' : 'Saved!', 'Vendor added successfully.', 'success');
      clearVendorForm();
      onSuccess();
    } catch (error: any) {
      console.error('Error saving/updating vendor:', error.response ? error.response.data : error.message);
      Swal.fire('Error', 'An error occurred while processing the vendor.', 'error');
    }
  };

  const clearVendorForm = (): void => {
    setVendor({
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
      contacts: [],
      created_at: '',
      updated_at: '',
    });
  };

  const handleAddContact = () => {
    setVendor((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: '', phone: '', email: '', fax: '', designation: '' }],
    }));
  };

  const handleRemoveContact = (index: number) => {
    setVendor((prevVendor) => ({
      ...prevVendor,
      contacts: prevVendor.contacts.filter((_, i) => i !== index),
    }));
  };

  const handleContactChange = (index: number, updatedContact: Contact) => {
    const updatedContacts = vendor.contacts.map((contact, i) => (i === index ? updatedContact : contact));
    setVendor((prevVendor) => ({
      ...prevVendor,
      contacts: updatedContacts,
    }));
  };

  return {
    vendor,
    setVendor,
    handleAddContact,
    handleRemoveContact,
    handleContactChange,
    handleSubmit,
    clearVendorForm,
  };
};
