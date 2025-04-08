import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Lead, User } from "../../../styles/types/LeadTypes";

interface Employee {
  id: string;
  name: string;
  role: string;
}

interface ViewAdditionalInfoProps {
  formLead: Lead;
}

const ViewAdditionalInfo: React.FC<ViewAdditionalInfoProps> = ({
  formLead,
}) => {
  const API_URL = process.env.API_BASE_URL;
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.get<Employee[]>(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter employees
        const employeeList = response.data.filter(
          (user) => user.role === "employee"
        );
        setEmployees(employeeList);
      } catch (error: any) {
        console.error("Error fetching users:", error);

        if (error.response?.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "You are not authorized to view this data. Please log in again.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while fetching users. Please try again.",
          });
        }
      }
    };

    fetchUsers();
  }, []);

  return (
    <fieldset className="form-section">
      <legend>Additional Information</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="follow_up_date">Next Follow-Up Date</label>
          <div>{formLead.follow_up_date || "N/A"}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="equipmentType">Equipment Type</label>
          <div>{formLead.equipment_type || "N/A"}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="assignedTo">Assigned To</label>
          <div>{formLead.assigned_to || "N/A"}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="contactPerson">Contact Person</label>
          <div>{formLead.contact_person || "N/A"}</div>
        </div>
      </div>
      <div
        className="form-row"
        style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
      >
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="notes">Notes</label>
          <div>{formLead.notes || "N/A"}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewAdditionalInfo;
