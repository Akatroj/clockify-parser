export type ApiConfig = {
  CLOCKIFY_API_KEY: string;
  TEAM_WORKSPACE_ID: string;
  USER_ID: string;
};

export type WorkspaceInfo = {
  id: string;
  name: string;
  defaultWorkspace: boolean;
};

export type UserInfo = {
  userId: string;
  workspaces: WorkspaceInfo[];
};
