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

export interface Charge {
  type: string;
  charge: number;
  percent: string;
}

export interface Order {
  id: number;
  customer: string;
  customer_ref_no: string;
  branch: string;
  booked_by: string;
  account_rep: string;
  sales_rep: string;
  customer_po_no: string;
  commodity: string;
  equipment: string;
  load_type: string;
  temperature: string;
  origin_location: Location[];
  destination_location: Location[];
  hot: boolean;
  team: boolean;
  air_ride: boolean;
  tarp: boolean;
  hazmat: boolean;
  currency: string;
  base_price: string;
  charges: Charge[];
  discounts: Charge[];
  gst: string;
  pst: string;
  hst: string;
  qst: string;
  final_price: string;
  notes: string;
  created_at: string;
  updated_at: string;
}
