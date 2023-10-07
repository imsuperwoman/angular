import { createSelector, Selector } from '@ngxs/store';
import { GENERAL_STATE_MODEL } from './general.model';
import { GeneralState } from './general.state';


export class GeneralSelectors {
    public static selectLov(type: string) {
        return createSelector([GeneralState], (state: GENERAL_STATE_MODEL) => {
            const lovList = state.lov.find((item: any) => item.LovType == type);
            return lovList?.LovList;
        });
    }

    public static selectLovWithBlank(type: string) {
        return createSelector([GeneralState], (state: GENERAL_STATE_MODEL) => {
            const lovList = state.lov.find((item: any) => item.LovType == type);
            var list: { Code?: string; Description?: string; }[] = []
            list.push({ Code: '', Description: '' });
            lovList?.LovList.find((item: any) => {
                list.push({ Code: item.Code, Description: item.Description });
            })
            return list;
        });
    }

    public static selectBankWithOther(type: string) {
        return createSelector([GeneralState], (state: GENERAL_STATE_MODEL) => {
            const lovList = state.lov.find((item: any) => item.LovType == type);
            var list: { Code?: string; Description?: string; }[] = []
            lovList?.LovList.find((item: any) => {
                list.push({ Code: item.Code, Description: item.Description });
            })
            list.push({ Code: "other", Description: "--OTHER--" });
            return list;
        });
    }

    @Selector([GeneralState])
    public static productConfig(state: GENERAL_STATE_MODEL) {
        return state.productConfig;
    }

    @Selector([GeneralState])
    public static underWritingConfig(state: GENERAL_STATE_MODEL) {
        return state.underwritingConfig;
    }

    @Selector([GeneralState])
    public static questions(state: GENERAL_STATE_MODEL) {
        return state.underwritingConfig.questions[0];
    }

    @Selector([GeneralState])
    static sourceSystem(state: GENERAL_STATE_MODEL) {
        return state.sourceSystem;
    }

    @Selector([GeneralState])
    static dynamicContent(state: GENERAL_STATE_MODEL) {
        return state.dynamicContent;
    }

    @Selector([GeneralState])
    public static customViewObj(state: GENERAL_STATE_MODEL) {
        return state.customViewObj;
    }

    @Selector([GeneralState])
    public static postCode(state: GENERAL_STATE_MODEL) {
        return state.postcodeList;
    }

    @Selector([GeneralState])
    public static flowType(state: GENERAL_STATE_MODEL) {
        return state.flowType;
    }

    @Selector([GeneralState])
    public static utmSource(state: GENERAL_STATE_MODEL) {
        return state.customViewObj?.utm_source;
    }
}