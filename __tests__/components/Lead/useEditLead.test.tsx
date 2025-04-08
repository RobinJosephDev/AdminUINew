import { renderHook, act } from "@testing-library/react";
import axios from "axios";
import Swal from "sweetalert2";
import useEditLead from "../../../src/hooks/edit/useEditLead";
import { Lead, Contact } from "../../../src/types/LeadTypes";

jest.mock("axios");
jest.mock("sweetalert2");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSwal = Swal as jest.Mocked<typeof Swal>;

describe("useEditLead", () => {
  const mockLead: Lead = {
    id: 1,
    lead_no: "L001",
    lead_date: "2023-01-01",
    customer_name: "John Doe",
    phone: "1234567890",
    email: "john@example.com",
    website: "example.com",
    address: "123 Main St",
    unit_no: "A1",
    city: "City",
    state: "State",
    country: "Country",
    postal_code: "12345",
    equipment_type: "Truck",
    lead_type: "Type A",
    lead_status: "New",
    follow_up_date: "2023-01-10",
    contact_person: "John",
    notes: "Some notes",
    assigned_to: "Admin",
    contacts: [
      {
        name: "Contact 1",
        phone: "1111111111",
        email: "contact1@example.com",
      },
    ],
    created_at: "",
    updated_at: "",
  };

  const onClose = jest.fn();
  const onUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "valid-token"),
      },
      writable: true,
    });

    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("initializes formLead from provided lead", () => {
    const { result } = renderHook(() => useEditLead(mockLead, onClose, onUpdate));
    expect(result.current.formLead.lead_no).toBe("L001");
    expect(result.current.formLead.contacts.length).toBe(1);
  });

  it("adds a contact", () => {
    const { result } = renderHook(() => useEditLead(mockLead, onClose, onUpdate));
    act(() => {
      result.current.handleAddContact();
    });
    expect(result.current.formLead.contacts.length).toBe(2);
  });

  it("removes a contact", () => {
    const { result } = renderHook(() => useEditLead(mockLead, onClose, onUpdate));
    act(() => {
      result.current.handleRemoveContact(0);
    });
    expect(result.current.formLead.contacts.length).toBe(0);
  });

  it("updates a contact", () => {
    const { result } = renderHook(() => useEditLead(mockLead, onClose, onUpdate));
    const updatedContact: Contact = {
      name: "Updated Name",
      phone: "9999999999",
      email: "updated@example.com",
    };
    act(() => {
      result.current.handleContactChange(0, updatedContact);
    });
    expect(result.current.formLead.contacts[0]).toEqual(updatedContact);
  });

  it("shows validation error if fields are missing", async () => {
    const incompleteLead = { ...mockLead, lead_no: "" };
    const { result } = renderHook(() => useEditLead(incompleteLead, onClose, onUpdate));

    await act(async () => {
      await result.current.updateLead();
    });

    expect(mockedSwal.fire).toHaveBeenCalledWith("Validation Error", "Please fill in all required fields.", "error");
  });

  it("updates lead successfully", async () => {
    mockedAxios.put.mockResolvedValueOnce({ data: mockLead });

    const { result } = renderHook(() => useEditLead(mockLead, onClose, onUpdate));

    await act(async () => {
      await result.current.updateLead();
    });

    expect(mockedAxios.put).toHaveBeenCalled();
    expect(mockedSwal.fire).toHaveBeenCalledWith({
      icon: "success",
      title: "Updated!",
      text: "Lead data has been updated successfully.",
    });
    expect(onUpdate).toHaveBeenCalledWith(mockLead);
    expect(onClose).toHaveBeenCalled();
  });

  it("shows unauthorized error if no token", async () => {
    (localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

    const { result } = renderHook(() => useEditLead(mockLead, onClose, onUpdate));

    await act(async () => {
      await result.current.updateLead();
    });

    expect(mockedSwal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Unauthorized",
      text: "You are not logged in. Please log in again.",
    });
  });

  it("handles update error gracefully", async () => {
    mockedAxios.put.mockRejectedValueOnce({ response: { status: 500 } });

    const { result } = renderHook(() => useEditLead(mockLead, onClose, onUpdate));

    await act(async () => {
      await result.current.updateLead();
    });

    expect(mockedSwal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Oops...",
      text: "Failed to update lead.",
    });
  });

  it("handles 401 error specifically", async () => {
    mockedAxios.put.mockRejectedValueOnce({ response: { status: 401 } });

    const { result } = renderHook(() => useEditLead(mockLead, onClose, onUpdate));

    await act(async () => {
      await result.current.updateLead();
    });

    expect(mockedSwal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Oops...",
      text: "Unauthorized. Please log in again.",
    });
  });
});
