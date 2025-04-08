import { renderHook, act } from "@testing-library/react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAddLead } from "../../../src/hooks/add/useAddLead";
import { Contact } from "../../../src/types/LeadTypes";

jest.mock("axios");
jest.mock("sweetalert2");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSwal = Swal as jest.Mocked<typeof Swal>;

describe("useAddLead", () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "fake-token"),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with empty lead object", () => {
    const { result } = renderHook(() => useAddLead(onClose, onSuccess));
    expect(result.current.lead).toBeDefined();
    expect(result.current.lead.lead_no).toBe("");
  });

  it("adds a contact", () => {
    const { result } = renderHook(() => useAddLead(onClose, onSuccess));

    act(() => {
      result.current.handleAddContact();
    });

    expect(result.current.lead.contacts).toHaveLength(1);
  });

  it("removes a contact", () => {
    const { result } = renderHook(() => useAddLead(onClose, onSuccess));

    act(() => {
      result.current.handleAddContact();
    });
    expect(result.current.lead.contacts).toHaveLength(1);

    act(() => {
      result.current.handleRemoveContact(0);
    });

    expect(result.current.lead.contacts).toHaveLength(0);
  });

  it("updates a contact", () => {
    const { result } = renderHook(() => useAddLead(onClose, onSuccess));

    act(() => {
      result.current.handleAddContact();
    });

    const updatedContact: Contact = {
      name: "John Doe",
      phone: "1234567890",
      email: "john@example.com",
    };

    act(() => {
      result.current.handleContactChange(0, updatedContact);
    });

    expect(result.current.lead.contacts[0]).toEqual(updatedContact);
  });

  it("shows error alert on validation failure", async () => {
    const { result } = renderHook(() => useAddLead(onClose, onSuccess));

    const fakeEvent = { preventDefault: jest.fn() } as any;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockedSwal.fire).toHaveBeenCalledWith(
      "Validation Error",
      "Please fill in all required fields.",
      "error"
    );
  });

  it("submits lead via POST successfully", async () => {
    const { result } = renderHook(() => useAddLead(onClose, onSuccess));

    act(() => {
      result.current.setLead((prev) => ({
        ...prev,
        lead_no: "L001",
        lead_date: "2023-01-01",
        lead_type: "Type A",
        lead_status: "New",
      }));
    });

    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    const fakeEvent = { preventDefault: jest.fn() } as any;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockedAxios.post).toHaveBeenCalled();
    expect(mockedSwal.fire).toHaveBeenCalledWith(
      "Success",
      "Lead data has been saved successfully.",
      "success"
    );
    expect(onSuccess).toHaveBeenCalled();
  });

  it("shows error when no token is found", async () => {
    (localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

    const { result } = renderHook(() => useAddLead(onClose, onSuccess));

    // Fill required fields to bypass validation
    act(() => {
      result.current.setLead((prev) => ({
        ...prev,
        lead_no: "L123",
        lead_date: "2023-04-08",
        lead_type: "Demo Type",
        lead_status: "Open",
      }));
    });

    const fakeEvent = { preventDefault: jest.fn() } as any;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockedSwal.fire).toHaveBeenCalledWith(
      "Error",
      "No token found",
      "error"
    );
  });

  it("shows error alert on failed submit", async () => {
    (localStorage.getItem as jest.Mock).mockReturnValue("valid-token");

    const { result } = renderHook(() => useAddLead(onClose, onSuccess));

    act(() => {
      result.current.setLead((prev) => ({
        ...prev,
        lead_no: "L002",
        lead_date: "2023-01-02",
        lead_type: "Type B",
        lead_status: "Open",
      }));
    });

    mockedAxios.post.mockRejectedValueOnce(new Error("Server error"));

    const fakeEvent = { preventDefault: jest.fn() } as any;

    await act(async () => {
      await result.current.handleSubmit(fakeEvent);
    });

    expect(mockedSwal.fire).toHaveBeenCalledWith(
      "Error",
      "An error occurred while saving/updating the lead.",
      "error"
    );
  });
});
