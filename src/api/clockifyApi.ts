import { Temporal } from '@js-temporal/polyfill';
import {
  RequestDetailedReportAmountShownEnum,
  RequestDetailedReportContainsFilterEnum,
  RequestDetailedReportExportTypeEnum,
  RequestDetailedReportTotalOptionEnum,
  RequestDetailedReportUserStatusFilterEnum,
  type RequestDetailedReportType,
  default as brokenShitLibrary,
} from 'clockify-ts';
import type { DetailedReportType } from 'clockify-ts/dist/cjs/Types/DetailedReportType';
import type { ApiConfig, UserInfo, WorkspaceInfo } from 'types/api';

// @ts-expect-error broken shit library
const Clockify = brokenShitLibrary.default as typeof brokenShitLibrary;

type ReportPayload<Format extends keyof typeof RequestDetailedReportExportTypeEnum> =
  Format extends 'json' ? DetailedReportType : string;

export async function getDetailedReport<
  Output extends keyof typeof RequestDetailedReportExportTypeEnum
>(
  from: Temporal.PlainDate,
  to: Temporal.PlainDate,
  outputFormat: Output,
  { CLOCKIFY_API_KEY, TEAM_WORKSPACE_ID, USER_ID }: ApiConfig
): Promise<ReportPayload<Output>> {
  const clockify = new Clockify(CLOCKIFY_API_KEY);

  const [dateRangeStart, dateRangeEnd] = [from, to].map(
    plainDate =>
      new Date(
        Temporal.TimeZone.from('UTC').getInstantFor!(
          plainDate.toPlainDateTime({ hour: 0 })
        ).epochMilliseconds
      )
  );

  const config: RequestDetailedReportType = {
    dateRangeStart,
    dateRangeEnd,
    exportType: RequestDetailedReportExportTypeEnum[outputFormat],
    users: {
      ids: [USER_ID],
      contains: RequestDetailedReportContainsFilterEnum.contains,
      status: RequestDetailedReportUserStatusFilterEnum.all,
    },
    detailedFilter: {
      page: 1,
      pageSize: 10,
      options: {
        totals: RequestDetailedReportTotalOptionEnum.calculate,
      },
    },
    amountShown: RequestDetailedReportAmountShownEnum.hideAmount,
  };

  const report = await clockify.workspace
    .withId(TEAM_WORKSPACE_ID)
    .reports.detailed.post(config);

  return report as ReportPayload<Output>;
}

export async function getUserInfo(CLOCKIFY_API_KEY: string): Promise<UserInfo> {
  const clockify = new Clockify(CLOCKIFY_API_KEY);

  const [user, workspaces] = await Promise.all([
    clockify.user.get(),
    clockify.workspaces.get(),
  ]);

  return {
    userId: user.id,
    workspaces: workspaces.map<WorkspaceInfo>(({ id, name }) => ({
      id,
      name,
      defaultWorkspace: user.defaultWorkspace === id,
    })),
  };
}
