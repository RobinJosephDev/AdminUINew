import { FC } from "react";
import { Vendor } from "../../../styles/types/VendorTypes";

interface ViewVendorAPProps {
  formVendor: Vendor;
}

const ViewVendorAP: FC<ViewVendorAPProps> = ({ formVendor }) => {
  return (
    <fieldset className="form-section">
      <legend>Account Payable Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Name</label>
          <p>{formVendor.ap_name || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <p>{formVendor.ap_email || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No</label>
          <p>{formVendor.ap_contact_no || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Ext</label>
          <p>{formVendor.ap_ext || "N/A"}</p>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewVendorAP;
