import { renderHook, act } from "@testing-library/react";
import useEditQuote from "../../../src/hooks/edit/useEditQuote";
import Swal from "sweetalert2";
import axios from "axios";
import { Quote } from "../../../src/types/QuoteTypes";

jest.mock("axios");
jest.mock("sweetalert2");

const mockQuote: Quote = {
  id: 1,
  quote_type: "Type A",
  quote_customer: "Customer A",
  quote_cust_ref_no: "REF123",
  quote_booked_by: "John Doe",
  quote_temperature: "Cold",
  quote_hot: true,
  quote_team: false,
  quote_air_ride: false,
  quote_tarp: false,
  quote_hazmat: false,
  quote_pickup: [],
  quote_delivery: [],
  created_at: "",
  updated_at: "",
};

describe("useEditQuote", () => {
  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "test-token");
    jest.spyOn(console, "error").mockImplementation(() => {});

  });

  it("loads initial quote data", () => {
    const { result } = renderHook(() =>
      useEditQuote(mockQuote, mockOnClose, mockOnUpdate)
    );

    expect(result.current.formQuote.id).toBe(1);
    expect(result.current.formQuote.quote_type).toBe("Type A");
  });

  it("shows validation error if required fields are missing", async () => {
    const incompleteQuote = { ...mockQuote, quote_type: "" };
    const { result } = renderHook(() =>
      useEditQuote(incompleteQuote, mockOnClose, mockOnUpdate)
    );

    await act(async () => {
      await result.current.updateQuote();
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      "Validation Error",
      "Please fill in all required fields.",
      "error"
    );
  });

  it("calls axios.put and updates successfully", async () => {
    (axios.put as jest.Mock).mockResolvedValue({ data: mockQuote });

    const { result } = renderHook(() =>
      useEditQuote(mockQuote, mockOnClose, mockOnUpdate)
    );

    await act(async () => {
      await result.current.updateQuote();
    });

    expect(axios.put).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "success",
      title: "Updated!",
      text: "Quote updated successfully.",
    });
    expect(mockOnUpdate).toHaveBeenCalledWith(mockQuote);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles axios error on update", async () => {
    (axios.put as jest.Mock).mockRejectedValue({
      response: { status: 500, data: "Server error" },
    });

    const { result } = renderHook(() =>
      useEditQuote(mockQuote, mockOnClose, mockOnUpdate)
    );

    await act(async () => {
      await result.current.updateQuote();
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Oops...",
      text: "Failed to update quote.",
    });
  });

  it("adds and removes pickup location", () => {
    const { result } = renderHook(() =>
      useEditQuote(mockQuote, mockOnClose, mockOnUpdate)
    );

    act(() => {
      result.current.handleAddPickup();
    });

    expect(result.current.formQuote.quote_pickup.length).toBe(1);

    act(() => {
      result.current.handleRemovePickup(0);
    });

    expect(result.current.formQuote.quote_pickup.length).toBe(0);
  });

  it("adds and removes delivery location", () => {
    const { result } = renderHook(() =>
      useEditQuote(mockQuote, mockOnClose, mockOnUpdate)
    );

    act(() => {
      result.current.handleAddDelivery();
    });

    expect(result.current.formQuote.quote_delivery.length).toBe(1);

    act(() => {
      result.current.handleRemoveDelivery(0);
    });

    expect(result.current.formQuote.quote_delivery.length).toBe(0);
  });
});
