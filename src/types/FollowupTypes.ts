export interface Contact {
  id: string | number;
  name: string;
  phone: string;
  email: string;
}


export interface Product {
  id: string | number;
  name: string;
  quantity: number;
}

export interface Followup {
  id: number;
  lead_no: string;
  lead_date: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  unit_no: string;
  lead_type: string;
  contact_person: string;
  notes: string;
  next_follow_up_date: string;
  followup_type: string;
  products: Product[];
  lead_status: string;
  remarks: string;
  equipment: string;
  contacts: Contact[];
  created_at: string;
  updated_at: string;
}
export interface Customer {
  value: string;
  label: string;
}
