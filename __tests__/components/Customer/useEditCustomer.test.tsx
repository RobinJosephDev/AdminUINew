import { renderHook, act } from "@testing-library/react";
import useEditCustomer from "../../../src/hooks/edit/useEditCustomer";
import { Customer } from "../../../src/types/CustomerTypes";
import axios from "axios";
import Swal from "sweetalert2";

jest.mock("axios");
jest.mock("sweetalert2");

const mockCustomer: Customer = {
  id: 1,
  cust_type: "Type A",
  cust_name: "Test Customer",
  cust_ref_no: "REF123",
  cust_website: "https://example.com",
  cust_email: "test@example.com",
  cust_contact_no: "1234567890",
  cust_contact_no_ext: "",
  cust_tax_id: "TAX123",
  cust_primary_address: "123 Main St",
  cust_primary_city: "City",
  cust_primary_state: "State",
  cust_primary_country: "Country",
  cust_primary_postal: "123456",
  cust_primary_unit_no: "Unit 1",
  cust_mailing_address: "456 Mailing St",
  cust_mailing_city: "Mail City",
  cust_mailing_state: "Mail State",
  cust_mailing_country: "Mail Country",
  cust_mailing_postal: "654321",
  cust_mailing_unit_no: "Mail Unit",
  sameAsPrimary: false,
  cust_ap_name: "AP Name",
  cust_ap_address: "AP Address",
  cust_ap_city: "AP City",
  cust_ap_state: "AP State",
  cust_ap_country: "AP Country",
  cust_ap_postal: "AP Postal",
  cust_ap_unit_no: "AP Unit",
  cust_ap_email: "ap@example.com",
  cust_ap_phone: "9999999999",
  cust_ap_phone_ext: "123",
  cust_ap_fax: "88888888",
  cust_broker_name: "Broker Name",
  cust_bkp_notes: "Backup Notes",
  cust_bkspl_notes: "Special Notes",
  cust_credit_status: "Approved",
  cust_credit_mop: "Card",
  cust_credit_currency: "USD",
  cust_credit_appd: "2024-01-01",
  cust_credit_expd: "2025-01-01",
  cust_credit_terms: 30,
  cust_credit_limit: 10000,
  cust_credit_application: true,
  cust_credit_agreement: "",
  cust_sbk_agreement: "",
  cust_credit_notes: "Credit good",
  cust_contact: [],
  cust_equipment: [],
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("useEditCustomer", () => {
  const onCloseMock = jest.fn();
  const onUpdateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "test-token");
  });

  it("should initialize form with customer data", () => {
    const { result } = renderHook(() =>
      useEditCustomer(mockCustomer, onCloseMock, onUpdateMock)
    );

    expect(result.current.formCustomer.cust_name).toBe("Test Customer");
    expect(result.current.formCustomer.cust_ref_no).toBe("REF123");
  });

  it("should show validation error if required fields are missing", async () => {
    const { result } = renderHook(() =>
      useEditCustomer(
        { ...mockCustomer, cust_name: "", cust_ref_no: "" },
        onCloseMock,
        onUpdateMock
      )
    );

    await act(async () => {
      await result.current.updateCustomer();
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      "Validation Error",
      "Please fill in all required fields.",
      "error"
    );
  });

  it("should call API and update customer successfully", async () => {
    (axios.put as jest.Mock).mockResolvedValue({ data: mockCustomer });

    const { result } = renderHook(() =>
      useEditCustomer(mockCustomer, onCloseMock, onUpdateMock)
    );

    await act(async () => {
      await result.current.updateCustomer();
    });

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/customer/${mockCustomer.id}`),
      expect.any(Object),
      expect.any(Object)
    );

    expect(Swal.fire).toHaveBeenCalledWith(
      "Success!",
      "Customer updated successfully.",
      "success"
    );
    expect(onUpdateMock).toHaveBeenCalledWith(mockCustomer);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should show error when no token found", async () => {
    localStorage.removeItem("token");

    const { result } = renderHook(() =>
      useEditCustomer(mockCustomer, onCloseMock, onUpdateMock)
    );

    await act(async () => {
      await result.current.updateCustomer();
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Unauthorized",
      text: "You are not logged in. Please log in again.",
    });
  });

  it("should handle API error gracefully", async () => {
    (axios.put as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() =>
      useEditCustomer(mockCustomer, onCloseMock, onUpdateMock)
    );

    await act(async () => {
      await result.current.updateCustomer();
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      "Error",
      "An error occurred while processing the customer.",
      "error"
    );
  });
});
