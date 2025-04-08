import { FC } from "react";
import { Vendor } from "../../../styles/types/VendorTypes";

interface ViewVendorLiabilityInsuranceProps {
  formVendor: Vendor;
}

const ViewVendorLiabilityInsurance: FC<ViewVendorLiabilityInsuranceProps> = ({ formVendor }) => {
  // Helper function to format the date
  const formatDate = (date?: string): string => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  };

  return (
    <fieldset className="form-section">
      <legend>Liability Insurance Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Liability Insurance Provider</label>
          <p>{formVendor.liab_company || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Start Date</label>
          <p>{formatDate(formVendor.liab_policy_start)}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>End Date</label>
          <p>{formatDate(formVendor.liab_policy_end)}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Coverage Amount</label>
          <p>{formVendor.liab_ins_amt ? `$${formVendor.liab_ins_amt}` : "N/A"}</p>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewVendorLiabilityInsurance;
