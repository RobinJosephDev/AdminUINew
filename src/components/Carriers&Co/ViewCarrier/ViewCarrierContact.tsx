import { FC } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Contact } from "../../../styles/types/CarrierTypes";

interface ViewCarrierContactProps {
  contact: Contact;
  index: number;
}

const ViewCarrierContact: FC<ViewCarrierContactProps> = ({ contact}) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Name</label>
          <span>{contact.name || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Contact No</label>
          <span>{contact.phone || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <span>{contact.email || "N/A"}</span>
        </div>
      </div>

      <div className="form-row" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Fax</label>
          <span>{contact.fax || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Designation</label>
          <span>{contact.designation || "N/A"}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewCarrierContact;
