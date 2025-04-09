import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddShipmentForm from "../../../src/components/Sales/AddShipment/AddShipmentForm";
import { UserContext } from "../../../src/UserProvider";
import axios from "axios";
import Swal from "sweetalert2";

jest.mock("axios");
jest.mock("sweetalert2");

// Mock ShipmentDetails component
jest.mock("../../../src/components/Sales/AddShipment/ShipmentDetails", () => ({
  __esModule: true,
  default: ({ shipment, setShipment }: any) => (
    <div>
      <input
        placeholder="Load Date"
        value={shipment.ship_load_date}
        onChange={(e) => setShipment((prev: any) => ({ ...prev, ship_load_date: e.target.value }))}
      />
      <input
        placeholder="Pickup Location"
        value={shipment.ship_pickup_location}
        onChange={(e) => setShipment((prev: any) => ({ ...prev, ship_pickup_location: e.target.value }))}
      />
      <input
        placeholder="Price"
        value={shipment.ship_price}
        onChange={(e) => setShipment((prev: any) => ({ ...prev, ship_price: e.target.value }))}
      />
    </div>
  ),
}));

describe("AddShipmentForm", () => {
  const mockOnClose = jest.fn();
  const mockOnAddShipment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "mock-token");
  });

  it("renders the form", () => {
    render(
      <UserContext.Provider value={{ currentUser: { id: 1, name: "Test User" } }}>
        <AddShipmentForm onClose={mockOnClose} onAddShipment={mockOnAddShipment} />
      </UserContext.Provider>
    );

    expect(screen.getByPlaceholderText("Load Date")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Pickup Location")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Price")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("submits form and shows success alert", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { id: 1, ship_price: "1000" } });

    render(
      <UserContext.Provider value={{ currentUser: { id: 1, name: "Test User" } }}>
        <AddShipmentForm onClose={mockOnClose} onAddShipment={mockOnAddShipment} />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Load Date"), { target: { value: "2025-04-08" } });
    fireEvent.change(screen.getByPlaceholderText("Pickup Location"), { target: { value: "NY" } });
    fireEvent.change(screen.getByPlaceholderText("Price"), { target: { value: "1000" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith("Saved!", "Shipment data has been saved successfully.", "success");
      expect(mockOnAddShipment).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("shows error alert if token is missing", async () => {
    localStorage.removeItem("token");

    render(
      <UserContext.Provider value={{ currentUser: { id: 1, name: "Test User" } }}>
        <AddShipmentForm onClose={mockOnClose} onAddShipment={mockOnAddShipment} />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith("Error", "No token found", "error");
    });
  });

  it("shows error alert if axios throws", async () => {
    (axios.post as jest.Mock).mockRejectedValue({ response: { data: "Internal error" } });

    render(
      <UserContext.Provider value={{ currentUser: { id: 1, name: "Test User" } }}>
        <AddShipmentForm onClose={mockOnClose} onAddShipment={mockOnAddShipment} />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Load Date"), { target: { value: "2025-04-08" } });
    fireEvent.change(screen.getByPlaceholderText("Pickup Location"), { target: { value: "NY" } });
    fireEvent.change(screen.getByPlaceholderText("Price"), { target: { value: "1000" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Error",
        "An error occurred while saving/updating the shipment.",
        "error"
      );
    });
  });
});
