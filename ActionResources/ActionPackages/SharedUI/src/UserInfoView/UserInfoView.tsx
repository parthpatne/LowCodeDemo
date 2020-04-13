import * as React from "react";
import { Flex, FlexItem, Text, Avatar, Divider, Icon } from "@stardust-ui/react";
import { UxUtils } from '@sharedUI';
import { Utils } from '@actionCommon';
import './UserInfoView.scss';

export interface IUserInfoViewProps {
    userName: string;
    subtitle?: string;
    date?: string;
    pictureUrl?: string;
    accessibilityLabel?: string;
    showBelowDivider?: boolean;
    onClick?: () => void;
}

export class UserInfoView extends React.PureComponent<IUserInfoViewProps> {

    render() {
        return (
            <>
                <Flex aria-label={this.props.accessibilityLabel} className="user-info-view overflow-hidden" vAlign="center" gap="gap.small" onClick={this.props.onClick} {...UxUtils.getListItemProps()}>
                    <Avatar className="user-profile-pic" name={this.props.userName} image={this.props.pictureUrl} size="medium" aria-hidden="true" />
                    <Flex aria-hidden={!Utils.isEmptyString(this.props.accessibilityLabel)} column className="overflow-hidden">
                        <Text truncated size="medium">{this.props.userName}</Text>
                        {this.props.subtitle &&
                            <Text truncated size="small">{this.props.subtitle}</Text>
                        }
                    </Flex>
                    {this.props.date && <FlexItem push>
                        <Text aria-hidden={!Utils.isEmptyString(this.props.accessibilityLabel)} className="nowrap date-grey" size="small">{this.props.date}</Text>
                    </FlexItem>}
                    {this.props.onClick &&
                        <Icon size="smallest" name="chevron-down" rotate={270} outline></Icon>
                    }
                </Flex>
                {this.props.showBelowDivider ? <Divider /> : null}
            </>
        );
    }
}
