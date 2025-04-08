import { renderHook, act, waitFor } from "@testing-library/react";
import useLeadTable from "../../../src/hooks/table/useLeadTable";
import axios from "axios";
import Swal from "sweetalert2";

jest.mock("axios");
jest.mock("sweetalert2");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSwal = Swal as jest.Mocked<typeof Swal>;

describe("useLeadTable", () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    // Suppress act(...) warnings during tests
    jest.spyOn(console, "error").mockImplementation((msg, ...args) => {
        if (
          typeof msg === "string" &&
          (msg.includes("An update to") || msg.includes("Error loading leads"))
        ) {
          return;
        }
        originalConsoleError(msg, ...args);
      });
      
  });

  beforeEach(() => {
    // Mock localStorage
    if (!global.localStorage) {
      Object.defineProperty(global, "localStorage", {
        value: {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
          clear: jest.fn(),
        },
      });
    } else {
      global.localStorage.setItem = jest.fn();
      global.localStorage.getItem = jest.fn();
      global.localStorage.removeItem = jest.fn();
      global.localStorage.clear = jest.fn();
    }

    localStorage.setItem("token", "fake-token");
    mockedAxios.get.mockReset();
    mockedAxios.delete.mockReset();
    mockedSwal.fire.mockClear();
  });

  afterAll(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it("fetches leads successfully", async () => {
    const fakeLeads = [
      { id: 1, name: "Lead 1", created_at: "2023-01-01" },
      { id: 2, name: "Lead 2", created_at: "2023-01-02" },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: fakeLeads });

    const { result } = renderHook(() => useLeadTable());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.leads).toEqual(fakeLeads);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/lead"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
        }),
      })
    );
  });

  it("shows Swal alert when unauthorized (401)", async () => {
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 401 } });

    const { result } = renderHook(() => useLeadTable());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedSwal.fire).toHaveBeenCalledWith({
      icon: "error",
      title: "Unauthorized",
      text: "You need to log in to access this resource.",
    });
  });

  it("handles toggleSelect correctly", () => {
    const { result } = renderHook(() => useLeadTable());

    act(() => {
      result.current.toggleSelect(5);
    });
    expect(result.current.selectedIds).toEqual([5]);

    act(() => {
      result.current.toggleSelect(5);
    });
    expect(result.current.selectedIds).toEqual([]);
  });

  it("handles modal opening and closing", () => {
    const { result } = renderHook(() => useLeadTable());

    const mockLead = { id: 1, name: "Sample Lead", created_at: "2023-01-01" };

    act(() => {
      result.current.openEditModal(mockLead);
    });
    expect(result.current.isEditModalOpen).toBe(true);
    expect(result.current.selectedLead).toEqual(mockLead);

    act(() => {
      result.current.closeEditModal();
    });
    expect(result.current.isEditModalOpen).toBe(false);
    expect(result.current.selectedLead).toBe(null);
  });
});
