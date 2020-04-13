import * as React from "react";
import { Icon, Flex } from "@stardust-ui/react";
import "./Rating.scss";
import { UxUtils } from '@sharedUI';
import * as ActionSDK from "@actionSDK";

export interface IStarRatingViewProps {
    max: number;
    icon?: string;
    defaultValue: number;
    disabled?: boolean;
    isPreview?: boolean;
    onChange?: (value: number) => void;
}

interface IState {
    value: number;
}

export class StarRatingView extends React.PureComponent<IStarRatingViewProps, IState> {

    constructor(props: IStarRatingViewProps) {
        super(props);
        this.state = {
            value: props.defaultValue
        }
    }

    static getDerivedStateFromProps(props: IStarRatingViewProps, state) {
        return {
            value: props.defaultValue
        };
    }

    render() {
        let items: JSX.Element[] = [];
        for (let i = 1; i <= this.props.max; i++) {
            let className = this.state.value < i ? 'rating-icon-unfilled' : 'rating-icon';
            className = (this.props.disabled && this.state.value >= i) ? className + " disabled-rating" : className;
            if (!this.props.isPreview && !this.props.disabled) {
                className = className + " pointer-cursor";
            }
            let isAccessibilityDisabled: boolean = this.props.disabled || this.props.isPreview;
            items.push(
                <Icon
                    role="button"
                    {...(!isAccessibilityDisabled) && UxUtils.getTabKeyProps()}
                    aria-label={i <= this.state.value ? ActionSDK.Localizer.getString("StarValueSelected", i) : ActionSDK.Localizer.getString("StarValue", i)}
                    key={i}
                    name={this.props.icon ? this.props.icon : "star"}
                    outline={this.state.value < i}
                    disabled={this.props.disabled && !this.props.isPreview}
                    aria-disabled={isAccessibilityDisabled}
                    onClick={isAccessibilityDisabled ? null : () => {
                        ActionSDK.Utils.announceText(ActionSDK.Localizer.getString("StarNumberSelected", i));
                        this.setState({ value: i });
                        this.props.onChange(i);
                    }}
                    className={className}
                />
            );
        }
        return (
            <Flex gap="gap.medium">
                {items}
            </Flex>
        );
    }
}
