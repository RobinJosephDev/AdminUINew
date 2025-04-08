export interface Location {
  address: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  date: string;
  time: string;
  currency: string;
  equipment: string;
  pickup_po: string;
  phone: string;
  packages: number;
  weight: number;
  dimensions: string;
  notes: string;
}

export interface Quote {
  id: number;
  quote_type: string;
  quote_customer: string;
  quote_cust_ref_no: string;
  quote_booked_by: string;
  quote_temperature: string;
  quote_hot: boolean;
  quote_team: boolean;
  quote_air_ride: boolean;
  quote_tarp: boolean;
  quote_hazmat: boolean;
  quote_pickup: Location[];
  quote_delivery: Location[];
  created_at: string;
  updated_at: string;
}
