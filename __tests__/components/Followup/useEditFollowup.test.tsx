import { renderHook, act } from "@testing-library/react";
import axios from "axios";
import Swal from "sweetalert2";
import useEditFollowup from "../../../src/hooks/edit/useEditFollowup";
import { Followup } from "../../../src/types/FollowupTypes";

jest.mock("axios");
jest.mock("sweetalert2");

const mockFollowup: Followup = {
  id: 1,
  lead_no: "L-001",
  lead_date: "2024-04-01",
  customer_name: "Test Corp",
  phone: "1234567890",
  email: "test@example.com",
  address: "123 Street",
  city: "City",
  state: "State",
  country: "Country",
  postal_code: "123456",
  unit_no: "U1",
  lead_type: "Hot",
  contact_person: "John Doe",
  notes: "Sample notes",
  next_follow_up_date: "2024-04-10",
  followup_type: "Call",
  lead_status: "Open",
  remarks: "Pending",
  equipment: "Truck",
  contacts: [{ id: "1", name: "Alice", phone: "111", email: "alice@test.com" }],
  products: [{ id: "1", name: "Item A", quantity: 5 }],
  created_at: "",
  updated_at: "",
};

describe("useEditFollowup Hook (Jest)", () => {
  const onClose = jest.fn();
  const onUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "mock-token");
  });

  it("should initialize followupEdit with provided followup", () => {
    const { result } = renderHook(() =>
      useEditFollowup(mockFollowup, onClose, onUpdate)
    );
    expect(result.current.followupEdit.lead_no).toBe("L-001");
    expect(result.current.followupEdit.contacts.length).toBe(1);
    expect(result.current.followupEdit.products.length).toBe(1);
  });

  it("should add a contact", () => {
    const { result } = renderHook(() =>
      useEditFollowup(mockFollowup, onClose, onUpdate)
    );
    act(() => {
      result.current.handleAddContact();
    });
    expect(result.current.followupEdit.contacts.length).toBe(2);
  });

  it("should remove a contact by id", () => {
    const { result } = renderHook(() =>
      useEditFollowup(mockFollowup, onClose, onUpdate)
    );
    act(() => {
      result.current.handleRemoveContact("1");
    });
    expect(result.current.followupEdit.contacts.length).toBe(0);
  });

  it("should add a product", () => {
    const { result } = renderHook(() =>
      useEditFollowup(mockFollowup, onClose, onUpdate)
    );
    act(() => {
      result.current.handleAddProduct();
    });
    expect(result.current.followupEdit.products.length).toBe(2);
  });

  it("should remove a product by id", () => {
    const { result } = renderHook(() =>
      useEditFollowup(mockFollowup, onClose, onUpdate)
    );
    act(() => {
      result.current.handleRemoveProduct("1");
    });
    expect(result.current.followupEdit.products.length).toBe(0);
  });

  it("should show validation alert if required fields are missing", async () => {
    const invalidFollowup = { ...mockFollowup, lead_no: "" };
    const { result } = renderHook(() =>
      useEditFollowup(invalidFollowup, onClose, onUpdate)
    );

    await act(async () => {
      await result.current.updateFollowup();
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      "Validation Error",
      "Please fill in all required fields.",
      "error"
    );
  });

  it("should update followup and call onUpdate/onClose", async () => {
    const updatedResponse = {
      data: { ...mockFollowup, lead_status: "Closed" },
    };
    (axios.put as jest.Mock).mockResolvedValue(updatedResponse);

    const { result } = renderHook(() =>
      useEditFollowup(mockFollowup, onClose, onUpdate)
    );

    await act(async () => {
      await result.current.updateFollowup();
    });

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/lead-followup/${mockFollowup.id}`),
      expect.any(Object),
      expect.objectContaining({
        headers: { Authorization: `Bearer mock-token` },
      })
    );

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "success",
      title: "Updated!",
      text: "Follow-up data has been updated successfully.",
    });

    expect(onUpdate).toHaveBeenCalledWith(updatedResponse.data);
    expect(onClose).toHaveBeenCalled();
  });
});
