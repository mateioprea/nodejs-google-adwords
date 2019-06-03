import { pd } from 'pretty-data';
import { adwordsService } from '../../../initialize';
import { IReportDefinition } from '../../../../services/adwords/ReportDefinitionService/ReportDefinition';
import { ReportDefinition } from '../../../../services/adwords/ReportDefinitionService';
import { ISelector, Predicate } from '../../../../types/adwords';
import { CampaignPerformanceReportService } from '../../../../services/adwords/Reports';

describe('CampaignPerformanceReportService test suites', () => {
  const campaignPerformanceReportService = adwordsService.getService('CampaignPerformanceReportService', {
    verbose: true,
  });
  it('#reportDownload - all time', async () => {
    const actualvalue = await campaignPerformanceReportService.get({});
    console.log(pd.xml(actualvalue));
  });

  it.skip('#reportDownload - with predicates', async () => {
    const selector: ISelector = {
      fields: [
        'CampaignId',
        'CampaignName',
        'CampaignStatus',
        'StartDate',
        'EndDate',
        'Clicks',
        'Conversions',
        'Ctr',
        'Cost',
        'Impressions',
        'ConversionRate',
        'AverageCpc',
      ],
      predicates: [
        {
          field: 'CampaignId',
          operator: Predicate.Operator.IN,
          values: ['1532562169'],
        },
      ],
    };
    const reportDefinition: Partial<IReportDefinition> = { selector };
    const actualvalue = await campaignPerformanceReportService.get(reportDefinition);
    console.log(pd.xml(actualvalue));
  });

  it.skip('#reportDownload - yesterday', async () => {
    const reportDefinition: Partial<IReportDefinition> = { dateRangeType: ReportDefinition.DateRangeType.YESTERDAY };
    const actualvalue = await campaignPerformanceReportService.get(reportDefinition);
    console.log(pd.xml(actualvalue));
  });
});
