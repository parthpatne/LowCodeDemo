import * as React from "react";
import { observer } from "mobx-react";
import getStore, { SummaryPageViewType, ResponsesListViewType } from "../../store/summary/Store";
import { goBack, showResponseView, setCurrentView, setProgressStatus } from "../../actions/SummaryActions";
import SummaryView from "./SummaryView";
import { UserResponseView } from "./UserResponseView";
import { LoaderUI, AdaptiveMenu, AdaptiveMenuItem, ButtonComponent, ProgressState, AdaptiveMenuRenderStyle, ErrorView, actionDeletedError } from "@sharedUI"
import * as ActionSDK from "@actionSDK";
import { TabView } from "./TabView";
import { Flex, Icon, Text } from '@stardust-ui/react';
import "../../css/homeview.scss";
import ResponseAggregationView from "./ResponseAggregationView";

@observer
export default class SummaryPage extends React.Component<any, any> {

    render() {
        if (getStore().isActionDeleted) {
            return <ErrorView
                title={ActionSDK.Localizer.getString("SurveyDeletedError")}
                subtitle={ActionSDK.Localizer.getString("SurveyDeletedErrorDescription")}
                buttonTitle={ActionSDK.Localizer.getString("Close")}
                image={actionDeletedError}
            />;
        }

        if (getStore().progressStatus.actionInstance == ProgressState.Failed
            || getStore().progressStatus.actionSummary == ProgressState.Failed
            || getStore().progressStatus.localizationState == ProgressState.Failed
            || getStore().progressStatus.memberCount == ProgressState.Failed) {
            ActionSDK.APIs.actionViewDidLoad(false /*success*/);
            return <ErrorView
                title={ActionSDK.Localizer.getString("GenericError")}
                buttonTitle={ActionSDK.Localizer.getString("Close")}
            />;
        }

        if (getStore().progressStatus.actionInstance != ProgressState.Completed
            || getStore().progressStatus.actionSummary != ProgressState.Completed
            || getStore().progressStatus.localizationState != ProgressState.Completed
            || getStore().progressStatus.memberCount != ProgressState.Completed) {
            return <LoaderUI fill />;
        }

        ActionSDK.APIs.actionViewDidLoad(true /*success*/);
        return this.getView();
    }

    private getPersonalView(): JSX.Element {
        return (
            <>
                {this.getPersonalAppHeaderContainer()}
                {this.getPageView()}
                {this.getPersonalAppFooter()}
            </>
        );
    }

    private getView(): JSX.Element {
        if (getStore().inPersonalAppMode) {
            return this.getPersonalView();
        }
        else {
            return this.getPageView();
        }
    }

    private getPageView(): JSX.Element {
        if (getStore().currentView == SummaryPageViewType.Main) {
            return <SummaryView />;
        } else if (getStore().currentView == SummaryPageViewType.ResponderView || getStore().currentView == SummaryPageViewType.NonResponderView) {
            return <TabView />;
        } else if (getStore().currentView === SummaryPageViewType.ResponseAggregationView) {
            return (<ResponseAggregationView questionInfo={getStore().selectedQuestionDrillDownInfo} />);
        } else if (getStore().currentView == SummaryPageViewType.ResponseView) {
            let dataSource: ActionSDK.ActionInstanceRow[] = (getStore().responseViewType === ResponsesListViewType.AllResponses)
                ? getStore().actionInstanceRows : getStore().myRows;
            let goBackToView: SummaryPageViewType = SummaryPageViewType.ResponderView;
            if (getStore().responseViewType === ResponsesListViewType.MyResponses && dataSource.length === 1) {
                goBackToView = SummaryPageViewType.Main;
            }
            return (
                <UserResponseView
                    responses={dataSource}
                    goBack={() => { setCurrentView(goBackToView); }}
                    currentResponseIndex={getStore().currentResponseIndex}
                    showResponseView={showResponseView}
                    userProfiles={getStore().userProfile}
                    locale={getStore().context ? getStore().context.locale : ActionSDK.Utils.DEFAULT_LOCALE} />);
        }
    }

    private handleCloseBackPress() {
        setProgressStatus({
            actionInstance: ProgressState.NotStarted,
            actionSummary: ProgressState.NotStarted,
            localizationState: ProgressState.NotStarted,
            currentContext: ProgressState.NotStarted
        });
        this.props.onBackPress();
    }

    private getPersonalAppHeaderContainer(): JSX.Element {
        return (
            <Flex space="between" className="header-container">
                <Flex gap="gap.small" onClick={() => { getStore().currentView == SummaryPageViewType.Main ? this.handleCloseBackPress() : goBack(); }}>
                    < Icon name="chevron-down" rotate={90} />
                    <Text content={getStore().actionInstance.title} weight="bold" size="medium" color="brand" />
                </Flex>
                <Flex gap="gap.small">
                    {this.getMenu()}
                    <ButtonComponent secondary
                        content={ActionSDK.Localizer.getString("Close")} className="secondary-button"
                        onClick={() => {
                            this.handleCloseBackPress();
                        }} />
                </Flex>
            </Flex>
        );
    }

    private getPersonalAppFooter(): JSX.Element {
        return (
            <Flex className={"personal-footer-layout"} gap={"gap.smaller"} hAlign="end" >
                <ButtonComponent secondary
                    content={ActionSDK.Localizer.getString("DownloadResponses")} />
                <ButtonComponent primary
                    content={ActionSDK.Localizer.getString("DownloadImage")} />
            </Flex>
        );
    }

    private getMenu() {
        let menuItems: AdaptiveMenuItem[] = this.getMenuItems();
        if (menuItems.length == 0) {
            return null;
        }
        return (
            <AdaptiveMenu
                key="header_options"
                renderAs={AdaptiveMenuRenderStyle.MENU}
                content={<Icon name="more" outline className="header-menu" />}
                menuItems={menuItems}
                dismissMenuAriaLabel={ActionSDK.Localizer.getString("DismissMenu")}
            />
        );
    }

    getMenuItems(): AdaptiveMenuItem[] {
        let menuItemList: AdaptiveMenuItem[] = [];
        let sendReminder: AdaptiveMenuItem = {
            key: "sendReminder",
            content: ActionSDK.Localizer.getString("SendReminder"),
            icon: {},
            onClick: () => {
            }
        };
        if (!ActionSDK.Utils.isEmptyObject(getStore().context) && !ActionSDK.Utils.isEmptyObject(getStore().context.ecsSettings) && getStore().context.ecsSettings.IsNotificationEnabled) {
            menuItemList.push(sendReminder);
        }

        let changeDueDate: AdaptiveMenuItem = {
            key: "changeDueDate",
            content: ActionSDK.Localizer.getString("ChangeDueDate"),
            icon: {},
            onClick: () => {
            }
        };
        menuItemList.push(changeDueDate);

        let duplicateSurvey: AdaptiveMenuItem = {
            key: "duplicateSurvey",
            content: ActionSDK.Localizer.getString("DuplicateSurvey"),
            icon: {},
            onClick: () => {
            }
        };
        menuItemList.push(duplicateSurvey);

        let closeSurvey: AdaptiveMenuItem = {
            key: "close",
            content: ActionSDK.Localizer.getString("CloseSurvey"),
            icon: {},
            onClick: () => {
            }
        };
        menuItemList.push(closeSurvey);

        let deleteSurvey: AdaptiveMenuItem = {
            key: "changeDueDate",
            content: ActionSDK.Localizer.getString("DeleteSurvey"),
            icon: {},
            onClick: () => {
            }
        };
        menuItemList.push(deleteSurvey);

        let getLinkToResult: AdaptiveMenuItem = {
            key: "getLinkToResult",
            content: ActionSDK.Localizer.getString("GetLinkToResult"),
            icon: {},
            onClick: () => {
            }
        };
        menuItemList.push(getLinkToResult);


        return menuItemList;
    }

}