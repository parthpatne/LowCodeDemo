import * as React from "react";
import './GroupParticipationComponent.scss'
import { CircularChartComponent } from "../CircularChartComponent";
import { Text, Flex } from "@stardust-ui/react";

export interface IGroupParticipationProps {
    groupSize: number;
    participationCount: number;
    height?: number;
    width?: number;
}

export class GroupParticipationComponent extends React.PureComponent<IGroupParticipationProps> {

    render() {
        return (
            <Flex column gap="gap.small">
                <Text>Group Participation</Text>
                <Flex gap="gap.small" space="between" vAlign="center">
                    <CircularChartComponent
                        progress={this.props.participationCount}
                        outOf={this.props.groupSize}
                        thickness={8}
                        width={72} />
                    <Flex column>
                        <Text weight="bold">{this.props.groupSize} Participants</Text>
                        <Text >{this.props.participationCount} Responded</Text>
                    </Flex>
                </Flex>
            </Flex>
        );
    }
}
