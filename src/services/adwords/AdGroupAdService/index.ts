import { pd } from 'pretty-data';

import { SoapService, AdwordsOperartionService } from '../../core';
import { ISelector, Predicate, IPaging, Operator } from '../../../types/adwords';
import * as Ad from '../../../types/adwords/Ad';
import { IAdGroupAdReturnValue } from './AdGroupAdReturnValue';
import { IAdGroupAdOperation } from './AdGroupAdOperation';
import { IAdGroupAdPage } from './AdGroupAdPage';
import { IAdGroupAd } from './AdGroupAd';
import _ from 'lodash';
import { IExpandedTextAd, IResponsiveDisplayAd } from './Ad';

interface IAdGroupAdServiceOpts {
  soapService: SoapService;
}

class AdGroupAdService extends AdwordsOperartionService {
  // TODO: better type guard
  public static isExpandedTextAd(ad: Partial<IExpandedTextAd | IResponsiveDisplayAd>): ad is IExpandedTextAd {
    return _.every(['headlinePart1', 'description'], (prop) => prop in ad);
  }
  public static isResponsiveDisplayAd(ad: Partial<IExpandedTextAd | IResponsiveDisplayAd>): ad is IResponsiveDisplayAd {
    return _.every(['dynamicDisplayAdSettings', 'shortHeadline'], (prop) => prop in ad);
  }

  public static setType(operand: IAdGroupAd) {
    if (AdGroupAdService.isExpandedTextAd(operand.ad)) {
      operand.ad.attributes = { 'xsi:type': 'ExpandedTextAd' };
    } else if (AdGroupAdService.isResponsiveDisplayAd(operand.ad)) {
      operand.ad.attributes = { 'xsi:type': 'ResponsiveDisplayAd' };
    }
    return operand;
  }
  /**
   * https://developers.google.com/adwords/api/docs/appendix/selectorfields#v201809-AdGroupAdService
   *
   * @private
   * @static
   * @memberof AdGroupAdService
   */
  private static readonly selectorFields = [
    'AccentColor',
    'AdGroupId',
    'AdStrengthInfo',
    'AdType',
    'AdvertisingId',
    'AllowFlexibleColor',
    'Automated',
    'BaseAdGroupId',
    'BaseCampaignId',
    'BusinessName',
    'CallOnlyAdBusinessName',
    'CallOnlyAdCallTracked',
    'CallOnlyAdConversionTypeId',
    'CallOnlyAdCountryCode',
    'CallOnlyAdDescription1',
    'CallOnlyAdDescription2',
    'CallOnlyAdDisableCallConversion',
    'CallOnlyAdPhoneNumber',
    'CallOnlyAdPhoneNumberVerificationUrl',
    'CallToActionText',
    'CreationTime',
    'CreativeFinalAppUrls',
    'CreativeFinalMobileUrls',
    'CreativeFinalUrlSuffix',
    'CreativeFinalUrls',
    'CreativeTrackingUrlTemplate',
    'CreativeUrlCustomParameters',
    'Description',
    'Description1',
    'Description2',
    'DevicePreference',
    'Dimensions',
    'DisplayUploadAdGmailTeaserBusinessName',
    'DisplayUploadAdGmailTeaserDescription',
    'DisplayUploadAdGmailTeaserHeadline',
    'DisplayUploadAdGmailTeaserLogoImage',
    'DisplayUrl',
    'ExpandedDynamicSearchCreativeDescription2',
    'ExpandedTextAdDescription2',
    'ExpandedTextAdHeadlinePart3',
    'ExpandingDirections',
    'FileSize',
    'FormatSetting',
    'GmailHeaderImage',
    'GmailMarketingImage',
    'GmailTeaserBusinessName',
    'GmailTeaserDescription',
    'GmailTeaserHeadline',
    'GmailTeaserLogoImage',
    'Headline',
    'HeadlinePart1',
    'HeadlinePart2',
    'Height',
    'Id',
    'ImageCreativeName',
    'IndustryStandardCommercialIdentifier',
    'IsCookieTargeted',
    'IsTagged',
    'IsUserInterestTargeted',
    'Labels',
    'LandscapeLogoImage',
    'LogoImage',
    'LongHeadline',
    'MainColor',
    'MarketingImage',
    'MarketingImageCallToActionText',
    'MarketingImageCallToActionTextColor',
    'MarketingImageDescription',
    'MarketingImageHeadline',
    'MediaId',
    'MimeType',
    'MultiAssetResponsiveDisplayAdAccentColor',
    'MultiAssetResponsiveDisplayAdAllowFlexibleColor',
    'MultiAssetResponsiveDisplayAdBusinessName',
    'MultiAssetResponsiveDisplayAdCallToActionText',
    'MultiAssetResponsiveDisplayAdDescriptions',
    'MultiAssetResponsiveDisplayAdDynamicSettingsPricePrefix',
    'MultiAssetResponsiveDisplayAdDynamicSettingsPromoText',
    'MultiAssetResponsiveDisplayAdFormatSetting',
    'MultiAssetResponsiveDisplayAdHeadlines',
    'MultiAssetResponsiveDisplayAdLandscapeLogoImages',
    'MultiAssetResponsiveDisplayAdLogoImages',
    'MultiAssetResponsiveDisplayAdLongHeadline',
    'MultiAssetResponsiveDisplayAdMainColor',
    'MultiAssetResponsiveDisplayAdMarketingImages',
    'MultiAssetResponsiveDisplayAdSquareMarketingImages',
    'MultiAssetResponsiveDisplayAdYouTubeVideos',
    'Path1',
    'Path2',
    'PolicySummary',
    'PricePrefix',
    'ProductImages',
    'ProductVideoList',
    'PromoText',
    'ReadyToPlayOnTheWeb',
    'ReferenceId',
    'ResponsiveSearchAdDescriptions',
    'ResponsiveSearchAdHeadlines',
    'ResponsiveSearchAdPath1',
    'ResponsiveSearchAdPath2',
    'RichMediaAdCertifiedVendorFormatId',
    'RichMediaAdDuration',
    'RichMediaAdImpressionBeaconUrl',
    'RichMediaAdName',
    'RichMediaAdSnippet',
    'RichMediaAdSourceUrl',
    'RichMediaAdType',
    'ShortHeadline',
    'SourceUrl',
    'SquareMarketingImage',
    'Status',
    'SystemManagedEntitySource',
    'TemplateAdDuration',
    'TemplateAdName',
    'TemplateAdUnionId',
    'TemplateElementFieldName',
    'TemplateElementFieldText',
    'TemplateElementFieldType',
    'TemplateId',
    'TemplateOriginAdId',
    'UniqueName',
    'UniversalAppAdDescriptions',
    'UniversalAppAdHeadlines',
    'UniversalAppAdHtml5MediaBundles',
    'UniversalAppAdImages',
    'UniversalAppAdMandatoryAdText',
    'UniversalAppAdYouTubeVideos',
    'Url',
    'UrlData',
    'Urls',
    'VideoTypes',
    'Width',
    'YouTubeVideoIdString',
  ];

  private soapService: SoapService;
  constructor(options: IAdGroupAdServiceOpts) {
    super();
    this.soapService = options.soapService;
  }

  public async getAll() {
    const serviceSelector: ISelector = {
      fields: AdGroupAdService.selectorFields,
    };
    return this.get(serviceSelector);
  }

  public async getAllMultiAssetResponsiveDisplayAd() {
    const serviceSelector: ISelector = {
      fields: AdGroupAdService.selectorFields,
      predicates: [
        {
          field: 'AdType',
          operator: Predicate.Operator.IN,
          values: [Ad.Type.MULTI_ASSET_RESPONSIVE_DISPLAY_AD],
        },
      ],
    };
    return this.get(serviceSelector);
  }

  public async getAllExpandedTextAd(paging?: IPaging) {
    const serviceSelector: ISelector = {
      fields: AdGroupAdService.selectorFields,
      predicates: [
        {
          field: 'AdType',
          operator: Predicate.Operator.IN,
          values: [Ad.Type.EXPANDED_TEXT_AD],
        },
      ],
    };
    if (paging) {
      serviceSelector.paging = paging;
    }
    return this.get(serviceSelector);
  }

  public async getByAdGroupIds(adGroupIds: string[]) {
    const serviceSelector: ISelector = {
      fields: AdGroupAdService.selectorFields,
      predicates: [
        {
          field: 'AdGroupId',
          operator: Predicate.Operator.IN,
          values: adGroupIds,
        },
      ],
    };
    return this.get(serviceSelector);
  }

  /**
   * add ad group ad.
   *
   * 当调用 mutate() 时，最好每个请求发送多个操作；避免发送多个请求，而每个请求仅包含一个操作。每个请求发送多个操作可减少到服务器的往返次数，并提高应用性能。
   *
   * @author dulin
   * @param {IAdGroupAd[]} adGroupAds
   * @returns
   * @memberof AdGroupAdService
   */
  public add(adGroupAds: IAdGroupAd[]) {
    const operations: IAdGroupAdOperation[] = adGroupAds.map((adGroupAd: IAdGroupAd) => {
      const operation: IAdGroupAdOperation = {
        operator: Operator.ADD,
        operand: AdGroupAdService.setType(adGroupAd),
      };
      return operation;
    });
    return this.mutate(operations);
  }

  public update(adGroupAds: IAdGroupAd[]) {
    const operations: IAdGroupAdOperation[] = adGroupAds.map((adGroupAd: IAdGroupAd) => {
      const operation: IAdGroupAdOperation = {
        operator: Operator.SET,
        operand: adGroupAd,
      };
      return operation;
    });
    return this.mutate(operations);
  }

  protected async get<ServiceSelector = ISelector, Rval = IAdGroupAdPage>(
    serviceSelector: ServiceSelector,
  ): Promise<Rval | undefined> {
    return this.soapService.get<ServiceSelector, Rval>(serviceSelector).then((rval) => {
      return rval;
    });
  }

  protected async mutate<Operation = IAdGroupAdOperation, Rval = IAdGroupAdReturnValue>(
    operations: Operation[],
  ): Promise<Rval | undefined> {
    return this.soapService
      .mutateAsync<Operation, Rval>(operations, /** operationType = */ 'AdGroupAdOperation')
      .then((rval) => {
        return rval;
      });
  }
}

export { AdGroupAdService };
export * from './Ad';
export * from './AdGroupAd';
export * from './AdGroupAdOperation';
export * from './AdGroupAdPage';
export * from './AdGroupAdPolicySummary';
export * from './AdGroupAdReturnValue';
export * from './CustomParameter';
export * from './CustomParameters';
export * from './Dimensions';
export * from './DynamicSettings';
export * from './ExemptionRequest';
export * from './Label';
export * from './LabelAttribute';
export * from './Media';
export * from './Media_Size_DimensionsMapEntry';
export * from './Media_Size_StringMapEntry';
// export * from './PolicyTopicEntry';
export * from './PolicyViolationKey';
export * from './UrlData';
export * from './UrlList';
export * from './enum/Ad';
export * from './enum/AdGroupAd';
export * from './enum/DisplayAdFormatSetting';
export * from './enum/Media';
export * from './enum/SystemManagedEntitySource';
