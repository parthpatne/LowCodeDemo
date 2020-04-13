import * as React from 'react';
import { Flex, Text, Icon, RadioGroup, Avatar } from "@stardust-ui/react";
import * as ActionSDK from "@actionSDK";
import { toJS } from 'mobx';
import { UxUtils, Constants } from '@sharedUI';
import { FocusTrapZone } from '@stardust-ui/react/dist/es/lib/accessibility/FocusZone';

export interface IGroupProps {
    groupName: string;
    groupId: string;
    channelList: ActionSDK.TeamsChannel[];
    onChannelSelection: (arg1: string, arg2: string) => void;
    selectedChannelId: string;
    setRowHeight: (arg: number) => void;
}

interface IRadioItems {
    key: string;
    name: string;
    label: string;
    value: string;
}

interface IChannelPickerListViewState {
    rotateIcon: number;
    showExpandedRow: boolean;
}

export class ChannelPickerListView extends React.PureComponent<IGroupProps, IChannelPickerListViewState>{
    private channelItems: IRadioItems[] = [];
    constructor(props) {
        super(props);
        Array.from(this.props.channelList);
        toJS(this.props.channelList).map((channel) => (this.setChannelList(channel)))
        this.state = {
            rotateIcon: 0,
            showExpandedRow: false,
        }
    }

    private setIconDirection() {
        this.setState({
            rotateIcon: (180 - this.state.rotateIcon),
            showExpandedRow: !this.state.showExpandedRow
        },
            () => {
                if (this.state.showExpandedRow) {
                    this.props.setRowHeight(this.props.channelList.length);
                }
                else {
                    this.props.setRowHeight(1);
                }
            }
        );
    }

    private setChannelList(channel) {
        let items: Partial<IRadioItems> = {
            key: channel.id,
            label: channel.dispNm,
            value: channel.id
        }

        this.channelItems.push(items as IRadioItems);
    }

    render() {
        return (
            <Flex column className="channel-picker-body" gap="gap.small">
                <Flex className="channel-picker-item" gap="gap.small" vAlign="center"
                    onClick={() =>
                        this.setIconDirection()
                    }
                    {...UxUtils.getListItemProps()}
                >
                    <Avatar name={this.props.groupName} size="medium" />

                    <Text content={this.props.groupName} weight="semibold" />

                    <Icon name="chevron-down" size="smaller" rotate={this.state.rotateIcon} className="channel-picker-down-icon" />

                </Flex>
                {this.state.showExpandedRow ?
                    <Flex column >
                        <FocusTrapZone
                            onKeyDown={(e) => {
                                if (!e.repeat && (e.keyCode || e.which) == Constants.ESCAPE_ASCII_VALUE && this.state.showExpandedRow) {
                                    this.setIconDirection()
                                }
                            }}>
                            <RadioGroup className="channel-picker-radio-button"
                                {...UxUtils.getTabKeyPropsRoleRadio()}
                                vertical
                                items={this.channelItems}
                                checkedValueChanged={this.handleChange}
                                checkedValue={this.props.selectedChannelId}
                            />
                        </FocusTrapZone>
                    </Flex>
                    : null
                }
            </Flex >
        );
    }

    private handleChange = (e, selectedItem) => {
        this.props.onChannelSelection(selectedItem.value, this.props.groupId)
    }
}