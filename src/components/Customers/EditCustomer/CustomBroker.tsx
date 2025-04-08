import { useState, useEffect } from "react";
import { z } from "zod";
import axios from 'axios';
import { Customer } from "../../../styles/types/CustomerTypes";
import { Broker } from "../../../styles/types/BrokerTypes";

interface CustomerInfoProps {
  formCustomer: Customer;
  setFormCustomer: React.Dispatch<React.SetStateAction<Customer>>;
}

const brokerSchema = z.object({
  cust_broker_name: z
    .string()
    .max(200, "Broker name cannot exceed 200 characters")
    .regex(
      /^[a-zA-Z0-9\s.,'"-]+$/,
      "Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed"
    )
    .optional(),
  cust_bkp_notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .regex(
      /^[a-zA-Z0-9\s.,'"-]*$/,
      "Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed"
    )
    .optional(),
  cust_bkspl_notes: z
    .string()
    .max(500, "Special notes By cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s.,'"-]*$/,
      "Only letters, numbers, spaces, apostrophes, periods, commas, and hyphens allowed"
    )
    .optional(),
});

const fields = [
  {
    key: "cust_bkp_notes",
    label: "Payment notes",
    placeholder: "Enter Payment notes",
    type: "textarea",
  },
  {
    key: "cust_bkspl_notes",
    label: "Special notes for confirmation doc",
    placeholder: "Enter Special notes for confirmation doc",
    type: "textarea",
  },
];

const CustomBroker: React.FC<CustomerInfoProps> = ({
  formCustomer,
  setFormCustomer,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brokers, setBrokers] = useState<{ value: string; label: string }[]>(
    []
  );

  const API_URL = process.env.API_BASE_URL;

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<Broker[]>(`${API_URL}/broker`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response || !response.data) {
          console.error("API response is undefined or invalid:", response);
          return;
        }

        console.log("Fetched brokers:", response.data);

        const formattedBrokers = response.data.map((broker) => ({
          value: broker.broker_name,
          label: broker.broker_name,
        }));

        setBrokers(formattedBrokers);

        if (formattedBrokers.length > 0) {
          setFormCustomer((prev) => ({
            ...prev,
            broker_name: formattedBrokers[0].value,
          }));
        }
      } catch (error) {
        console.error("Error fetching brokers:", error);
      }
    };

    fetchBrokers();
  }, []);

  useEffect(() => {
    if (formCustomer.cust_broker_name) {
      const selectedBroker = brokers.find(
        (b) => b.value === formCustomer.cust_broker_name
      );
      if (selectedBroker) {
        setFormCustomer((prev) => ({ ...prev, broker: selectedBroker.value }));
      }
    }
  }, [formCustomer.cust_broker_name, brokers]);

  const validateAndSetCustomer = (
    field: keyof Customer,
    value: string | boolean
  ) => {
    let sanitizedValue = value;

    let error = "";
    const tempCustomer = { ...formCustomer, [field]: sanitizedValue };
    const result = brokerSchema.safeParse(tempCustomer);

    if (!result.success) {
      const fieldError = result.error.errors.find(
        (err) => err.path[0] === field
      );
      error = fieldError ? fieldError.message : "";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCustomer(tempCustomer);
  };

  return (
    <fieldset className="form-section">
      <legend>Customer Information</legend>
      <hr />
      <div
        className="form-grid"
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        }}
      >
        <div className="form-group" style={{ flex: "1 1 45%" }}>
          <label htmlFor="customer">Broker</label>
          <select
            id="quote_customer"
            value={formCustomer.cust_broker_name || ""}
            onChange={(e) =>
              validateAndSetCustomer("cust_broker_name", e.target.value)
            }
            onBlur={() =>
              validateAndSetCustomer(
                "cust_broker_name",
                formCustomer.cust_broker_name || ""
              )
            }
            required
          >
            <option value="">Select a broker</option>
            {brokers.length > 0 ? (
              brokers.map((broker, index) => (
                <option key={`${broker.value}-${index}`} value={broker.value}>
                  {broker.label}
                </option>
              ))
            ) : (
              <option disabled>No customers found</option>
            )}
          </select>
          {errors.customer && (
            <span className="error" style={{ color: "red" }}>
              {errors.customer}
            </span>
          )}
        </div>

        {fields.map(({ key, label, placeholder, type }) => (
          <div className="form-group" key={key} style={{ flex: "1 1 45%" }}>
            <label htmlFor={key}>{label}</label>
            {type === "textarea" ? (
              <textarea
                id={key}
                name={key}
                value={String(formCustomer[key as keyof Customer] || "")}
                onChange={(e) =>
                  validateAndSetCustomer(key as keyof Customer, e.target.value)
                }
                placeholder={placeholder}
                rows={4}
              />
            ) : (
              <input
                type={type}
                id={key}
                placeholder={placeholder}
                value={String(formCustomer[key as keyof Customer] || "")}
                onChange={(e) =>
                  validateAndSetCustomer(key as keyof Customer, e.target.value)
                }
              />
            )}
            {errors[key] && (
              <span className="error" style={{ color: "red" }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default CustomBroker;
