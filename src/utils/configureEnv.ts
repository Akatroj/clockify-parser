import type { ApiConfig } from 'types/api';
import * as inquirer from '@inquirer/prompts';
import { getUserInfo } from 'api/clockifyApi';
import { stringify } from 'envfile';
import { writeFile } from 'node:fs/promises';
import dotenv from 'dotenv';

const ENVFILE_PATH = '.env';

dotenv.config({ path: ENVFILE_PATH });

const CLOCKIFY_SETTINGS_URL = 'https://app.clockify.me/user/preferences#advanced';

export async function getApiConfig(): Promise<ApiConfig> {
  const apiKey = await getApiKey();
  const [userId, workspaceId] = await getUserAndWorkspaceIds(apiKey);

  const apiConfig: ApiConfig = {
    CLOCKIFY_API_KEY: apiKey,
    USER_ID: userId,
    TEAM_WORKSPACE_ID: workspaceId,
  };

  if (!process.env.CLOCKIFY_API_KEY || !process.env.USER_ID || !process.env.TEAM_WORKSPACE_ID)
    await writeEnv(apiConfig);

  return apiConfig;
}

async function getApiKey(): Promise<string> {
  const { CLOCKIFY_API_KEY } = process.env;
  if (!CLOCKIFY_API_KEY) {
    console.log('No API key found in environment variables');
    console.log(`Get your API key from ${CLOCKIFY_SETTINGS_URL}`);

    const apiKey = await inquirer.password({
      message: 'Enter your Clockify API key: ',
      mask: '*',
      validate: value => (value ? true : 'Please enter your API key'),
    });

    return apiKey;
  }

  return CLOCKIFY_API_KEY;
}

async function getUserAndWorkspaceIds(apiKey: string): Promise<[string, string]> {
  const { USER_ID, TEAM_WORKSPACE_ID } = process.env;

  if (USER_ID && TEAM_WORKSPACE_ID) return [USER_ID, TEAM_WORKSPACE_ID];

  console.log('No user or workspace id found in environment variables');
  console.log('Fetching user info from Clockify');

  const { userId, workspaces } = await getUserInfo(apiKey);

  console.log('Your user id is:', userId);

  const workspace = await inquirer.select({
    message: 'Select your workspace: ',
    choices: workspaces.map(({ id, name, defaultWorkspace }) => ({
      name,
      value: id,
      description: defaultWorkspace ? 'This workspace is configured as your default' : '',
    })),
  });

  console.log('Your workspace id is:', workspace);

  return [userId, workspace];
}

export async function writeEnv(apiConfig: ApiConfig): Promise<void> {
  console.log('Writing configuration to .env file');
  await writeFile(ENVFILE_PATH, stringify(apiConfig));
}
