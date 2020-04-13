import { ActionInstanceColumn } from "../../../ActionCommon/src/model/ActionInstanceColumn";
import { NotificationSetting } from "../../../ActionCommon/src/model/NotificationSetting";
import { Visibility } from "@actionSDK";

export interface SurveyViewData {
    // Title
    ti: string;
    // Expiry time
    et: number;
    // Columns(questions)
    cl: string[];
    // rows visibility
    rv: number;
    // Notification settings
    ns: string;
    // Is anonymus
    ia: number;
    // Is multi response alloweed
    mr: number
}

export interface Questions {
    qe: string;
}

export enum SurveyViewDataIndices {
    TitleIndex = 0,
    IsOptionalIndex = 1,
    QuestionDisplayTypeIndex = 2,
    QuestionTypeIndex = 3,
    OptionsIndex = 4
}