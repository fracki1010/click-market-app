import { apiClient } from "@/services/apiClient";

export type MovementStatus = "success" | "info" | "warning" | "error";

export interface MovementItem {
  _id: string;
  event: string;
  module: string;
  status: MovementStatus;
  message: string;
  actor: {
    userId: string | null;
    email: string;
    role: string;
  };
  entity: {
    type: string;
    id: string;
  };
  request: {
    method: string;
    path: string;
    ip: string;
    userAgent: string;
  };
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MovementFilters {
  page?: number;
  limit?: number;
  event?: string;
  module?: string;
  status?: string;
  actorEmail?: string;
  startDate?: string;
  endDate?: string;
}

export interface MovementListResponse {
  items: MovementItem[];
  page: number;
  pages: number;
  total: number;
  limit: number;
}

export const getAdminMovements = async (
  filters: MovementFilters = {},
): Promise<MovementListResponse> => {
  const params = new URLSearchParams();

  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.event) params.set("event", filters.event);
  if (filters.module) params.set("module", filters.module);
  if (filters.status) params.set("status", filters.status);
  if (filters.actorEmail) params.set("actorEmail", filters.actorEmail);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);

  const queryString = params.toString();
  const endpoint = queryString ? `/movements?${queryString}` : "/movements";
  const { data } = await apiClient.get<MovementListResponse>(endpoint);

  return data;
};

export const exportAdminMovementsCsv = async (
  filters: MovementFilters = {},
): Promise<void> => {
  const params = new URLSearchParams();

  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.event) params.set("event", filters.event);
  if (filters.module) params.set("module", filters.module);
  if (filters.status) params.set("status", filters.status);
  if (filters.actorEmail) params.set("actorEmail", filters.actorEmail);
  if (filters.startDate) params.set("startDate", filters.startDate);
  if (filters.endDate) params.set("endDate", filters.endDate);

  const queryString = params.toString();
  const endpoint = queryString
    ? `/movements/export.csv?${queryString}`
    : "/movements/export.csv";
  const response = await apiClient.get(endpoint, { responseType: "blob" });

  const fileURL = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = fileURL;
  link.setAttribute(
    "download",
    `movements-${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(fileURL);
};
