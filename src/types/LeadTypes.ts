export interface Contact {
  name: string;
  phone: string;
  email: string;
}

export interface Lead {
  id: number;
  lead_no: string;
  lead_date: string;
  customer_name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  unit_no: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  lead_type: string;
  contact_person: string;
  notes: string;
  lead_status: string;
  follow_up_date: string;
  equipment_type: string;
  assigned_to: string;
  contacts: Contact[];
  created_at: string;
  updated_at: string;
}
export interface User {
  id: number;
  name: string;
  role: string;
}
