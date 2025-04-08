import { FC } from "react";
import { Vendor } from "../../../styles/types/VendorTypes";

interface ViewVendorPrimaryAddressProps {
  formVendor: Vendor;
}

const ViewVendorPrimaryAddress: FC<ViewVendorPrimaryAddressProps> = ({ formVendor }) => {
  return (
    <fieldset>
      <legend>Primary Address</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Street</label>
          <p>{formVendor.primary_address || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <p>{formVendor.primary_city || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <p>{formVendor.primary_state || "N/A"}</p>
        </div>
      </div>

      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <p>{formVendor.primary_country || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <p>{formVendor.primary_postal || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <p>{formVendor.primary_email || "N/A"}</p>
        </div>
      </div>

      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone</label>
          <p>{formVendor.primary_phone || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Fax</label>
          <p>{formVendor.primary_fax || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <input type="hidden" />
        </div>
      </div>
    </fieldset>
  );
};

export default ViewVendorPrimaryAddress;
