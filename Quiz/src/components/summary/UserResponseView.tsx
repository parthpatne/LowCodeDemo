import * as React from 'react';
import { Flex, Text, Icon } from '@stardust-ui/react';
import { observer } from 'mobx-react';
import ResponsePage from '../response/ResponsePage';
import { UserInfoView, UxUtils, NavBarComponent, NavBarItemType, INavBarComponentProps } from '@sharedUI';
import * as ActionSDK from "@actionSDK";
import { ResponseViewMode } from '../../store/response/Store';
import getStore from "../../store/summary/Store";
import "../../css/Response.scss";

export interface IUserResponsePage {
    responses: ActionSDK.ActionInstanceRow[];
    goBack: () => void;
    currentResponseIndex: number;
    showResponseView: (index, dataSource: ActionSDK.ActionInstanceRow[]) => void;
    userProfiles?: { [key: string]: ActionSDK.UserProfile };
    locale?: string;
}

@observer
export class UserResponseView extends React.Component<IUserResponsePage, any>  {

    render() {
        return (
            <Flex className={this.getContainerClassName()} column>
                {UxUtils.renderingForMobile() ? this.getNavBar() : null}
                {this.getUserView()}
                <ResponsePage responseViewMode={ResponseViewMode.DisabledResponse} />
                {UxUtils.renderingForMobile() ? null : this.getFooterView()}
            </Flex>
        );
    }

    private getUserView(): JSX.Element {
        let responses = this.props.responses;
        let currentResponseIndex: number = this.props.currentResponseIndex;
        let row: ActionSDK.ActionInstanceRow = responses[currentResponseIndex];
        let userProfile: ActionSDK.UserProfile = this.props.userProfiles ? this.props.userProfiles[row.creatorId] : null;
        let profilePicBase64String: string;
        let displayName: string = ActionSDK.Localizer.getString("You");
        if (userProfile) {
            if (userProfile.profilePhoto) {
                profilePicBase64String = `data:${userProfile.profilePhoto.type};base64,${userProfile.profilePhoto.base64Photo}`
            }
            displayName = userProfile.displayName ? userProfile.displayName : displayName;
        }
        let dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
        let responseDateTime: string = UxUtils.formatDate(new Date(row.updateTime),
            (this.props.locale) ? this.props.locale : ActionSDK.Utils.DEFAULT_LOCALE, dateOptions);
        let isFirstResponse = currentResponseIndex === 0;
        let isLastResponse = currentResponseIndex === responses.length - 1;

        return (
            <Flex gap="gap.small" vAlign="center" className="user-view">
                <Flex.Item>
                    <Flex onClick={isFirstResponse ? null : () => {
                        this.props.showResponseView(currentResponseIndex - 1, responses);
                    }}>
                        <Icon
                            {...(!isFirstResponse && UxUtils.getTabKeyProps())}
                            aria-label={ActionSDK.Localizer.getString("PreviousResponse")}
                            name="chevron-down"
                            rotate={90}
                            xSpacing="after"
                            size="medium"
                            className={isFirstResponse ? "" : "pointer-cursor"}
                            aria-disabled={isFirstResponse}
                            disabled={isFirstResponse}
                        />
                    </Flex>
                </Flex.Item>
                <Flex className="overflow-hidden user-response-header">
                    {userProfile ?
                        <UserInfoView
                            userName={displayName}
                            subtitle={responseDateTime}
                            pictureUrl={profilePicBase64String}
                        /> :
                        <Text content={responseDateTime} />
                    }
                </Flex>
                <Flex.Item push>
                    <Flex onClick={isLastResponse ? null : () => {
                        this.props.showResponseView(this.props.currentResponseIndex + 1, responses);
                    }}>
                        <Icon
                            {...(!isLastResponse && UxUtils.getTabKeyProps())}
                            aria-label={ActionSDK.Localizer.getString("NextResponse")}
                            name="chevron-down"
                            rotate={270}
                            xSpacing="before"
                            size="medium"
                            className={isLastResponse ? "" : "pointer-cursor"}
                            aria-disabled={isLastResponse}
                            disabled={isLastResponse}
                        />
                    </Flex>
                </Flex.Item>
            </Flex>
        );
    }

    private getContainerClassName(): string {
        if (UxUtils.renderingForMobile()) {
            return "body-container no-mobile-footer";
        } else if (getStore().inPersonalAppMode) {
            return "personal-app-body";
        } else {
            return "body-container response-view";
        }

    }

    private getFooterView() {
        if (getStore().inPersonalAppMode) {
            return null;
        }
        return (
            <Flex className="footer-layout" gap={"gap.smaller"}>
                <Flex vAlign="center" className="pointer-cursor" {...UxUtils.getTabKeyProps()} onClick={() => {
                    this.props.goBack();
                }} >
                    <Icon name="chevron-down" rotate={90} xSpacing="after" size="small" />
                    <Text content={ActionSDK.Localizer.getString("Back")} />
                </Flex>
            </Flex>
        );
    }

    private getNavBar() {
        let navBarComponentProps: INavBarComponentProps = {
            title: ActionSDK.Localizer.getString("Back"),
            leftNavBarItem: {
                icon: { name: "arrow-down", size: "large", rotate: 90 },
                ariaLabel: ActionSDK.Localizer.getString("Back"),
                onClick: () => {
                    this.props.goBack();
                },
                type: NavBarItemType.BACK
            }
        };

        return (
            <NavBarComponent {...navBarComponentProps} />
        );
    }
}