import * as React from 'react';
import { QuestionView, IRatingAnswerProps } from './QuestionView';
import { StarRatingView } from '@sharedUI';
import * as ActionSDK from '@actionSDK';

export class StarRatingAnswerView extends React.Component<IRatingAnswerProps> {

    render() {
        const starRatingView: JSX.Element = <StarRatingView
            max={this.props.count}
            icon={this.props.icon}
            disabled={!this.props.editable}
            defaultValue={this.props.response ? this.props.response as number : 0}
            onChange={(value: number) => {
                this.props.updateResponse(value.toString());
            }}
            isPreview={this.props.isPreview}
        />;
        return (
            <QuestionView {...this.props}>
                {this.props.editable ?
                    <div aria-label={this.getAccessibilityLabel()}>{starRatingView}</div>
                    : starRatingView}
            </QuestionView>
        );
    }

    private getAccessibilityLabel = () => {
        const accessibilityLabel: string = ActionSDK.Localizer.getString("xOfyStarsSelected", this.props.response ? this.props.response as number : 0, this.props.count);
        return accessibilityLabel;
    }

}