import * as React from "react";
import { Flex, Box, Text } from "@stardust-ui/react";
import './Rating.scss';
import { UxUtils } from '@sharedUI';
import * as ActionSDK from "@actionSDK";

export interface IScaleRatingViewProps {
    max: number;
    defaultValue: number;
    isPreview?: boolean;
    disabled?: boolean;
    onChange?: (value: number) => void;
}

interface IState {
    value: number;
}

export class ScaleRatingView extends React.PureComponent<IScaleRatingViewProps, IState> {

    static getDerivedStateFromProps(props, state) {
        return {
            value: props.defaultValue
        }
    }

    constructor(props: IScaleRatingViewProps) {
        super(props);
        this.state = {
            value: props.defaultValue
        }
    }

    render() {
        let items: JSX.Element[] = [];
        for (let i = 1; i <= this.props.max; i++) {
            let className = this.state.value < i ? 'rating-number-unfilled' : 'rating-number-filled';
            className = (this.props.disabled && this.state.value >= i) ? className + " disabled-rating" : className;
            if (!this.props.isPreview && !this.props.disabled) {
                className = className + " pointer-cursor";
            }
            let isAccessibilityDisabled: boolean = this.props.isPreview || this.props.disabled;
            items.push(
                <Box
                    {...(!isAccessibilityDisabled) && UxUtils.getTabKeyProps()}
                    role="button"
                    aria-label={i <= this.state.value ? ActionSDK.Localizer.getString("RatingValueSelected", i) : ActionSDK.Localizer.getString("RatingValue", i)}
                    aria-disabled={isAccessibilityDisabled}
                    key={i}
                    onClick={isAccessibilityDisabled ? null : () => {
                        ActionSDK.Utils.announceText(ActionSDK.Localizer.getString("RatingNumberSelected", i));
                        this.setState({ value: i });
                        this.props.onChange(i);
                    }}
                    className={className} />
            );
        }
        return (
            <Flex gap="gap.smaller" className="rating-scale">
                <Text content={1} />
                {items}
                <Text content={this.props.max} />
            </Flex>
        );
    }
}
