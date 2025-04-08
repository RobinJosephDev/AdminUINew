import { Lead } from "../../../styles/types/LeadTypes";

interface ViewLeadDetailsProps {
  formLead: Lead;
}

const ViewLeadDetails: React.FC<ViewLeadDetailsProps> = ({ formLead }) => {
  return (
    <fieldset className="form-section">
      <legend>Lead Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadNo">Lead No</label>
          <div>{formLead.lead_no || "N/A"}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadDate">Lead Date</label>
          <div>{formLead.lead_date || "N/A"}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customerName">Customer Name</label>
          <div>{formLead.customer_name || "N/A"}</div>
        </div>
      </div>
      <div
        className="form-row"
        style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
      >
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="phone">Phone</label>
          <div>{formLead.phone || "N/A"}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="email">Email</label>
          <div>{formLead.email || "N/A"}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="website">Website</label>
          <div>{formLead.website || "N/A"}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadType">Lead Type</label>
          <div>{formLead.lead_type || "N/A"}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="leadStatus">Lead Status</label>
          <div>{formLead.lead_status || "N/A"}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewLeadDetails;
