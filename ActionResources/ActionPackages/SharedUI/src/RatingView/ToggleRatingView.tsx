import * as React from "react";
import { Icon, Flex } from "@stardust-ui/react";
import './Rating.scss';
import { UxUtils } from '@sharedUI';
import * as ActionSDK from "@actionSDK";


export interface IToggleRatingViewProps {
    defaultValue?: boolean;
    disabled?: boolean;
    isPreview?: boolean;
    onChange?: (value: boolean) => void;
}

interface IState {
    value: boolean;
}

export class ToggleRatingView extends React.PureComponent<IToggleRatingViewProps, IState> {

    constructor(props: IToggleRatingViewProps) {
        super(props);
        this.state = {
            value: props.defaultValue
        }
    }

    static getDerivedStateFromProps(props: IToggleRatingViewProps, state) {
        return {
            value: props.defaultValue
        };
    }

    private onChange(value: boolean) {
        if (!this.props.disabled) {
            this.setState({ value: value });
            this.props.onChange(value);
        }
    }

    render() {
        let className = "rating-icon";
        if (this.props.disabled) {
            className = className + " disabled-rating";
        } else if (!this.props.isPreview) {
            className = className + " pointer-cursor";
        }
        let isAccessibilityDisabled: boolean = this.props.isPreview || this.props.disabled;
        return (
            <Flex gap="gap.medium">
                <Icon
                    aria-label={this.state.value ? ActionSDK.Localizer.getString("LikeTextSelected") : ActionSDK.Localizer.getString("LikeText")}
                    {...(!isAccessibilityDisabled) && UxUtils.getTabKeyProps()}
                    name="like"
                    outline={this.state.value != true}
                    size="medium"
                    role="button"
                    disabled={this.props.disabled && !this.props.isPreview}
                    aria-disabled={isAccessibilityDisabled}
                    onClick={isAccessibilityDisabled ? null : () => {
                        this.onChange(true);
                    }}
                    className={this.state.value === true ? className : ''} />

                <Icon
                    aria-label={this.state.value === false ? ActionSDK.Localizer.getString("DislikeTextSelected") : ActionSDK.Localizer.getString("DislikeText")}
                    {...(!isAccessibilityDisabled) && UxUtils.getTabKeyProps()}
                    name="like"
                    role="button"
                    outline={this.state.value != false}
                    rotate={180}
                    disabled={this.props.disabled && !this.props.isPreview}
                    aria-disabled={isAccessibilityDisabled}
                    size="medium"
                    onClick={isAccessibilityDisabled ? null : () => {
                        this.onChange(false);
                    }}
                    className={this.state.value === false ? className : ''} />
            </Flex>
        );
    }
}
