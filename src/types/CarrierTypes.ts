export interface Contact {
  name: string;
  phone: string;
  email: string;
  fax: string;
  designation: string;
}

export interface Equipment {
  equipment: string;
}

export interface Lane {
  from: string;
  to: string;
}

export interface Carrier {
  id: number;
  dba: string;
  legal_name: string;
  remit_name: string;
  acc_no: string;
  branch: string;
  website: string;
  fed_id_no: string;
  pref_curr: string;
  pay_terms: string;
  form_1099: boolean;
  advertise: boolean;
  advertise_email: string;
  carr_type: string;
  rating: string;
  brok_carr_aggmt: string | File | null;
  docket_no: string;
  dot_number: string;
  wcb_no: string;
  ca_bond_no: string;
  us_bond_no: string;
  scac: string;
  csa_approved: boolean;
  hazmat: boolean;
  smsc_code: string;
  approved: boolean;
  li_provider: string;
  li_policy_no: string;
  li_coverage: number;
  li_start_date: string;
  li_end_date: string;
  ci_provider: string;
  ci_policy_no: string;
  ci_coverage: number;
  ci_start_date: string;
  ci_end_date: string;
  coi_cert: string | File | null;
  primary_address: string;
  primary_city: string;
  primary_state: string;
  primary_country: string;
  primary_postal: string;
  primary_phone: string;
  sameAsPrimary: boolean;
  mailing_address: string;
  mailing_city: string;
  mailing_state: string;
  mailing_country: string;
  mailing_postal: string;
  mailing_phone: string;
  int_notes: string;
  contacts: Contact[];
  equipments: Equipment[];
  lanes: Lane[];
  created_at: string;
  updated_at: string;
}
