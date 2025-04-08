import { FC } from "react";
import { Vendor } from "../../../styles/types/VendorTypes";

interface ViewVendorCargoInsuranceProps {
  formVendor: Vendor;
}

// Helper function to format the date
const formatDate = (date?: string): string => {
  if (!date) return "N/A";
  const d = new Date(date);
  return isNaN(d.getTime()) ? "N/A" : d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
};

const ViewVendorCargoInsurance: FC<ViewVendorCargoInsuranceProps> = ({ formVendor }) => {
  return (
    <fieldset className="form-section">
      <legend>Cargo Insurance Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Cargo Insurance Provider</label>
          <p>{formVendor.cargo_company || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Start Date</label>
          <p>{formatDate(formVendor.cargo_policy_start)}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>End Date</label>
          <p>{formatDate(formVendor.cargo_policy_end)}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Coverage Amount</label>
          <p>{formVendor.cargo_ins_amt || "N/A"}</p>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewVendorCargoInsurance;
