import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import Swal from "sweetalert2";
import useCustomerTable from "../../../src/hooks/table/useCustomerTable";
import { Customer } from "../../../src/types/CustomerTypes";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

jest.mock("axios");
jest.mock("sweetalert2");

describe("useCustomerTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "test-token");
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("fetches and sets customers successfully", async () => {
    const mockCustomers: Customer[] = [
      {
        id: 1,
        cust_type: "Retail",
        cust_name: "John Doe Enterprises",
        cust_ref_no: "CUST-001",
        cust_website: "https://johndoe.com",
        cust_email: "john@example.com",
        cust_contact_no: "1234567890",
        cust_contact_no_ext: "101",
        cust_tax_id: "TAX1234567",
        cust_primary_address: "123 Main Street",
        cust_primary_city: "New York",
        cust_primary_state: "NY",
        cust_primary_country: "USA",
        cust_primary_postal: "10001",
        cust_primary_unit_no: "Unit 5A",
        cust_mailing_address: "PO Box 456",
        cust_mailing_city: "Brooklyn",
        cust_mailing_state: "NY",
        cust_mailing_country: "USA",
        cust_mailing_postal: "11201",
        cust_mailing_unit_no: "Suite 101",
        sameAsPrimary: false,
        cust_ap_name: "Jane Smith",
        cust_ap_address: "456 Maple Ave",
        cust_ap_city: "Albany",
        cust_ap_state: "NY",
        cust_ap_country: "USA",
        cust_ap_postal: "12207",
        cust_ap_unit_no: "Floor 2",
        cust_ap_email: "ap@johndoe.com",
        cust_ap_phone: "0987654321",
        cust_ap_phone_ext: "202",
        cust_ap_fax: "1112223333",
        cust_broker_name: "Best Brokers Inc.",
        cust_bkp_notes: "Backup contact available on weekends.",
        cust_bkspl_notes: "Special instructions for warehouse deliveries.",
        cust_credit_status: "Approved",
        cust_credit_mop: "Wire Transfer",
        cust_credit_currency: "USD",
        cust_credit_appd: "2023-12-01",
        cust_credit_expd: "2024-12-01",
        cust_credit_terms: 30,
        cust_credit_limit: 50000,
        cust_credit_application: true,
        cust_credit_agreement: "credit_agreement.pdf",
        cust_sbk_agreement: "sbk_agreement.pdf",
        cust_credit_notes: "Payment history is excellent.",
        cust_contact: [
          {
            name: "John Contact",
            phone: "5556667777",
            email: "contact@johndoe.com",
            ext: "8676867",
            designation: "Professor",
            fax: "4543534534",
          },
        ],
        cust_equipment: [
          {
            equipment: "Forklift",
          },
        ],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-02-01T00:00:00Z",
      },
    ];

    (axios.get as jest.Mock).mockResolvedValue({ data: mockCustomers });

    const { result } = renderHook(() => useCustomerTable());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.customers).toEqual(mockCustomers);
    expect(result.current.loading).toBe(false);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/customer"),
      expect.any(Object)
    );
  });

  it("handles unauthorized error and redirects", async () => {
    const error = { response: { status: 401 } };
    const fireMock = Swal.fire as jest.Mock;
    const locationSpy = jest.spyOn(window, "location", "get");
    locationSpy.mockReturnValue({ href: "" } as any);
    (axios.get as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useCustomerTable());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fireMock).toHaveBeenCalledWith({
      icon: "error",
      title: "Unauthorized",
      text: "You need to log in to access this resource.",
    });
  });

  it("shows warning if trying to delete with no selection", async () => {
    const { result } = renderHook(() => useCustomerTable());
    const fireMock = Swal.fire as jest.Mock;

    await act(async () => {
      await result.current.deleteSelected();
    });

    expect(fireMock).toHaveBeenCalledWith({
      icon: "warning",
      title: "No record selected",
      text: "Please select a record to delete.",
    });
  });
});
