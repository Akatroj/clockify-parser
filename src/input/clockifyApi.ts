import { Temporal } from '@js-temporal/polyfill';
import {
  RequestDetailedReportAmountShownEnum,
  RequestDetailedReportContainsFilterEnum,
  RequestDetailedReportTotalOptionEnum,
  RequestDetailedReportType,
  RequestDetailedReportUserStatusFilterEnum,
  default as brokenShitLibrary,
} from 'clockify-ts';
import { getApiConfig } from '../utils';

// @ts-expect-error broken shit library
const Clockify = brokenShitLibrary.default as typeof brokenShitLibrary;

export async function getDetailedReport(from: Temporal.PlainDate, to: Temporal.PlainDate) {
  const { CLOCKIFY_API_KEY, TEAM_WORKSPACE_ID, USER_ID } = getApiConfig();

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
  console.log(JSON.stringify(config));

  const dupa = await clockify.workspace
    .withId(TEAM_WORKSPACE_ID)
    .reports.detailed.post(config);

  console.log(
    dupa.timeentries.map(({ description, timeInterval }) => ({ description, timeInterval }))
  );
}
