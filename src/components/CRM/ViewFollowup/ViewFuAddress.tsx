import React from "react";

interface FollowupEdit {
  address: string;
  unit_no: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

interface ViewFuAddressProps {
  followupEdit: FollowupEdit;
}

const ViewFuAddress: React.FC<ViewFuAddressProps> = ({ followupEdit }) => {
  return (
    <fieldset className="form-section">
      <legend>Address Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Address</label>
          <div>{followupEdit.address}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Unit No</label>
          <div>{followupEdit.unit_no}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <div>{followupEdit.city}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <div>{followupEdit.state}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <div>{followupEdit.country}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <div>{followupEdit.postal_code}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewFuAddress;
