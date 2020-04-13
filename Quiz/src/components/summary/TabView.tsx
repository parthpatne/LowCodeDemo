
import * as React from 'react';
import { Flex, Icon, Text, Menu } from '@stardust-ui/react';
import { ResponderView } from './ResponderView';
import getStore, { SummaryPageViewType, ResponsesListViewType } from "../../store/summary/Store";
import { NonResponderView } from './NonResponderView';
import { setCurrentView, goBack, actionInstanceSendReminder } from "../../actions/SummaryActions";
import { INavBarComponentProps, NavBarItemType, NavBarComponent, UxUtils, ButtonComponent, ProgressState, Constants } from '@sharedUI';
import * as ActionSDK from "@actionSDK";
import { observer } from 'mobx-react';
import { getSendReminderButtonProgressView } from '../../common/Utils';

@observer
export class TabView extends React.Component<any, any> {

    componentDidMount() {
        UxUtils.setFocus(document.body, Constants.FOCUSABLE_ITEMS.All);
    }

    private items = [
        {
            key: 'responders',
            role: "tab",
            "aria-selected": getStore().currentView == SummaryPageViewType.ResponderView,
            "aria-label": ActionSDK.Localizer.getString("Responders"),
            content: ActionSDK.Localizer.getString("Responders"),
            onClick: () => {
                setCurrentView(SummaryPageViewType.ResponderView)
            }
        },
        {
            key: 'nonResponders',
            role: "tab",
            "aria-selected": getStore().currentView == SummaryPageViewType.NonResponderView,
            "aria-label": ActionSDK.Localizer.getString("NonResponders"),
            content: ActionSDK.Localizer.getString("NonResponders"),
            onClick: () => {
                setCurrentView(SummaryPageViewType.NonResponderView)
            }
        }
    ];

    render() {
        var participationString: string = getStore().actionSummary.rowCount === 1 ?
            ActionSDK.Localizer.getString("ParticipationIndicatorSingular", getStore().actionSummary.rowCount, getStore().memberCount.count)
            : ActionSDK.Localizer.getString("ParticipationIndicatorPlural", getStore().actionSummary.rowCount, getStore().memberCount.count);
        if (getStore().actionInstance && getStore().actionInstance.canUserAddMultipleRows) {
            participationString = (getStore().actionSummary.rowCount === 0)
                ? ActionSDK.Localizer.getString("NoResponse")
                : (getStore().actionSummary.rowCount === 1)
                    ? ActionSDK.Localizer.getString("SingleResponse")
                    : ActionSDK.Localizer.getString("XResponsesByYMembers", getStore().actionSummary.rowCount, (getStore().actionSummary.rowCreatorCount));
        }
        return (

            <Flex column className={getStore().inPersonalAppMode ? "personal-app-body" : "body-container tabview-container no-mobile-footer"}>
                {this.getNavBar()}
                {getStore().responseViewType === ResponsesListViewType.AllResponses &&
                    <>
                        <Text className="participation-title" size="small" weight="bold">{participationString}</Text>
                        <Menu role="tablist" className="tab-view" fluid defaultActiveIndex={0} items={this.items} underlined primary />
                    </>}
                {getStore().currentView == SummaryPageViewType.ResponderView ? <ResponderView /> : <NonResponderView />}

                {this.getFooterElement()}
            </Flex>
        );
    }

    private getFooterElement() {
        let lastReminderTimestamp: number = getStore().actionInstance.lastSentReminderTime != 0 ? getStore().actionInstance.lastSentReminderTime : null;

        if (!UxUtils.renderingForMobile() && !getStore().inPersonalAppMode) {
            return (
                <Flex className="footer-layout tab-view-footer" gap={"gap.smaller"}>
                    <Flex vAlign="center" className="pointer-cursor" {...UxUtils.getTabKeyProps()} onClick={() => {
                        goBack();
                    }} >
                        <Icon name="chevron-down" rotate={90} xSpacing="after" size="small" />
                        <Text content={ActionSDK.Localizer.getString("Back")} />
                    </Flex>
                    {getStore().currentView == SummaryPageViewType.NonResponderView && this.canCurrentUserSendReminder() &&
                        (!ActionSDK.Utils.isEmptyObject(getStore().context) && !ActionSDK.Utils.isEmptyObject(getStore().context.ecsSettings) && getStore().context.ecsSettings.IsNotificationEnabled) &&
                        <Flex className="reminder-button-container" column>
                            <ButtonComponent secondary showLoader={getStore().progressStatus.reminder == ProgressState.InProgress} content={ActionSDK.Localizer.getString("SendReminder")} onClick={() => { actionInstanceSendReminder() }}></ButtonComponent>
                            {
                                getSendReminderButtonProgressView(lastReminderTimestamp, getStore().progressStatus.reminder, false)
                            }
                        </Flex>}
                </Flex>
            );
        } else {
            return null;
        }
    }

    private getNavBar() {
        if (UxUtils.renderingForMobile()) {
            let navBarComponentProps: INavBarComponentProps = {
                title: ActionSDK.Localizer.getString("ViewResponses"),
                leftNavBarItem: {
                    icon: { name: "arrow-down", size: "large", rotate: 90 },
                    ariaLabel: ActionSDK.Localizer.getString("Back"),
                    onClick: () => {
                        goBack();
                    },
                    type: NavBarItemType.BACK
                }
            }

            return (
                <NavBarComponent {...navBarComponentProps} />
            );
        } else {
            return null;
        }
    }

    private canCurrentUserSendReminder(): boolean {
        return this.isCurrentUserCreator() && this.isSurveyActive();
    }

    private isCurrentUserCreator(): boolean {
        return getStore().actionInstance && getStore().context.userId == getStore().actionInstance.creatorId;
    }

    private isSurveyActive(): boolean {
        return getStore().actionInstance && getStore().actionInstance.status == ActionSDK.ActionInstanceStatus.Active;
    }
}