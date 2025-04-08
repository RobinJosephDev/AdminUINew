import { FC } from "react";
import { Vendor } from "../../../styles/types/VendorTypes";

interface ViewVendorARProps {
  formVendor: Vendor;
}

const ViewVendorAR: FC<ViewVendorARProps> = ({ formVendor }) => {
  return (
    <fieldset className="form-section">
      <legend>Account Receivable Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Name</label>
          <p>{formVendor.ar_name || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <p>{formVendor.ar_email || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No</label>
          <p>{formVendor.ar_contact_no || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Ext</label>
          <p>{formVendor.ar_ext || "N/A"}</p>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewVendorAR;
