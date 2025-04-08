import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import useLeadQuoteTable from "../../../src/hooks/table/useLeadQuoteTable";
import axios from "axios";
import Swal from "sweetalert2";
import { Lead } from "../../../src/types/LeadTypes";

jest.mock("axios");
jest.mock("sweetalert2");

const mockLeads: Lead[] = [
  {
    id: 1,
    customer_name: "John Doe",
    email: "john@example.com",
    state: "CA",
    lead_status: "Quotations",
    created_at: "2023-01-01",
  } as Lead,
  {
    id: 2,
    customer_name: "Jane Smith",
    email: "jane@example.com",
    state: "NY",
    lead_status: "Followed Up",
    created_at: "2023-01-02",
  } as Lead,
];

describe("useLeadTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "mock-token");
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it('fetches and filters leads by "Quotations"', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockLeads });

    const { result } = renderHook(() => useLeadQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.leads).toHaveLength(1);
    expect(result.current.leads[0].lead_status).toBe("Quotations");
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/lead"), {
      headers: { Authorization: "Bearer mock-token" },
    });
  });

  it("handles unauthorized error on fetch", async () => {
    (axios.get as jest.Mock).mockRejectedValue({ response: { status: 401 } });

    const { result } = renderHook(() => useLeadQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Unauthorized",
      text: "You need to log in to access this resource.",
    });
  });

  it("sorts leads by created_at descending and toggles on repeated sort", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockLeads });

    const { result } = renderHook(() => useLeadQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleSort("created_at");
    });

    expect(result.current.sortDesc).toBe(false); // Was true by default
    expect(result.current.sortBy).toBe("created_at");

    act(() => {
      result.current.handleSort("created_at");
    });

    expect(result.current.sortDesc).toBe(true);
  });

  it("selects and deselects leads correctly", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockLeads });

    const { result } = renderHook(() => useLeadQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.toggleSelect(1);
    });

    expect(result.current.selectedIds).toContain(1);

    act(() => {
      result.current.toggleSelect(1);
    });

    expect(result.current.selectedIds).not.toContain(1);
  });

  it("updates lead correctly", async () => {
    const updatedLead = { ...mockLeads[0], customer_name: "Updated Name" };
    (axios.get as jest.Mock).mockResolvedValue({ data: mockLeads });

    const { result } = renderHook(() => useLeadQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.updateLead(updatedLead);
    });

    expect(result.current.leads[0].customer_name).toBe("Updated Name");
  });
});
