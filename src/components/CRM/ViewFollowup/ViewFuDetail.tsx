import React from "react";

interface FollowUpEdit {
  next_follow_up_date?: string;
  lead_status?: string;
}

interface ViewFuDetailProps {
  followupEdit: FollowUpEdit;
}

const ViewFuDetail: React.FC<ViewFuDetailProps> = ({ followupEdit }) => {
  return (
    <fieldset className="form-section">
      <legend>Follow Up Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Next Follow-Up Date</label>
          <div>{followupEdit.next_follow_up_date || "N/A"}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Lead Status</label>
          <div>{followupEdit.lead_status || "N/A"}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewFuDetail;
