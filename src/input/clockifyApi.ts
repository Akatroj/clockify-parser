import { Temporal } from '@js-temporal/polyfill';
import {
  RequestDetailedReportAmountShownEnum,
  RequestDetailedReportContainsFilterEnum,
  RequestDetailedReportTotalOptionEnum,
  RequestDetailedReportType,
  RequestDetailedReportUserStatusFilterEnum,
  default as brokenShitLibrary,
} from 'clockify-ts';

// @ts-expect-error broken shit library
const Clockify = brokenShitLibrary.default as typeof brokenShitLibrary;

const TEAM_WORKSPACE_ID = 'TEAM_WORKSPACE_ID';
const ME = 'ME_ID';

export async function getDetailedReport(from: Temporal.PlainDate, to: Temporal.PlainDate) {
  const clockify = new Clockify('API_TOKEN');

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
      ids: [ME],
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
