import * as React from 'react';
import { Loader, Flex, Text, Button, Icon, Dialog } from '@stardust-ui/react';
import "../../css/homeview.scss";
import { RecyclerViewComponent, RecyclerViewType, InitializationState, LoaderUI, UxUtils } from '@sharedUI';
import * as ActionSDK from "@actionSDK";
import { ChannelPickerListView, IGroupProps } from "./ChannelPickerListView";
import getStore, { Page } from "../../store/creation/Store";
import { toJS } from 'mobx';
import { observer } from "mobx-react";
import { setContext, getTeamsGroupAndChannels, setChannelPickerDialogOpen } from '../../actions/CreationActions';
import { FocusZone, FocusZoneDirection } from '@stardust-ui/react/dist/es/lib/accessibility/FocusZone';

export interface IChannelPickerProps {
    setGroupChannelId: (arg1: string, arg2: string) => void;
}

interface IChannelPickerState {
    selectedGroupId: string;
    selectedChannelId: string;
    rowHeight: number;
    showError: boolean;
}

@observer
export class ChannelPicker extends React.Component<IChannelPickerProps, IChannelPickerState>{
    constructor(props) {
        super(props);
        this.state = {
            selectedGroupId: "",
            selectedChannelId: "",
            rowHeight: 1,
            showError: false
        }
    }
    private groupInstance: IGroupProps[] = [];

    componentWillMount() {
        getTeamsGroupAndChannels();
    }

    private sendSurveyToChannel() {
        if (this.state.selectedChannelId.length == 0)
            this.setState({ showError: true });
        else {
            setChannelPickerDialogOpen(false);
            this.props.setGroupChannelId(this.state.selectedGroupId, this.state.selectedChannelId);
        }
    }

    render() {
        this.groupInstance = [];
        ActionSDK.APIs.actionViewDidLoad(true /*success*/);
        if (getStore().teamsGroupInitialized === InitializationState.NotInitialized) {
            return <LoaderUI fill />;
        }
        else if (getStore().initPending) {
            ActionSDK.APIs.getCurrentContext()
                .then((context: ActionSDK.ActionContext) => {
                    setContext(context);
                });
            return <Loader />;
        }
        for (var groupInfo of getStore().teamsGroups) {
            this.addGroupInfo(toJS(groupInfo));
        }
        return (
            <Dialog className="personal-picker-dialog"
                open={getStore().openChannelPickerDialog}
                overlay={{
                    className: "channel-picker-dialog-overlay"
                }}
                content={
                    <Flex column gap="gap.small">
                        <Flex>
                            <Text weight="bold" content={ActionSDK.Localizer.getString("ChooseChannel")} size="large" className="choose-channel" tabIndex={0} />
                            <Flex.Item push>
                                <Icon name="close"
                                    onClick={() =>
                                        setChannelPickerDialogOpen(false)
                                    }
                                    {...UxUtils.getTabKeyProps()}
                                />
                            </Flex.Item>
                        </Flex>
                        <Text content={ActionSDK.Localizer.getString("PickChannel")} size="small" tabIndex={0} />
                        <FocusZone direction={FocusZoneDirection.bidirectional} className="zero-padding" isCircularNavigation={true}>
                            {this.state.showError ?
                                <Text content={ActionSDK.Localizer.getString("PleaseSelectAChannel")} style={{ color: "red" }} /> : null}
                            <Flex className="channel-picker-layout">
                                <RecyclerViewComponent
                                    data={this.groupInstance}
                                    rowHeight={this.state.rowHeight}
                                    nonDeterministicRendering={true}
                                    onRowRender={(type: RecyclerViewType, index: number, props: IGroupProps): JSX.Element => {
                                        return <ChannelPickerListView {...props} />;
                                    }} />
                            </Flex>
                        </FocusZone>
                        <Flex.Item align="end">
                            <Button content={ActionSDK.Localizer.getString("Send")} primary
                                onClick={() =>
                                    this.sendSurveyToChannel()}
                            />
                        </Flex.Item>
                    </Flex>
                }
            />
        );
    }

    private addGroupInfo(groupInfo: ActionSDK.TeamsGroup): void {

        let groupProps: Partial<IGroupProps> = {
            groupName: groupInfo.dispNm,
            groupId: groupInfo.id,
            channelList: groupInfo.channelList,
            onChannelSelection: (channelId: string, groupId: string) => {
                this.setState({ selectedChannelId: channelId, selectedGroupId: groupId, showError: false })
            },
            selectedChannelId: this.state.selectedChannelId,
            setRowHeight: (height: number) => this.setState({ rowHeight: height })
        }
        this.groupInstance.push(groupProps as IGroupProps);
    }
}