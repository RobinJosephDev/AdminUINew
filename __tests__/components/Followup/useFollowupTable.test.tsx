import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import axios from "axios";
import Swal from "sweetalert2";
import useFollowupTable from "../../../src/hooks/table/useFollowupTable";
import { Followup } from "../../../src/types/FollowupTypes";

jest.mock("axios");
jest.mock("sweetalert2");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSwal = Swal as jest.Mocked<typeof Swal>;

const mockFollowups: Followup[] = [
  {
    id: 1,
    lead_no: "L001",
    lead_date: "2024-01-01",
    customer_name: "Customer A",
    phone: "1234567890",
    email: "test@example.com",
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
    unit_no: "",
    lead_type: "",
    contact_person: "",
    notes: "",
    next_follow_up_date: "",
    followup_type: "",
    lead_status: "",
    remarks: "",
    equipment: "",
    contacts: [],
    products: [],
    created_at: "",
    updated_at: "",
  },
];

describe("useFollowupTable", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockFollowups });
    localStorage.setItem("token", "mock-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should fetch followups and initialize data", async () => {
    const { result } = renderHook(() => useFollowupTable());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.followUps).toEqual(mockFollowups);
  });

  it("should handle modal opening/closing", async () => {
    const { result } = renderHook(() => useFollowupTable());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.openEditModal(mockFollowups[0]);
    });

    expect(result.current.isEditModalOpen).toBe(true);
    expect(result.current.selectedFollowup).toEqual(mockFollowups[0]);

    act(() => {
      result.current.closeEditModal();
    });

    expect(result.current.isEditModalOpen).toBe(false);
    expect(result.current.selectedFollowup).toBeNull();
  });

  it("should toggle selection correctly", async () => {
    const { result } = renderHook(() => useFollowupTable());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.toggleSelect(mockFollowups[0].id);
    });

    expect(result.current.selectedIds).toContain(mockFollowups[0].id);

    act(() => {
      result.current.toggleSelect(mockFollowups[0].id);
    });

    expect(result.current.selectedIds).not.toContain(mockFollowups[0].id);
  });

  it("should handle deletion with confirmation", async () => {
    mockedSwal.fire.mockResolvedValue({ isConfirmed: true } as any);
    mockedAxios.delete.mockResolvedValue({});

    const { result } = renderHook(() => useFollowupTable());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.toggleSelect(mockFollowups[0].id);
    });

    await act(async () => {
      await result.current.deleteSelected();
    });

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining("/lead-followup/1"),
      expect.anything()
    );

    expect(mockedSwal.fire).toHaveBeenCalledWith(
      "Deleted!",
      expect.any(String),
      "success"
    );
    expect(result.current.followUps).toHaveLength(0);
  });
});
