import * as React from 'react';
import { RecyclerViewComponent, UserInfoView, IUserInfoViewProps, RecyclerViewType, ProgressState } from '@sharedUI';
import getStore from "../../store/summary/Store";
import { Flex, Loader, Text } from '@stardust-ui/react';
import { observer } from 'mobx-react';
import { fetchNonResponders } from '../../actions/SummaryActions';
import * as ActionSDK from "@actionSDK";
import { FocusZone } from '@stardust-ui/react/dist/es/lib/accessibility/FocusZone';

@observer
export class NonResponderView extends React.Component {
    componentWillMount() {
        fetchNonResponders();
    }

    render() {
        var rowsWithUser: IUserInfoViewProps[] = [];
        if (getStore().progressStatus.nonResponder != ProgressState.Completed &&
            getStore().progressStatus.nonResponder != ProgressState.Failed) {
            return <Loader />;
        }
        if (getStore().progressStatus.nonResponder == ProgressState.Failed) {
            return (
                <Text className="error" content={ActionSDK.Localizer.getString("SomethingWentWrong")} />
            );
        }
        if (getStore().progressStatus.nonResponder == ProgressState.Completed) {
            for (var userProfile of getStore().nonResponders.nonResponders) {
                userProfile = getStore().userProfile[userProfile.id];

                if (userProfile) {
                    var profilePicBase64String: string = null;
                    if (userProfile.profilePhoto) {
                        profilePicBase64String = `data:${userProfile.profilePhoto.type};base64,${userProfile.profilePhoto.base64Photo}`
                    }
                    rowsWithUser.push({
                        userName: userProfile.displayName ? userProfile.displayName : ActionSDK.Localizer.getString("UnknownMember"),
                        pictureUrl: profilePicBase64String,
                        accessibilityLabel: userProfile.displayName
                    });
                }
            }
        }
        return (
            <FocusZone className="zero-padding" isCircularNavigation={true}>
                <Flex column
                    className="list-container"
                    gap="gap.small">
                    <RecyclerViewComponent
                        data={rowsWithUser}
                        rowHeight={48}
                        onRowRender={(type: RecyclerViewType, index: number, props: IUserInfoViewProps): JSX.Element => {
                            return <UserInfoView {...props} />
                        }} />
                </Flex>
            </FocusZone>
        );
    }
}