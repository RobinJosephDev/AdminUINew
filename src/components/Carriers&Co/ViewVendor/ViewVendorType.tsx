import { FC } from "react";
import { Vendor } from "../../../styles/types/VendorTypes";

interface ViewVendorTypeProps {
  formVendor: Vendor;
}

const ViewVendorType: FC<ViewVendorTypeProps> = ({ formVendor }) => {
  return (
    <fieldset className="form-section">
      <legend>Vendor Type</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Vendor Type</label>
          <p>{formVendor.type || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <input type="hidden" />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <input type="hidden" />
        </div>
      </div>
    </fieldset>
  );
};

export default ViewVendorType;
