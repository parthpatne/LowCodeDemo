import * as React from 'react';
import { Text, Flex } from '@stardust-ui/react';
import '../../../css/Response.scss';
import * as ActionSDK from "@actionSDK";
import { UxUtils } from "@sharedUI";

export interface IRatingAnswerProps extends IQuestionProps {
    count: number;
    icon?: string;
}

export interface IMultiChoiceProps extends IQuestionProps {
    options: ActionSDK.ActionInstanceColumnOption[]
}

export interface IQuestionProps {
    questionNumber: number;
    questionText: string;
    required?: boolean
    editable?: boolean;
    response?: any;
    isPreview?: boolean;
    locale?: string;
    updateResponse?: (response: any) => void;
}

export class QuestionView extends React.Component<IQuestionProps> {

    private getQuestionText = () => {
        if (this.props.questionText) {
            return this.props.questionText;
        }
        return ActionSDK.Localizer.getString("QuestionTitlePlaceHolder");
    }

    //Adding this prop to stop announcing 2 times on android phone
    private getAccessibilityProps = () => {
        if (UxUtils.renderingForAndroid()) {
            return {
                role: "group"
            }
        }
    }

    render() {
        let className = "question-view-title break-word";
        return (
            <Flex gap='gap.small' {...this.getAccessibilityProps()}>
                <Flex className="question-number-text">
                    <Text content={this.props.questionNumber + ". "} className="question-view-title" />
                </Flex>
                <Flex gap="gap.smaller" className="question-view-content" column fill>
                    {this.props.required ?
                        <div aria-label={this.getQuestionText() + " " + ActionSDK.Localizer.getString("Required")}>
                            <Text className={className} content={this.getQuestionText()} aria-hidden={true} />
                            <span className="required-color" aria-hidden={true}> *</span>
                        </div>
                        : <Text className={className} content={this.getQuestionText()} />}
                    {this.props.children}
                </Flex>
            </Flex>
        )
    }
}