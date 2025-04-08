import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import useQuoteTable from "../../../src/hooks/table/useQuoteTable";
import axios from "axios";
import Swal from "sweetalert2";

jest.mock("axios");
jest.mock("sweetalert2");

const mockQuotes = [
  { id: 1, created_at: "2025-04-01", quote_name: "Quote A" },
  { id: 2, created_at: "2025-04-02", quote_name: "Quote B" },
];

describe("useQuoteTable", () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockReset();
    (axios.delete as jest.Mock).mockReset();
    (axios.post as jest.Mock).mockReset();
    localStorage.setItem("token", "test-token");
  });

  it("fetches quotes on mount", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockQuotes });

    const { result } = renderHook(() => useQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.quotes).toEqual(mockQuotes);
    expect(result.current.loading).toBe(false);
  });

  it("handles sorting correctly", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockQuotes });

    const { result } = renderHook(() => useQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleSort("quote_name");
    });

    expect(result.current.sortBy).toBe("quote_name");
    expect(result.current.sortDesc).toBe(false);
  });

  it("toggles modals and selection", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockQuotes });

    const { result } = renderHook(() => useQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.openEditModal(mockQuotes[0]);
    });

    expect(result.current.isEditModalOpen).toBe(true);
    expect(result.current.selectedQuote).toEqual(mockQuotes[0]);

    act(() => {
      result.current.toggleSelect(mockQuotes[0].id);
    });

    expect(result.current.selectedIds).toContain(mockQuotes[0].id);
  });

  it("handles email sending success", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockQuotes });
    (axios.post as jest.Mock).mockResolvedValue({});
    (Swal.fire as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSelectedIds([1]);
      result.current.setEmailData({ subject: "Test", content: "Content" });
    });

    await act(async () => {
      await result.current.sendEmails();
    });

    expect(axios.post).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      "Success!",
      "Emails have been sent.",
      "success"
    );
  });

  it("shows warning when no quotes selected to delete", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockQuotes });
    (Swal.fire as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useQuoteTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteSelected();
    });

    expect(Swal.fire).toHaveBeenCalledWith({
      icon: "warning",
      title: "No record selected",
      text: "Please select a record to delete.",
    });
  });
});
