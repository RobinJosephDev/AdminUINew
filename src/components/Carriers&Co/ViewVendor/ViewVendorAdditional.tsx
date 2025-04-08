import { FC } from "react";
import { Vendor } from "../../../styles/types/VendorTypes";

interface ViewVendorAdditionalProps {
  formVendor: Vendor;
}

const ViewVendorAdditional: FC<ViewVendorAdditionalProps> = ({ formVendor }) => {
  return (
    <fieldset className="form-section">
      <legend>Additional Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>US Tax ID</label>
          <p>{formVendor.us_tax_id || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Payroll#</label>
          <p>{formVendor.payroll_no || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>WCB#</label>
          <p>{formVendor.wcb_no || "N/A"}</p>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewVendorAdditional;
