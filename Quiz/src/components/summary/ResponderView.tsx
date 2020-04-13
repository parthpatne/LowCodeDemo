import * as React from 'react';
import { RecyclerViewComponent, RecyclerViewType, UserInfoView, IUserInfoViewProps, UxUtils, ProgressState } from '@sharedUI';
import { fetchActionInstanceRows, showResponseView, fetchMyResponse } from '../../actions/SummaryActions';
import getStore, { ResponsesListViewType } from "../../store/summary/Store";
import { Loader, Flex, Text, Icon } from '@stardust-ui/react';
import { observer } from 'mobx-react';
import * as ActionSDK from "@actionSDK";
import { MyResponsesListView } from '../myResponses/MyResponsesListView';
import { listViewRowHeight } from "../../common/Constants";
import { FocusZone } from '@stardust-ui/react/dist/es/lib/accessibility/FocusZone';

@observer
export class ResponderView extends React.Component<any, any> {

    private threshHoldRow: number = 5;
    private rowsWithUser: IUserInfoViewProps[] = [];

    componentWillMount() {
        if (getStore().responseViewType === ResponsesListViewType.AllResponses && getStore().actionInstanceRows.length == 0) {
            fetchActionInstanceRows();
        } else if (getStore().responseViewType === ResponsesListViewType.MyResponses && getStore().myRows.length == 0) {
            fetchMyResponse();
        }
    }

    private onRowRender(type: RecyclerViewType, index: number, props: IUserInfoViewProps, status: ProgressState, dataSourceFetchCallback): JSX.Element {
        if ((index + this.threshHoldRow) > getStore().actionInstanceRows.length &&
            status !== ProgressState.Failed) {
            dataSourceFetchCallback();
        }

        if (type == RecyclerViewType.Footer) {
            if (status === ProgressState.Failed) {
                return (
                    <Flex vAlign="center" hAlign="center" gap="gap.small" {...UxUtils.getTabKeyProps()} onClick={() => {
                        dataSourceFetchCallback();
                    }}>
                        <Text content={ActionSDK.Localizer.getString("ResponseFetchError")}></Text>
                        <Icon name="retry" />
                    </Flex>
                );
            } else if (status === ProgressState.InProgress) {
                return <Loader />;
            }
        } else {
            return <UserInfoView {...props}
                onClick={() => {
                    showResponseView(index, getStore().actionInstanceRows);
                }} />
        }
    }

    render() {
        this.rowsWithUser = [];
        if (getStore().responseViewType === ResponsesListViewType.AllResponses) {
            for (var row of getStore().actionInstanceRows) {
                this.addUserInfoProps(row, false);
            }

            return (
                <FocusZone className="zero-padding" isCircularNavigation={true}>
                    <Flex column
                        className="list-container"
                        gap="gap.small">
                        <RecyclerViewComponent
                            data={this.rowsWithUser}
                            rowHeight={listViewRowHeight}
                            showFooter={getStore().progressStatus.actionInstanceRow.toString()}
                            onRowRender={(type: RecyclerViewType, index: number, props: IUserInfoViewProps): JSX.Element => {
                                return this.onRowRender(type, index, props,
                                    getStore().progressStatus.actionInstanceRow, fetchActionInstanceRows);
                            }} />
                    </Flex>
                </FocusZone>
            );
        } else {
            return (
                <MyResponsesListView
                    locale={getStore().context ? getStore().context.locale : ActionSDK.Utils.DEFAULT_LOCALE}
                    onRowClick={(index, dataSource) => {
                        showResponseView(index, dataSource);
                    }} />
            );
        }
    }

    private addUserInfoProps(row: ActionSDK.ActionInstanceRow, showDivider: boolean): void {
        if (!row || !getStore().actionInstance) {
            return;
        }
        var userProfile: ActionSDK.UserProfile = getStore().userProfile[row.creatorId];
        let dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
        let userProps: Partial<IUserInfoViewProps> = {
            date: UxUtils.formatDate(new Date(row.updateTime),
                (getStore().context && getStore().context.locale) ? getStore().context.locale : ActionSDK.Utils.DEFAULT_LOCALE, dateOptions),
            showBelowDivider: showDivider
        }

        if (userProfile) {
            userProps.userName = userProfile.displayName ? userProfile.displayName : ActionSDK.Localizer.getString("UnknownMember");
            userProps.accessibilityLabel = ActionSDK.Localizer.getString("ResponderAccessibilityLabel", userProps.userName, userProps.date);
            if (userProfile.profilePhoto) {
                userProps.pictureUrl = `data:${userProfile.profilePhoto.type};base64,${userProfile.profilePhoto.base64Photo}`
            }
        } else if (getStore().context.userId == row.creatorId) {
            userProps.userName = ActionSDK.Localizer.getString("You");;
        }

        userProps.userName = userProps.userName ? userProps.userName : "";

        this.rowsWithUser.push(userProps as IUserInfoViewProps);
    }
}