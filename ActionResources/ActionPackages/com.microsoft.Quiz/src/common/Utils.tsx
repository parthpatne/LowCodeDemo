import { QuestionDisplayType } from "./QuestionDisplayType";
import * as ActionSDK from "@actionSDK";
import { ProgressState, UxUtils } from "@sharedUI";
import { Text, Loader, ButtonProps } from "@stardust-ui/react";
import * as React from "react";
import { COVER_IMAGE_PROP_KEY } from "./Constants";
import getStore from '../store/creation/Store';
import { string } from "prop-types";


export const QUESTION_DIV_ID_PREFIX = "question_div_";
export const ADDQUESTIONBUTTONID = "add_question_button";

export let isQuestionValid = (question: ActionSDK.ActionInstanceColumn) => {
    if ((!question) || isEmptyOrNull(question.title))
        return false;
    if (question.type == ActionSDK.ActionInstanceColumnType.SingleOption
        || question.type == ActionSDK.ActionInstanceColumnType.MultiOption) {

        if (!question.options || question.options.length < 2) {
            return false;
        }
        for (let i = 0; i < question.options.length; i++) {
            if (isEmptyOrNull(question.options[i].title)) {
                return false;
            }
        }
    }
    return true;
}

export let isEmptyOrNull = (value: string) => {
    if (!value || value.trim().length === 0)
        return true;
    return false;
}

export let getRatingQuestionOptions = (ratingType: QuestionDisplayType) => {
    let options = [];
    let maxRatings: number = 5;
    if (ratingType == QuestionDisplayType.LikeDislike) {
        maxRatings = 2;
    } else if (ratingType == QuestionDisplayType.TenNumber ||
        ratingType == QuestionDisplayType.TenStar) {
        maxRatings = 10;
    }
    for (var i = 1; i <= maxRatings; i++) {
        let option = {
            id: i.toString(),
            title: i.toString()
        };
        options.push(option);
    }
    if (ratingType == QuestionDisplayType.LikeDislike) {
        options[0].id = "0";
        options[0].title = "Like";
        options[1].id = "1";
        options[1].title = "Dislike";
    }
    return options;
}

export let getLastSentReminderString = (lastReminderTimestamp: number): string => {
    let dueIn: {} = ActionSDK.Utils.getTimeRemaining(new Date(lastReminderTimestamp));
    let lastSentReminderString: string = "";
    if (dueIn[ActionSDK.Utils.YEARS] > 0) {
        lastSentReminderString = ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.YEARS] == 1 ? "LastSentInYear" : "LastSentInYears", dueIn[ActionSDK.Utils.YEARS]);
    }
    else if (dueIn[ActionSDK.Utils.MONTHS] > 0) {
        lastSentReminderString = ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.MONTHS] == 1 ? "LastSentInMonth" : "LastSentInMonths", dueIn[ActionSDK.Utils.MONTHS]);
    }
    else if (dueIn[ActionSDK.Utils.WEEKS] > 0) {
        lastSentReminderString = ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.WEEKS] == 1 ? "LastSentInWeek" : "LastSentInWeeks", dueIn[ActionSDK.Utils.WEEKS]);
    }
    else if (dueIn[ActionSDK.Utils.DAYS] > 0) {
        lastSentReminderString = ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.DAYS] == 1 ? "LastSentInDay" : "LastSentInDays", dueIn[ActionSDK.Utils.DAYS]);
    }
    else if (dueIn[ActionSDK.Utils.HOURS] > 0 && dueIn[ActionSDK.Utils.MINUTES] > 0) {
        if (dueIn[ActionSDK.Utils.HOURS] == 1 && dueIn[ActionSDK.Utils.MINUTES] == 1) {
            lastSentReminderString = ActionSDK.Localizer.getString("LastSentInHourAndMinute", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]);
        } else if (dueIn[ActionSDK.Utils.HOURS] == 1) {
            lastSentReminderString = ActionSDK.Localizer.getString("LastSentInHourAndMinutes", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]);
        } else if (dueIn[ActionSDK.Utils.MINUTES] == 1) {
            lastSentReminderString = ActionSDK.Localizer.getString("LastSentInHoursAndMinute", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]);
        } else {
            lastSentReminderString = ActionSDK.Localizer.getString("LastSentInHoursAndMinutes", dueIn[ActionSDK.Utils.HOURS], dueIn[ActionSDK.Utils.MINUTES]);
        }
    }
    else if (dueIn[ActionSDK.Utils.HOURS] > 0) {
        lastSentReminderString = ActionSDK.Localizer.getString(dueIn[ActionSDK.Utils.HOURS] == 1 ? "LastSentInHour" : "LastSentInHours", dueIn[ActionSDK.Utils.HOURS]);
    }
    else if (dueIn[ActionSDK.Utils.MINUTES] > 0) {
        lastSentReminderString = ActionSDK.Localizer.getString(dueIn["minutes"] == 1 ? "LastSentInMinute" : "LastSentInMinutes", dueIn[ActionSDK.Utils.MINUTES]);
    } else {
        lastSentReminderString = ActionSDK.Localizer.getString("SendReminderComplete");
    }
    return lastSentReminderString;
}

export function fetchMyResponses(context: ActionSDK.ActionContext, pageSize: number = 100, rows: ActionSDK.ActionInstanceRow[] = [], continuationToken: string = null): Promise<ActionSDK.ActionInstanceRow[]> {
    return new Promise<ActionSDK.ActionInstanceRow[]>((resolve, reject) => {
        ActionSDK.APIs.getActionInstanceRows(context.actionInstanceId, "self", continuationToken, pageSize)
            .then((actionInstanceRowsFetchResult: ActionSDK.ActionInstanceRowsFetchResult) => {
                rows = [...rows, ...actionInstanceRowsFetchResult.rows];
                if (actionInstanceRowsFetchResult.continuationToken) {
                    fetchMyResponses(context, pageSize, rows, actionInstanceRowsFetchResult.continuationToken)
                        .then((response) => { resolve(response); })
                        .catch((error) => { reject(error); });
                } else {
                    resolve(rows);
                }
            })
            .catch((error) => { reject(error); });
    });
}

export function getSendReminderButtonProgressView(lastReminderTimestamp: number, reminderProgressState: ProgressState, shouldShowLoader: boolean) {
    if (reminderProgressState == ProgressState.Completed) {
        return (<Text size="smaller" content={ActionSDK.Localizer.getString("SendReminderComplete")} />);
    } else if (reminderProgressState == ProgressState.Failed) {
        return (<Text size="smaller" content={ActionSDK.Localizer.getString("SendReminderFailed")} />);
    } else if (reminderProgressState == ProgressState.InProgress) {
        return (shouldShowLoader ? <Loader size="small" /> : null);
    } else {
        return (lastReminderTimestamp ?
            <Text size="smaller" content={getLastSentReminderString(lastReminderTimestamp)} />
            : null);
    }
}

export function getCoverImage(actionInstance: ActionSDK.ActionInstance): ActionSDK.Attachment {
    if (actionInstance.properties) {
        for (const property of actionInstance.properties)
            if (property.name === COVER_IMAGE_PROP_KEY) {
                const imageJson = property.value;
                const imageList = ActionSDK.Utils.parseJson(imageJson);
                return imageList[0];
            }
    }
    return undefined;
}

export function getGeneralChannelIdForGroup(teamsId: string, teamsGroups: ActionSDK.TeamsGroup[]): string {
    for (let listInstance of teamsGroups) {
        if (listInstance.id == teamsId) {
            for (let channel of listInstance.channelList) {
                if (channel.dispNm == "General") {
                    return channel.id;
                }
            }
        }
    }
    return "";
}

export function areAllQuestionsOptional(questions: ActionSDK.ActionInstanceColumn[]): boolean {
    for (let i = 0; i < questions.length; i++) {
        if (!questions[i].isOptional) {
            return false;
        }
    }
    return true;
}

export function getFirstInvalidQuestionIndex(questions: ActionSDK.ActionInstanceColumn[]): number {
    for (let i = 0; i < questions.length; i++) {
        if (!isQuestionValid(questions[i])) {
            return i;
        }
    }
    return -1;
}

export function countErrorsPresent(surveyTitle: string, firstInvalidQuestionIndex: number, questions: ActionSDK.ActionInstanceColumn[]): number {
    let numErrors = 0;
    if (isEmptyOrNull(surveyTitle)) {
        numErrors++;
    }
    if (firstInvalidQuestionIndex === -1) {
        return numErrors;
    }
    for (let i = firstInvalidQuestionIndex; i < questions.length; i++) {
        let question = questions[i];
        if (isEmptyOrNull(question.title)) {
            numErrors++;
        }
        if (question.type == ActionSDK.ActionInstanceColumnType.SingleOption
            || question.type == ActionSDK.ActionInstanceColumnType.MultiOption) {
            for (let i = 0; i < question.options.length; i++) {
                if (isEmptyOrNull(question.options[i].title)) {
                    numErrors++;
                }
            }
        }
    }
    return numErrors;
}

export function isValidResponse(response: any, isOptional: boolean, columnType: ActionSDK.ActionInstanceColumnType): boolean {
    switch (columnType) {
        case ActionSDK.ActionInstanceColumnType.MultiOption:
            return isOptional || (!ActionSDK.Utils.isEmptyObject(response) && JSON.parse(response).length > 0)
        case ActionSDK.ActionInstanceColumnType.Numeric:
            if (isInvalidNumericPattern(response))
                return false;
            return isOptional || !ActionSDK.Utils.isEmptyObject(response);
        default:
            return isOptional || !ActionSDK.Utils.isEmptyObject(response);
    }
}

export function isInvalidNumericPattern(response: any): boolean {
    return !ActionSDK.Utils.isEmptyObject(response) && isNaN(parseFloat(response));
}

export function getDialogButtonProps(dialogDescription: string, buttonLabel: string): ButtonProps {
    let buttonProps: ButtonProps = {
        "content": buttonLabel
    }

    if (UxUtils.renderingForMobile()) {
        Object.assign(buttonProps, {
            "aria-label": ActionSDK.Localizer.getString("DialogTalkback", dialogDescription, buttonLabel),
        });
    }
    return buttonProps;
}