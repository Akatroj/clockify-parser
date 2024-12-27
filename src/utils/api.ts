import type { ApiConfig } from '../types';

export function getApiConfig(): ApiConfig {
  const { CLOCKIFY_API_KEY, TEAM_WORKSPACE_ID, USER_ID } = process.env;

  if (!CLOCKIFY_API_KEY || !TEAM_WORKSPACE_ID || !USER_ID) {
    throw new Error('Missing environment variables');
  }

  return { CLOCKIFY_API_KEY, TEAM_WORKSPACE_ID, USER_ID };
}
