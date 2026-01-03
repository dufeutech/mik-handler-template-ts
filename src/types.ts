// {{PROJECT_NAME}} - Type definitions
//
// Define your request/response types here.
// These are used by handlers for type-safe JSON handling.

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUser {
  name: string;
  email: string;
}

export interface UserList {
  users: User[];
  total: number;
}

export interface ApiInfo {
  name: string;
  version: string;
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
}

export interface ErrorResponse {
  error: string;
}
