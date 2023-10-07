import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { map } from 'rxjs/operators';
import {
  GET_DYNAMIC_CONTENT, GET_CUSTOM_VIEW_OBJECT, GET_ACCESS_TOKEN, GET_POSTAL_CODES,
  GET_LOV, GET_UNDERWRITING, GET_PRODUCT_CONFIG, GET_AGENT_DETAIL, GET_AGENT_LOCATOR, POST_CONTACT_AGENT, POST_REFERRED_RISK, GET_SOURCE_SYSTEM, GET_PRODUCT_CONFIG_PARAM
} from './general.action';
import { GeneralService } from './general.service';
import { HEADER_MENU, MENU_ITEM } from '../../constants/header-constants';
import * as brandingPartners from '../../constants/partner.static-data';
import { FOOTER_MENU_LINK, FOOTER_MENU_ITEM } from '../../constants/footer-constants';
import { DEFAULTS, DEFAULTS_HEADER, GENERAL_STATE_MODEL } from './general.model';
import extractQueryParamsFunction from '@functions/extract-query-params.function';


@State<GENERAL_STATE_MODEL>({
  name: 'GeneralState',
  defaults: DEFAULTS,
})

@Injectable()
export class GeneralState implements NgxsOnInit {

  partners: any = brandingPartners.default;

  constructor(
    public generalService: GeneralService
  ) { }

  ngxsOnInit(ctx?: StateContext<GeneralState>) {
    const queries = extractQueryParamsFunction(window.location.search);
    ctx?.dispatch(new GET_CUSTOM_VIEW_OBJECT(queries))
  }

  @Action(GET_ACCESS_TOKEN)
  public getAccessToken({ patchState }: StateContext<GENERAL_STATE_MODEL>) {
    return this.generalService.postAccessToken().pipe(
      map((res: any) => {
        return patchState({
          access_token: res.access_token,
        });
      })
    );
  }

  @Action(GET_LOV)
  public getLOV({ patchState, getState }: StateContext<GENERAL_STATE_MODEL>, { PRODUCT_CAT, PARAMETERS }: GET_LOV) {

    const state = getState();
    const payload = {
      SourceSystem: state.sourceSystem ? state.sourceSystem : 'AZOL',
      ProductCat: PRODUCT_CAT,
      LovTypeList: PARAMETERS
    };
    return this.generalService.postLOV(payload).pipe(
      map((res) => {
        patchState({
          lov: res,
        });
      })
    );
  }

  @Action(GET_POSTAL_CODES)
  public getPostCodes({ patchState }: StateContext<GENERAL_STATE_MODEL>) {
    const payload = {
      PostCode: "",
    };
    return this.generalService.postPostCodes(payload).pipe(
      map((res: any) => {
        let data = [];
        if (res.hasOwnProperty('PostcodeList')) {
          data = res['PostcodeList'];
        }
        patchState({
          postcodeList: data,
        })
      })
    )
  }

  @Action(GET_PRODUCT_CONFIG)
  public postProductConfig({ patchState, getState, dispatch }: StateContext<GENERAL_STATE_MODEL>, { PRODUCT_CAT }: GET_PRODUCT_CONFIG) {
    const state = getState();

    const payload = {
      ProductCat: PRODUCT_CAT,
      SourceSystem: state.customViewObj.p_channel ? state.customViewObj.p_channel : state.customViewObj.utm_source
        ? state.customViewObj.utm_source : 'AZOL',
    };

    if (state.productConfig.nonStaffSourceSystem) {
      payload['SourceSystem'] = state.productConfig.nonStaffSourceSystem;
    }

    return this.generalService.postProductConfig(payload).pipe(
      map((res: any) => {
        if (res && res.AgentCode) {
          dispatch(new GET_AGENT_DETAIL(res.AgentCode));
        }

        patchState({
          productConfig: res,
          PRODUCT_CAT: PRODUCT_CAT
        });
      })
    );
  }

  @Action(GET_PRODUCT_CONFIG_PARAM)
  public postProductConfigParam({ patchState, dispatch }: StateContext<GENERAL_STATE_MODEL>,
    { PRODUCT_CAT, SOURCE_SYSTEM }: GET_PRODUCT_CONFIG_PARAM) {

    const payload = {
      ProductCat: PRODUCT_CAT,
      SourceSystem: SOURCE_SYSTEM
    };

    return this.generalService.postProductConfig(payload).pipe(
      map((res: any) => {
        if (res && res.AgentCode) {
          dispatch(new GET_AGENT_DETAIL(res.AgentCode));
        }

        patchState({
          productConfig: res,
          PRODUCT_CAT: PRODUCT_CAT
        });
      })
    );
  }

  @Action(GET_AGENT_DETAIL)
  public getAgentDetail({ patchState }: StateContext<GENERAL_STATE_MODEL>, { payload }: GET_AGENT_DETAIL) {
    return this.generalService.postAgentDetails({ AgentCode: payload }).pipe(
      map((res) => {
        patchState({
          agentDetails: res,
        });
      })
    );
  }

  @Action(GET_AGENT_LOCATOR)
  public getAgentLocator({ patchState }: StateContext<GENERAL_STATE_MODEL>, { payload }: GET_AGENT_LOCATOR) {
    const newPayload = {
      "LifeInd": false, "GeneralInd": true, "AgentType": ["Allianz Agents"],
      "Latitude": payload?.latitude, "Longitude": payload?.longitude, "Distance": 10
    };

    return this.generalService.postAgentLocator(newPayload).pipe(
      map((res) => {
        patchState({
          agentLocator: res,
        });
      })
    );
  }

  @Action(POST_CONTACT_AGENT)
  public postContactAgent({ patchState }: StateContext<GENERAL_STATE_MODEL>, { payload }: POST_CONTACT_AGENT) {

    return this.generalService.postContactAgent(payload).pipe(
      map((resContactAgent) => {
        patchState({
          agentLocator: resContactAgent,
        });
      })
    );
  }

  @Action(POST_REFERRED_RISK)
  public postReferredRisk({ patchState }: StateContext<GENERAL_STATE_MODEL>, { payload, productCode }: POST_REFERRED_RISK) {

    return this.generalService.postReferredRisk(payload, productCode).pipe(
      map((resReferredRisk) => {
        patchState({
          agentLocator: resReferredRisk,
        });
      })
    );
  }

  @Action(GET_UNDERWRITING)
  public getUnderwriting({ patchState, getState }: StateContext<GENERAL_STATE_MODEL>, { PRODUCT_CAT, QUESTION_TYPE }: GET_UNDERWRITING) {

    const payload = {
      QuestionType: QUESTION_TYPE,
      SourceSystem: PRODUCT_CAT,
    };

    return this.generalService.postUnderwriting(payload).pipe(
      map((res) => {
        patchState({
          underwritingConfig: res,
        });
      })
    );
  }

  @Action(GET_CUSTOM_VIEW_OBJECT)
  public getCustomViewObject({ patchState }: any, { payload }: GET_CUSTOM_VIEW_OBJECT) {

    let sourceSystem = payload.utm_source !== undefined ? payload.utm_source : 'AZOL';

    patchState({
      customViewObj: payload,
      sourceSystem,
    });
  }

  @Action(GET_DYNAMIC_CONTENT)
  public getDynamicContent({ patchState, getState }: any) {
    const state = getState();

    var menuData = HEADER_MENU;
    var footerMenuData = FOOTER_MENU_LINK;

    if (state.customViewObj.utm_source) {
      this.partners = this.partners.filter((partner: any) => {
        return partner.partner === state.customViewObj.utm_source;
      });
    } else {
      this.partners = {};
    }

    var sourceSystem = state.sourceSystem;

    if (sourceSystem === "SCOL") {
      if (state.customViewObj.p_channel) {
        sourceSystem = state.customViewObj.p_channel;
      }
    }

    return this.generalService
      .getDynamicContent(sourceSystem)
      .pipe(
        map((res: any) => {

          const result = res['Result'];

          if (!result || isText(result)) {
            return {
              PartnerCode: null,
              menuData: menuData,
              footerMenuData: footerMenuData
            };
          }
          const Header = JSON.parse(result['Header']);
          return {
            ...result,
            Header,
          };
        })
      )
      .pipe(
        map((res) => {
          if (res?.PartnerCode === null) {
            res = DEFAULTS_HEADER
          }
          if (res?.Logo === undefined) {
            res.Logo = ''
          }

          if (res.Header.agent !== undefined) {
            res.Header.name = "<strong>" + res.Header.name + "</strong>&nbsp;&nbsp;|  " + "Agent Code  :  " + res.Header.agent;
          } else if (res?.PartnerCode === "STAFFR") {
            res.Header.name = '';
          } else {
            if (state.productConfig.SourceSystemCat == "AGOL") {
              if (res.Header.name !== undefined) {
                res.Header.name = "<p>Distributed By :  <strong>" + res.Header.name + "</strong></p>"
              }
            }
          }

          if (state.productConfig?.AgentPhoneNo) {
            res.Header.tel = null
          }

          //handle footer url
          if (this.partners[0]?.footerUrl !== undefined && this.partners[0]?.footerUrl.length != 0) {
            footerMenuData = [];
            this.partners[0].footerUrl.forEach((data: any) => {
              let footerMenuItem = {} as FOOTER_MENU_ITEM;
              footerMenuItem.label = data.label;
              footerMenuItem.queryParams = data.queryParams;
              footerMenuData.push(footerMenuItem);
            });
          }

          // setFlowType
          var flowType;
          if (state.sourceSystem === 'AZOL') {
            flowType = 'DIRECT';
          }
          if (state.sourceSystem === 'AZOL' && state.productConfig.SourceSystemCat === 'RFOL') {
            flowType = 'DIRECT';
          } else if (state.sourceSystem !== 'AZOL' && state.productConfig.SourceSystemCat === 'RFOL') {
            if (state.sourceSystem === "STAFFR") {
              flowType = 'STAFFR';
            } else {
              flowType = 'REFERRAL';
            }
          } else if (state.productConfig.SourceSystemCat === 'AGOL') {
            if (state.sourceSystem === 'HSBCBN') {
              flowType = 'BANK';
            } else {
              flowType = 'AGENT';
            }
          } else if (state.productConfig.SourceSystemCat === 'BAOL') {
            if (state.customViewObj.p_channel === "SCSTAFF") {
              flowType = 'STAFFR';
            } else {
              flowType = 'BANK';
            }
          }


          //handle menu item
          if (res.Header.links !== undefined && res.Header.links.length != 0) {
            menuData = [];
            res.Header.links.forEach((data: any) => {
              let menuItem = {} as MENU_ITEM;
              menuItem.label = data.name;
              menuItem.queryParams = this.partners[0]?.menuUrl + data.url + "?" + new URLSearchParams(window.location.search);
              menuItem.target = "_blank";
              menuData.push(menuItem);
            });
          } else if (this.partners[0]?.menubar !== undefined && this.partners[0]?.menubar.length != 0) {
            menuData = [];
            this.partners[0].menubar.forEach((data: any) => {
              let menuItem = {} as MENU_ITEM;
              menuItem.label = data.label;
              menuItem.queryParams = data.queryParams;
              menuData.push(menuItem);
            });
          }
          else if (flowType == 'DIRECT') {
            menuData = HEADER_MENU;
          } else {
            menuData = []
          }

          return patchState({
            dynamicContent: res,
            menuData: menuData,
            footerMenuData: footerMenuData,
            flowType: flowType
          });
        })
      );
  }

  @Action(GET_SOURCE_SYSTEM)
  public getSourceSystem({ patchState }: StateContext<GENERAL_STATE_MODEL>, { payload }: GET_SOURCE_SYSTEM) {

    return patchState({
      sourceSystem: payload,
    });

  }
}

function isText(data: any): data is string {
  return typeof data === 'string';
}


function getLogo(logo: string) {
  return '/partner_logos/' + logo;
}