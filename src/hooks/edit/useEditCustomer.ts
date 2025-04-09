import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Customer, Contact, Equipment } from "../../types/CustomerTypes";

const API_URL = process.env.API_BASE_URL;
const useEditCustomer = (
  customer: Customer | null,
  onClose: () => void,
  onUpdate: (customer: Customer) => void
) => {
  const [formCustomer, setFormCustomer] = useState<Customer>({
    id: 0,
    cust_type: "",
    cust_name: "",
    cust_ref_no: "",
    cust_website: "",
    cust_email: "",
    cust_contact_no: "",
    cust_contact_no_ext: "",
    cust_tax_id: "",
    cust_primary_address: "",
    cust_primary_city: "",
    cust_primary_state: "",
    cust_primary_country: "",
    cust_primary_postal: "",
    cust_primary_unit_no: "",
    cust_mailing_address: "",
    cust_mailing_city: "",
    cust_mailing_state: "",
    cust_mailing_country: "",
    cust_mailing_postal: "",
    cust_mailing_unit_no: "",
    sameAsPrimary: false,
    cust_ap_name: "",
    cust_ap_address: "",
    cust_ap_city: "",
    cust_ap_state: "",
    cust_ap_country: "",
    cust_ap_postal: "",
    cust_ap_unit_no: "",
    cust_ap_email: "",
    cust_ap_phone: "",
    cust_ap_phone_ext: "",
    cust_ap_fax: "",
    cust_broker_name: "",
    cust_bkp_notes: "",
    cust_bkspl_notes: "",
    cust_credit_status: "",
    cust_credit_mop: "",
    cust_credit_currency: "",
    cust_credit_appd: "",
    cust_credit_expd: "",
    cust_credit_terms: 0,
    cust_credit_limit: 0,
    cust_credit_application: false,
    cust_credit_agreement: "",
    cust_sbk_agreement: "",
    cust_credit_notes: "",
    cust_contact: [],
    cust_equipment: [],
    created_at: "",
    updated_at: "",
  });

  useEffect(() => {
    if (customer) {
      const parsedContacts = Array.isArray(customer.cust_contact)
        ? customer.cust_contact
        : JSON.parse(customer.cust_contact || "[]");
      const parsedEquipments = Array.isArray(customer.cust_equipment)
        ? customer.cust_equipment
        : JSON.parse(customer.cust_equipment || "[]");

      const updatedCustomer = {
        ...customer,
        cust_contact: parsedContacts.length > 0 ? parsedContacts : [],
        cust_equipment: parsedEquipments.length > 0 ? parsedEquipments : [],
      };

      setFormCustomer(updatedCustomer);
    }
  }, [customer]);

  const validateCustomer = (): boolean => {
    return !!formCustomer.cust_name && !!formCustomer.cust_ref_no;
  };

  const updateCustomer = async () => {
    if (!validateCustomer()) {
      Swal.fire(
        "Validation Error",
        "Please fill in all required fields.",
        "error"
      );
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "You are not logged in. Please log in again.",
        });
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const formData = new FormData();

      Object.keys(formCustomer).forEach((key) => {
        const value = formCustomer[key as keyof Customer];

        if (key === "cust_credit_application") {
          formData.append(key, value ? "1" : "0");
        } else if (
          key !== "cust_credit_agreement" &&
          key !== "cust_sbk_agreement"
        ) {
          formData.append(key, String(value || ""));
        }
      });

      if (
        formCustomer.cust_credit_agreement &&
        formCustomer.cust_credit_agreement instanceof File
      ) {
        formData.append(
          "cust_credit_agreement",
          formCustomer.cust_credit_agreement
        );
      }

      if (
        formCustomer.cust_sbk_agreement &&
        formCustomer.cust_sbk_agreement instanceof File
      ) {
        formData.append("cust_sbk_agreement", formCustomer.cust_sbk_agreement);
      }

      const response = formCustomer.id
        ? await axios.put(
            `${API_URL}/customer/${formCustomer.id}`,
            formCustomer,
            { headers }
          )
        : await axios.post(`${API_URL}/customer`, formCustomer, { headers });

      Swal.fire(
        formCustomer.id ? "Success!" : "Saved!",
        "Customer updated successfully.",
        "success"
      );
      onUpdate(response.data);
      onClose();
    } catch (error: any) {
      console.error(
        "Error saving/updating customer:",
        error.response ? error.response.data : error.message
      );
      Swal.fire(
        "Error",
        "An error occurred while processing the customer.",
        "error"
      );
    }
  };

  //Contacts
  const handleAddContact = () => {
    setFormCustomer((prevCustomer) =>
      prevCustomer
        ? {
            ...prevCustomer,
            cust_contact: [
              ...prevCustomer.cust_contact,
              {
                name: "",
                phone: "",
                ext: "",
                email: "",
                fax: "",
                designation: "",
              },
            ],
          }
        : prevCustomer
    );
  };

  const handleRemoveContact = (index: number) => {
    setFormCustomer((prevCustomer) =>
      prevCustomer
        ? {
            ...prevCustomer,
            contacts: prevCustomer.cust_contact.filter((_, i) => i !== index),
          }
        : prevCustomer
    );
  };

  const handleContactChange = (index: number, updatedContact: Contact) => {
    setFormCustomer((prevCustomer) =>
      prevCustomer
        ? {
            ...prevCustomer,
            contacts: prevCustomer.cust_contact.map((contact, i) =>
              i === index ? updatedContact : contact
            ),
          }
        : prevCustomer
    );
  };

  //Equipments
  const handleAddEquipment = () => {
    setFormCustomer((prevCustomer) =>
      prevCustomer
        ? {
            ...prevCustomer,
            cust_equipment: [...prevCustomer.cust_equipment, { equipment: "" }],
          }
        : prevCustomer
    );
  };

  const handleRemoveEquipment = (index: number) => {
    setFormCustomer((prevCarrier) =>
      prevCarrier
        ? {
            ...prevCarrier,
            equipments: prevCarrier.cust_equipment.filter(
              (_, i) => i !== index
            ),
          }
        : prevCarrier
    );
  };

  const handleEquipmentChange = (
    index: number,
    updatedEquipment: Equipment
  ) => {
    setFormCustomer((prevCarrier) =>
      prevCarrier
        ? {
            ...prevCarrier,
            equipments: prevCarrier.cust_equipment.map((equipment, i) =>
              i === index ? updatedEquipment : equipment
            ),
          }
        : prevCarrier
    );
  };

  return {
    formCustomer,
    setFormCustomer,
    updateCustomer,
    handleAddContact,
    handleContactChange,
    handleAddEquipment,
    handleEquipmentChange,
    handleRemoveContact,
    handleRemoveEquipment,
  };
};

export default useEditCustomer;
