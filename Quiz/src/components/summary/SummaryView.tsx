import * as React from "react";
import { observer } from "mobx-react";
import getStore, { SummaryPageViewType, ResponsesListViewType } from "../../store/summary/Store";
import * as ReactDOM from "react-dom";
import "../../css/Summary.scss";
import { closeSurvey, surveyCloseAlertOpen, updateDueDate, surveyExpiryChangeAlertOpen, setDueDate, surveyDeleteAlertOpen, deleteSurvey, setCurrentView, downloadCSV, setProgressStatus, addLog, setResponseViewType, showResponseView, actionInstanceSendReminder } from "../../actions/SummaryActions";
import { BarChartComponent, AdaptiveMenu, AdaptiveMenuItem, DateTimePickerView, UxUtils, ProgressState, IBarChartItem, AdaptiveMenuRenderStyle, Constants, ErrorView } from "@sharedUI"
import { Flex, Divider, Dialog, Loader, Text, Avatar, Icon, Button, ButtonProps } from "@stardust-ui/react";
import * as ActionSDK from "@actionSDK";
import { ResponseAggregationContainer } from "./ResponseAggregationContainer";
import * as html2canvas from "html2canvas";
import { IButtonProps } from "SharedUI/src/Button/ButtonComponent";
import { initializeMyResponsesWithProfile } from "../../actions/MyResponsesActions";
import { permissionErrorImage } from "../../../images";
import { getCoverImage, getSendReminderButtonProgressView, getDialogButtonProps } from "../../common/Utils";

@observer
export default class SummaryView extends React.Component<any, any> {
    private bodyContainer: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);
        this.bodyContainer = React.createRef();
    }

    render() {
        return (
            <>
                <Flex column className={getStore().inPersonalAppMode ? "personal-app-body" : "body-container no-mobile-footer"} ref={this.bodyContainer}>
                    {this.getHeaderContainer()}
                    {this.getTopContainer()}
                    {this.getMyResponseContainer()}
                    {this.getShortSummaryContainer()}
                </Flex>
                {this.getFooterView()}
            </>
        );

    }

    private getMyResponseContainer(): JSX.Element {
        var myResponseCount = getStore().myRows.length;
        var myProfilePhoto: string;
        var myUserName = ActionSDK.Localizer.getString("You");
        var currentUserProfile: ActionSDK.UserProfile = getStore().userProfile[getStore().context.userId];
        if (currentUserProfile && currentUserProfile.displayName) {
            myUserName = currentUserProfile.displayName;
        }
        if (currentUserProfile && currentUserProfile.profilePhoto) {
            myProfilePhoto = `data:${currentUserProfile.profilePhoto.type};base64,${currentUserProfile.profilePhoto.base64Photo}`;
        }
        if (myResponseCount > 0) {
            var content = ActionSDK.Localizer.getString("YouRespondedNTimes", myResponseCount);
            if (myResponseCount == 1 && getStore().myRows[0].row) {
                content = ActionSDK.Localizer.getString("YouResponded");
            }
            return (
                <>
                    <Flex className="my-response" gap="gap.small" vAlign="center">
                        <Flex.Item >
                            <Avatar name={myUserName} size="large" image={myProfilePhoto} />
                        </Flex.Item>
                        <Flex.Item >
                            <Text {...UxUtils.getTabKeyProps()} className="underline" weight="regular" color="brand" content={content} onClick={() => {
                                initializeMyResponsesWithProfile(getStore().myRows, currentUserProfile);
                                setResponseViewType(ResponsesListViewType.MyResponses);
                                if (myResponseCount === 1) {
                                    showResponseView(0, getStore().myRows);
                                } else {
                                    setCurrentView(SummaryPageViewType.ResponderView);
                                }
                            }} />
                        </Flex.Item>
                    </Flex>
                    <Divider />
                </>
            )
        } else {
            return (<>
                <Flex className="my-response" gap="gap.small" vAlign="center">
                    <Flex.Item >
                        <Avatar name={myUserName} size="large" image={myProfilePhoto} />
                    </Flex.Item>
                    <Flex.Item >
                        <Text content={ActionSDK.Localizer.getString("NotResponded")} />
                    </Flex.Item>
                </Flex>
                <Divider />
            </>);
        }
    }

    private getSendReminderButton() {
        if (!ActionSDK.Utils.isEmptyObject(getStore().context) && !ActionSDK.Utils.isEmptyObject(getStore().context.ecsSettings) && getStore().context.ecsSettings.IsNotificationEnabled) {
            return (getStore().progressStatus.reminder != ProgressState.InProgress &&
                <Text {...UxUtils.getTabKeyProps()}
                    role="button"
                    className="send-reminder-button-label pointer-cursor"
                    weight="bold"
                    color="brand"
                    size="small"
                    content={ActionSDK.Localizer.getString("SendReminder")} onClick={(e) => {
                        e.stopPropagation();
                        actionInstanceSendReminder();
                    }} />);
        }
        return null;
    }

    private getSendReminderButtonForMobile(lastReminderTimestamp: number) {
        return (
            <>
                <Flex>
                    <Flex column className="send-reminder-button reminder-button-container">
                        {this.getSendReminderButton()}
                        {getSendReminderButtonProgressView(lastReminderTimestamp, getStore().progressStatus.reminder, true)}
                    </Flex>
                </Flex>
                <Divider />
            </>
        );
    }

    private getShortSummaryContainer(): JSX.Element {
        return (
            <>
                {this.canCurrentUserViewResults() ?
                    <Flex column>
                        <ResponseAggregationContainer
                            questions={getStore().actionInstance.columns}
                            responseAggregates={getStore().actionSummary.aggregates}
                            totalResponsesCount={getStore().actionSummary.rowCount} />
                    </Flex>
                    :
                    this.getNonCreatorErrorView()}
            </>
        );

    }

    private getTopContainer(): JSX.Element {
        if (getStore().progressStatus.actionInstance == ProgressState.Completed
            && getStore().progressStatus.memberCount == ProgressState.Completed
            && getStore().progressStatus.actionSummary == ProgressState.Completed) {

            var participationString: string = getStore().actionSummary.rowCount === 1 ?
                ActionSDK.Localizer.getString("ParticipationIndicatorSingular", getStore().actionSummary.rowCount, getStore().memberCount.count)
                : ActionSDK.Localizer.getString("ParticipationIndicatorPlural", getStore().actionSummary.rowCount, getStore().memberCount.count);

            var participationIndicator: JSX.Element;
            if (getStore().actionInstance && getStore().actionInstance.canUserAddMultipleRows) {
                participationString = (getStore().actionSummary.rowCount === 0)
                    ? ActionSDK.Localizer.getString("NoResponse")
                    : (getStore().actionSummary.rowCount === 1)
                        ? ActionSDK.Localizer.getString("SingleResponse")
                        : ActionSDK.Localizer.getString("XResponsesByYMembers", getStore().actionSummary.rowCount, (getStore().actionSummary.rowCreatorCount));
                participationIndicator = null;
            } else {
                var participationInfoItems: IBarChartItem[] = [];
                var participationPercentage = Math.round((getStore().actionSummary.rowCount / getStore().memberCount.count) * 100);
                participationInfoItems.push({
                    id: "participation",
                    title: ActionSDK.Localizer.getString("Participation", participationPercentage),
                    titleClassName: "participation-title",
                    quantity: getStore().actionSummary.rowCount,
                    hideStatistics: true
                });
                participationIndicator = <BarChartComponent items={participationInfoItems}
                    getBarPercentageString={(percentage: number) => {
                        return ActionSDK.Localizer.getString("BarPercentage", percentage);
                    }}
                    totalQuantity={getStore().memberCount.count} />;
            }
            let lastReminderTimestamp: number = getStore().actionInstance.lastSentReminderTime != 0 ? getStore().actionInstance.lastSentReminderTime : null;

            const coverImage = getCoverImage(getStore().actionInstance);

            return (
                <>
                    {coverImage && <img src={coverImage.url} className="header-cover-image" />}
                    {participationIndicator}
                    <Flex space="between" className="participation-container">
                        <Flex.Item >
                            {this.canCurrentUserViewResults() ?
                                <Text {...UxUtils.getTabKeyProps()} role="button" className="underline" color="brand" size="small" content={participationString} onClick={() => {
                                    setResponseViewType(ResponsesListViewType.AllResponses);
                                    setCurrentView(SummaryPageViewType.ResponderView);
                                }} /> :
                                <Text content={participationString} />
                            }
                        </Flex.Item>
                        <Flex className="reminder-button-container" column>
                            {
                                !UxUtils.renderingForMobile() && this.canCurrentUserSendReminder() && this.getSendReminderButton()
                            }
                            {
                                !UxUtils.renderingForMobile() && this.canCurrentUserSendReminder() && getSendReminderButtonProgressView(lastReminderTimestamp, getStore().progressStatus.reminder, true)
                            }
                        </Flex>
                    </Flex>
                    <Divider />
                    {
                        UxUtils.renderingForMobile() && this.canCurrentUserSendReminder() && this.getSendReminderButtonForMobile(lastReminderTimestamp)
                    }
                </>
            );
        } else if (getStore().progressStatus.memberCount == ProgressState.Failed
            || getStore().progressStatus.actionSummary == ProgressState.Failed) {
            addLog(ActionSDK.LogLevel.Error, `SummaryView, showing error screen. ` +
                `memberCount: ${getStore().progressStatus.memberCount}, ` +
                `actionSummary: ${getStore().progressStatus.actionSummary}, `);
            return <ErrorView
                title={ActionSDK.Localizer.getString("GenericError")}
                buttonTitle={ActionSDK.Localizer.getString("Close")}
            />;
        } else {
            return <Loader />;
        }
    }

    private getActionInstanceStatusString(): string {
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
        if (this.isSurveyActive()) {
            return ActionSDK.Localizer.getString("dueByDate",
                UxUtils.formatDate(new Date(getStore().actionInstance.expiry),
                    (getStore().context && getStore().context.locale) ? getStore().context.locale : ActionSDK.Utils.DEFAULT_LOCALE, options));
        }

        if (getStore().actionInstance.status == ActionSDK.ActionInstanceStatus.Closed) {
            var expiry: number = getStore().actionInstance.updateTime ? getStore().actionInstance.updateTime : getStore().actionInstance.expiry;
            return ActionSDK.Localizer.getString("ClosedOn",
                UxUtils.formatDate(new Date(expiry),
                    (getStore().context && getStore().context.locale) ? getStore().context.locale : ActionSDK.Utils.DEFAULT_LOCALE, options));
        }

        if (this.isSurveyExpired()) {
            return ActionSDK.Localizer.getString("ExpiredOn",
                UxUtils.formatDate(new Date(getStore().actionInstance.expiry),
                    (getStore().context && getStore().context.locale) ? getStore().context.locale : ActionSDK.Utils.DEFAULT_LOCALE, options));
        }
    }

    private getHeaderContainer(): JSX.Element {

        return (
            <Flex column className="summary-header-container" >
                <Flex vAlign="center" className="title-and-menu-container">
                    <Text content={getStore().actionInstance.title} className="questionnaire-title" />
                    {getStore().inPersonalAppMode ? null : this.getMenu()}
                </Flex>
                <Text className="expiry-status" content={this.getActionInstanceStatusString()} />
                <Divider className="due-by-label-divider" />
                {this.setupDeleteDialog()}
                {this.setupCloseDialog()}
                {this.setupDuedateDialog()}
            </Flex >
        );
    }

    private getFooterView(): JSX.Element {
        if (UxUtils.renderingForMobile() || getStore().inPersonalAppMode) {
            return null;
        } else {
            let menuItems: AdaptiveMenuItem[] = [];
            if (this.canCurrentUserViewResults()) {
                menuItems.push(this.getDownloadAdaptiveMenuItem('download_image', "DownloadImage"));
                menuItems.push(this.getDownloadAdaptiveMenuItem('download_responses', "DownloadResponses"));
            }

            return (
                menuItems.length > 0 ?
                    <Flex className="footer-layout" gap={"gap.smaller"} hAlign="end">
                        <AdaptiveMenu
                            key="download_button"
                            renderAs={UxUtils.renderingForMobile() ? AdaptiveMenuRenderStyle.ACTIONSHEET : AdaptiveMenuRenderStyle.MENU}
                            content={this.getMenuContent()}
                            menuItems={menuItems}
                            dismissMenuAriaLabel={ActionSDK.Localizer.getString("DismissMenu")}
                        >
                        </AdaptiveMenu>
                    </Flex> : null
            );
        }
    }

    private getDownloadAdaptiveMenuItem(key: string, menuLabel: string): AdaptiveMenuItem {
        let menuItem: AdaptiveMenuItem = {
            key: key,
            className: "break-word",
            content: <Text content={ActionSDK.Localizer.getString(menuLabel)} />,
            onClick: () => {
                if (key == 'download_image') {
                    this.downloadImage();
                } else if (key == 'download_responses') {
                    downloadCSV();
                }
            }
        }
        return menuItem;
    }

    private downloadImage() {
        // TODO find a better way than findDOMNode to get html element
        var bodyContainerDiv = ReactDOM.findDOMNode(this.bodyContainer.current) as HTMLDivElement;
        // TODO "default" is undefined, find proper resolution for this instead of "any".

        let backgroundColorOfResultsImage: string = UxUtils.getBackgroundColorForTheme(getStore().context.theme);
        (html2canvas as any)(bodyContainerDiv, { width: bodyContainerDiv.scrollWidth, height: bodyContainerDiv.scrollHeight, backgroundColor: backgroundColorOfResultsImage }).then((canvas) => {

            let fileName: string = ActionSDK.Localizer.getString("SurveyResult", getStore().actionInstance.title).substring(0, Constants.ACTION_RESULT_FILE_NAME_MAX_LENGTH) + ".png";
            var base64Image = canvas.toDataURL("image/png");
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(canvas.msToBlob(), fileName);
            } else {
                ActionSDK.Utils.downloadContent(fileName, base64Image);
            }

        });
    }

    private getMenuContent(): JSX.Element {
        let content = getStore().progressStatus.downloadData === ProgressState.InProgress
            ? < Loader size="small" />
            : ActionSDK.Localizer.getString("Download");

        return (
            <Button.Group
                buttons={[
                    {
                        key: "download",
                        primary: true,
                        content: content,
                        size: "large",
                        className: 'download-button',
                        onClick: (e) => {
                            e.stopPropagation();
                            this.downloadImage();
                        },
                        onKeyDown: (e) => {
                            // checking whether enter key is pressed and is not repeated by holding it down
                            if (!e.repeat && (e.keyCode || e.which) == Constants.CARRIAGE_RETURN_ASCII_VALUE) {
                                e.stopPropagation();
                                this.downloadImage();
                            }
                        }
                    },
                    {
                        key: "show-menu",
                        icon: { name: "chevron-down", size: "small" },
                        iconOnly: true,
                        primary: true,
                        size: "large",
                        className: 'show-menu-button'
                    }
                ]}
            >
            </Button.Group>
        );
    }

    private setupDuedateDialog() {
        return <Dialog
            className="due-date-dialog"
            overlay={{
                className: "dialog-overlay"
            }}
            open={getStore().isChangeExpiryAlertOpen}
            onOpen={(e, { open }) => surveyExpiryChangeAlertOpen(open)}
            cancelButton={getDialogButtonProps(ActionSDK.Localizer.getString("ChangeDueDate"), ActionSDK.Localizer.getString("Cancel"))}
            confirmButton={getStore().progressStatus.updateActionInstance == ProgressState.InProgress ?
                <Loader size="small" /> :
                this.getDueDateDialogConfirmationButtonProps()}
            content={
                <Flex gap="gap.smaller" column>
                    <DateTimePickerView showTimePicker locale={getStore().context.locale} renderForMobile={UxUtils.renderingForMobile()} minDate={new Date()} value={new Date(getStore().dueDate)} placeholderDate={ActionSDK.Localizer.getString("SelectADate")} placeholderTime={ActionSDK.Localizer.getString("SelectATime")} onSelect={(date: Date) => {
                        setDueDate(date.getTime());
                    }} />
                    {getStore().progressStatus.updateActionInstance == ProgressState.Failed ? <Text content={ActionSDK.Localizer.getString("SomethingWentWrong")} error /> : null}
                </Flex>
            }
            header={ActionSDK.Localizer.getString("ChangeDueDate")}


            onCancel={() => {
                surveyExpiryChangeAlertOpen(false);
            }}
            onConfirm={() => {
                updateDueDate(getStore().dueDate);
            }}
        />
    }

    private getDueDateDialogConfirmationButtonProps(): IButtonProps {

        let confirmButtonProps: ButtonProps = {
            // if difference less than 60 secs, keep it disabled
            disabled: Math.abs(getStore().dueDate - getStore().actionInstance.expiry) / 1000 <= 60
        }
        Object.assign(confirmButtonProps, getDialogButtonProps(ActionSDK.Localizer.getString("ChangeDueDate"), ActionSDK.Localizer.getString("Change")));
        return confirmButtonProps;
    }

    private getMenu() {
        let menuItems: AdaptiveMenuItem[] = this.getMenuItems();
        if (menuItems.length == 0) {
            return null;
        }
        return (
            <AdaptiveMenu
                className="triple-dot-menu"
                key="survey_options"
                renderAs={UxUtils.renderingForMobile() ? AdaptiveMenuRenderStyle.ACTIONSHEET : AdaptiveMenuRenderStyle.MENU}
                content={<Icon name="more" title={ActionSDK.Localizer.getString("MoreOptions")} outline aria-hidden={false} role="button" />}
                menuItems={menuItems}
                dismissMenuAriaLabel={ActionSDK.Localizer.getString("DismissMenu")}
            />
        );
    }

    getMenuItems(): AdaptiveMenuItem[] {
        let menuItemList: AdaptiveMenuItem[] = [];
        if (this.isCurrentUserCreator() && this.isSurveyActive()) {
            let changeExpiry: AdaptiveMenuItem = {
                key: "changeDueDate",
                content: ActionSDK.Localizer.getString("ChangeDueBy"),
                icon: { name: 'calendar', outline: true },
                onClick: () => {
                    if (getStore().progressStatus.updateActionInstance != ProgressState.InProgress)
                        setProgressStatus({ updateActionInstance: ProgressState.NotStarted });
                    surveyExpiryChangeAlertOpen(true);
                }
            };
            menuItemList.push(changeExpiry);

            let closeSurvey: AdaptiveMenuItem = {
                key: "close",
                content: ActionSDK.Localizer.getString("CloseSurvey"),
                icon: { name: 'ban', outline: true },
                onClick: () => {
                    if (getStore().progressStatus.deleteActionInstance != ProgressState.InProgress)
                        setProgressStatus({ closeActionInstance: ProgressState.NotStarted });
                    surveyCloseAlertOpen(true);
                }
            };
            menuItemList.push(closeSurvey);
        }

        if (this.isCurrentUserCreator()) {
            let deleteSurvey: AdaptiveMenuItem = {
                key: "delete",
                content: ActionSDK.Localizer.getString("DeleteSurvey"),
                icon: { name: 'trash-can', outline: true },
                onClick: () => {
                    if (getStore().progressStatus.deleteActionInstance != ProgressState.InProgress)
                        setProgressStatus({ deleteActionInstance: ProgressState.NotStarted });
                    surveyDeleteAlertOpen(true);
                }
            };
            menuItemList.push(deleteSurvey);
        }
        return menuItemList;
    }

    private isCurrentUserCreator(): boolean {
        return getStore().actionInstance && getStore().context.userId == getStore().actionInstance.creatorId;
    }

    private isSurveyActive(): boolean {
        return getStore().actionInstance && getStore().actionInstance.status == ActionSDK.ActionInstanceStatus.Active && !this.isSurveyExpired();
    }

    private canCurrentUserViewResults(): boolean {
        return this.isCurrentUserCreator() || (getStore().actionInstance.rowsVisibility == ActionSDK.Visibility.All);
    }

    private canCurrentUserSendReminder(): boolean {
        return !ActionSDK.Utils.isEmptyObject(getStore().context.ecsSettings) && getStore().context.ecsSettings.IsNotificationEnabled && this.isCurrentUserCreator() && this.isSurveyActive();
    }

    private isSurveyExpired(): boolean {
        return getStore().actionInstance.expiry < new Date().getTime() || getStore().actionInstance.status == ActionSDK.ActionInstanceStatus.Expired;
    }

    private setupCloseDialog() {
        return <Dialog
            className="dialog-base"
            overlay={{
                className: "dialog-overlay"
            }}
            open={getStore().isSurveyCloseAlertOpen}
            onOpen={(e, { open }) => surveyCloseAlertOpen(open)}
            cancelButton={getDialogButtonProps(ActionSDK.Localizer.getString("CloseSurvey"), ActionSDK.Localizer.getString("Cancel"))}
            confirmButton={getStore().progressStatus.closeActionInstance == ProgressState.InProgress ?
                <Loader size="small" /> :
                getDialogButtonProps(ActionSDK.Localizer.getString("CloseSurvey"), ActionSDK.Localizer.getString("Confirm"))}
            content={
                <Flex gap="gap.smaller" column>
                    <Text content={ActionSDK.Localizer.getString("CloseSurveyConfirmation")} />
                    {getStore().progressStatus.closeActionInstance == ProgressState.Failed ? <Text content={ActionSDK.Localizer.getString("SomethingWentWrong")} error /> : null}
                </Flex>
            }
            header={ActionSDK.Localizer.getString("CloseSurvey")}
            onCancel={() => {
                surveyCloseAlertOpen(false);
            }}
            onConfirm={() => {
                closeSurvey();
            }}
        />
    }

    private setupDeleteDialog() {
        return <Dialog
            className="dialog-base"
            overlay={{
                className: "dialog-overlay"
            }}
            open={getStore().isDeleteSurveyAlertOpen}
            onOpen={(e, { open }) => surveyDeleteAlertOpen(open)}
            cancelButton={getDialogButtonProps(ActionSDK.Localizer.getString("DeleteSurvey"), ActionSDK.Localizer.getString("Cancel"))}
            confirmButton={getStore().progressStatus.deleteActionInstance == ProgressState.InProgress ?
                <Loader size="small" /> :
                getDialogButtonProps(ActionSDK.Localizer.getString("DeleteSurvey"), ActionSDK.Localizer.getString("Confirm"))}
            content={
                <Flex gap="gap.smaller" column>
                    <Text content={ActionSDK.Localizer.getString("DeleteSurveyConfirmation")} />
                    {getStore().progressStatus.closeActionInstance == ProgressState.Failed ? <Text content="Something went wrong" error /> : null}
                </Flex>}
            header={ActionSDK.Localizer.getString("DeleteSurvey")}
            onCancel={() => {
                surveyDeleteAlertOpen(false);
            }
            }
            onConfirm={() => {
                deleteSurvey();
            }}
        />
    }

    private getNonCreatorErrorView = () => {
        return (
            <Flex column className="non-creator-error-image-container">
                <img
                    src={permissionErrorImage}
                    className="non-creator-error-image"
                />
                <Text className="non-creator-error-text">{this.isSurveyActive() ?
                    ActionSDK.Localizer.getString("VisibilityCreatorOnlyLabel") : getStore().myRows.length === 0 ? ActionSDK.Localizer.getString("NotRespondedLabel")
                        : ActionSDK.Localizer.getString("VisibilityCreatorOnlyLabel")}</Text>
                {
                    getStore().myRows.length > 0 ?
                        <a className="download-your-responses-link"
                            onClick={
                                () => { downloadCSV() }
                            }>
                            {ActionSDK.Localizer.getString("DownloadYourResponses")}
                        </a> : null
                }
            </Flex>
        );
    }
}