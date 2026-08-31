const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
const PREFIX = '/api/v1';

class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${PREFIX}${path}`);
  const json = await res.json();

  if (json.code !== 'SUCCESS') {
    throw new ApiError(json.code, json.message);
  }
  return json.data;
}
