import { FOOTER_MENU_ITEM } from '../../constants/footer-constants';
import { HEADER_MENU, MENU_ITEM } from '../../constants/header-constants';
import { PRODUCT_CONFIG } from './general.class';

export const DEFAULTS: GENERAL_STATE_MODEL = {
  access_token: '',
  agentDetails: '',
  agentLocator: '',
  customViewObj: '',
  dynamicContent: '',
  lov: '',
  menuData: HEADER_MENU,
  productConfig: new PRODUCT_CONFIG(),
  postcodeList: '',
  sourceSystem: '',
  underwritingConfig: '',
  footerMenuData: [],
  flowType: ''
}

export const DEFAULTS_HEADER = {
  Header: {
    workingTime: "Mon - Fri : 8AM - 8PM",
    tel: "1 300 22 5542",
  },
  Logo: ''
}

export interface GENERAL_STATE_MODEL {
  flowType: any;
  access_token: any;
  agentDetails: any;
  agentLocator: any;
  customViewObj: any;
  dynamicContent: any;
  footerMenuData: FOOTER_MENU_ITEM[],
  menuData: MENU_ITEM[],
  lov: any;
  productConfig: any;
  PRODUCT_CAT?: any;
  postcodeList: any;
  sourceSystem: any;
  underwritingConfig: any;
}

export interface HEADER {
  contents: any;
  tel: string;
  workingTime: string;
  cutoffDate: string;
  policyDateConfig: any;
  ageRangeConfig: any;
  parentGuardianEnabled: string;
}