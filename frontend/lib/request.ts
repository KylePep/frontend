// lib/request.ts
import api from './api';
import { ensureCsrf } from './csrf';

export async function post<T>(url: string, data?: any) {
  await ensureCsrf();
  return api.post<T>(url, data);
}

export async function get<T>(url: string) {
  return api.get<T>(url);
}

export async function patch<T>(url: string, data?: any) {
  await ensureCsrf();
  return api.patch<T>(url, data);
}

export async function del<T>(url: string, data?: any) {
  await ensureCsrf();
  return api.delete<T>(url, { data });
}