export interface Customer {
  id: number;
  cust_type: string;
  cust_name: string;
  cust_ref_no: string;
  cust_website: string;
  cust_email: string;
  cust_contact_no: string;
  cust_contact_no_ext?: string;
  cust_tax_id: string;
  cust_primary_address: string;
  cust_primary_city: string;
  cust_primary_state: string;
  cust_primary_country: string;
  cust_primary_postal: string;
  cust_primary_unit_no: string;
  cust_mailing_address: string;
  cust_mailing_city: string;
  cust_mailing_state: string;
  cust_mailing_country: string;
  cust_mailing_postal: string;
  cust_mailing_unit_no: string;
  sameAsPrimary: boolean;
  cust_ap_name: string;
  cust_ap_address: string;
  cust_ap_city: string;
  cust_ap_state: string;
  cust_ap_country: string;
  cust_ap_postal: string;
  cust_ap_unit_no: string;
  cust_ap_email: string;
  cust_ap_phone: string;
  cust_ap_phone_ext: string;
  cust_ap_fax: string;
  cust_broker_name: string;
  cust_bkp_notes: string;
  cust_bkspl_notes: string;
  cust_credit_status: string;
  cust_credit_mop: string;
  cust_credit_currency: string;
  cust_credit_appd: string;
  cust_credit_expd: string;
  cust_credit_terms: number;
  cust_credit_limit: number;
  cust_credit_application: boolean;
  cust_credit_agreement: FileData | string;
  cust_sbk_agreement: FileData | string;
  cust_credit_notes: string;
  cust_contact: Contact[];
  cust_equipment: Equipment[];
  created_at: string;
  updated_at: string;
}

export interface FileData {
  url: string;
  name: string;
}

export interface Equipment {
  equipment: string;
}

export interface Contact {
  name: string;
  phone: string;
  ext: string;
  email: string;
  fax: string;
  designation: string;
}
