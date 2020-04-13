import * as React from 'react';
import { RecyclerViewComponent, RecyclerViewType, UxUtils } from '@sharedUI';
import getStore from "../../store/myResponses/Store";
import { Flex, Text, Divider, Avatar, FlexItem, Icon } from '@stardust-ui/react';
import { observer } from 'mobx-react';
import * as ActionSDK from "@actionSDK";
import "../../css/MyResponses.scss";
import { listViewRowHeight } from "../../common/Constants";
import { FocusZone } from '@stardust-ui/react/dist/es/lib/accessibility/FocusZone';

export interface IMyResponsesPage {
    onRowClick?: (index, dataSource) => void;
    locale?: string;
}

@observer
export class MyResponsesListView extends React.Component<IMyResponsesPage, any> {
    private responseTimeStamps: string[] = [];

    private onRowRender(type: RecyclerViewType, index: number, date: string): JSX.Element {
        return (<>
            <Flex
                vAlign="center"
                className="my-response-item"
                onClick={() => {
                    this.props.onRowClick ? this.props.onRowClick(index, getStore().myResponses) : null;
                }}
                {...UxUtils.getTabKeyProps()} >
                <Text content={date} />
                <FlexItem push>
                    <Icon size="smallest" name="chevron-down" rotate={270} outline></Icon>
                </FlexItem>
            </Flex>
            <Divider />
        </>);
    }

    render() {
        this.responseTimeStamps = [];

        for (var row of getStore().myResponses) {
            this.addUserResponseTimeStamp(row);
        }

        let myProfilePhoto: string;
        let myUserName: string = ActionSDK.Localizer.getString("You");
        let currentUserProfile: ActionSDK.UserProfile = getStore().myProfile;
        if (currentUserProfile && currentUserProfile.displayName) {
            myUserName = currentUserProfile.displayName;
        }
        if (currentUserProfile && currentUserProfile.profilePhoto) {
            myProfilePhoto = `data:${currentUserProfile.profilePhoto.type};base64,${currentUserProfile.profilePhoto.base64Photo}`;
        }

        return (
            <FocusZone className="zero-padding" isCircularNavigation={true}>
                <Flex column
                    className="list-container"
                    gap="gap.small">
                    <Flex vAlign="center" gap="gap.small">
                        <Flex.Item>
                            <Avatar name={myUserName} size="large" image={myProfilePhoto} />
                        </Flex.Item>
                        <Flex.Item >
                            <Text content={ActionSDK.Localizer.getString("YourResponses(N)", getStore().myResponses.length)} weight="bold" />
                        </Flex.Item>
                    </Flex>
                    <Divider className="divider zero-bottom-margin" />
                    <RecyclerViewComponent
                        data={this.responseTimeStamps}
                        rowHeight={listViewRowHeight}
                        onRowRender={(type: RecyclerViewType, index: number, date: string): JSX.Element => {
                            return this.onRowRender(type, index, date);
                        }} />
                </Flex>
            </FocusZone>
        );

    }

    private addUserResponseTimeStamp(row: ActionSDK.ActionInstanceRow): void {
        if (row) {
            let responseTimeStamp: string = ActionSDK.Utils.dateTimeToLocaleString(new Date(row.updateTime),
                (this.props.locale) ? this.props.locale : ActionSDK.Utils.DEFAULT_LOCALE);
            this.responseTimeStamps.push(responseTimeStamp);
        }
    }
}