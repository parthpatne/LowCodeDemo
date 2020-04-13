import * as React from 'react'
import { Checkbox, Flex, Input, Text, Divider } from '@stardust-ui/react';
import { MCQComponent } from './MultiChoiceQuestion';
import { RatingsQuestionComponent } from './RatingsQuestionComponent';
import { QuestionDisplayType } from '../../../common/QuestionDisplayType';
import * as ActionSDK from "@actionSDK";
import '../../../css/Creation.scss';
import { InputBox } from '@sharedUI';
import { updateQuestion, setValidationMode } from '../../../actions/CreationActions';
import { observer } from 'mobx-react';
import { isEmptyOrNull } from '../../../common/Utils';

export interface IQuestionComponentProps {
    question: ActionSDK.ActionInstanceColumn;
    isValidationModeOn: boolean;
    questionIndex: number;
    shouldFocusOnTitle?: boolean;
    renderForMobile: boolean;
    onChange?: (props: IQuestionComponentProps) => void;
}

@observer
export default class QuestionComponent extends React.Component<IQuestionComponentProps> {
    constructor(props: IQuestionComponentProps) {
        super(props);
    }

    private getCalendarIcon() {
        return {
            name: 'calendar',
            outline: true,
        };
    }

    private getQuestionBase(placeholder: string, thisProps: any, icon?: any) {
        return (
            <Flex column className="question-base" gap="gap.medium">
                <Input disabled placeholder={placeholder} fluid icon={icon} className="question-item" />
                <Divider className="question-divider" />
                <Checkbox checked={!(this.props.question.isOptional)} label={ActionSDK.Localizer.getString("Required")} onChange={(e, data) => {
                    thisProps.question.isOptional = !(data.checked);
                    this.props.onChange(thisProps);
                }} className="required-question-checkbox" />
            </Flex>
        );
    }

    getDisplayType(question: ActionSDK.ActionInstanceColumn) {
        let customProperties = JSON.parse(question.customProperties);
        if (customProperties && customProperties.hasOwnProperty("dt")) {
            return customProperties.dt;
        }
        return QuestionDisplayType.None;
    }

    getQuestionView() {
        let thisProps: IQuestionComponentProps = {
            question: { ...this.props.question },
            isValidationModeOn: this.props.isValidationModeOn,
            questionIndex: this.props.questionIndex,
            renderForMobile: this.props.renderForMobile
        };
        if (this.props.question.type === ActionSDK.ActionInstanceColumnType.SingleOption) {
            let displayType = this.getDisplayType(this.props.question);
            if (displayType === QuestionDisplayType.FiveStar ||
                displayType === QuestionDisplayType.TenStar ||
                displayType === QuestionDisplayType.LikeDislike ||
                displayType === QuestionDisplayType.FiveNumber ||
                displayType === QuestionDisplayType.TenNumber) {
                return (
                    <RatingsQuestionComponent renderForMobile={thisProps.renderForMobile}
                        onChange={(props: IQuestionComponentProps) => {
                            this.props.onChange(props);
                        }} question={this.props.question} questionIndex={thisProps.questionIndex} />
                );
            }
            if (displayType === QuestionDisplayType.Select) {
                return (
                    <MCQComponent isValidationModeOn={this.props.isValidationModeOn} onChange={(props: IQuestionComponentProps) => {
                        this.props.onChange(props);
                    }} question={this.props.question} questionIndex={this.props.questionIndex}>
                    </MCQComponent>
                );
            }
        }
        if (this.props.question.type === ActionSDK.ActionInstanceColumnType.MultiOption) {
            return (
                <MCQComponent isValidationModeOn={this.props.isValidationModeOn} onChange={(props: IQuestionComponentProps) => {
                    this.props.onChange(props);
                }} question={this.props.question} questionIndex={this.props.questionIndex}>
                </MCQComponent>
            );
        }

        if (this.props.question.type === ActionSDK.ActionInstanceColumnType.Numeric) {
            return this.getQuestionBase(ActionSDK.Localizer.getString("EnterNumber"), thisProps);
        }
        if (this.props.question.type === ActionSDK.ActionInstanceColumnType.Date) {
            return this.getQuestionBase(ActionSDK.Localizer.getString("EnterDate"), thisProps, this.getCalendarIcon());
        }
        if (this.props.question.type === ActionSDK.ActionInstanceColumnType.Text) {
            return this.getQuestionBase(ActionSDK.Localizer.getString("EnterAnswer"), thisProps);
        }

        return (<Checkbox checked={!(this.props.question.isOptional)} label={ActionSDK.Localizer.getString("Required")} onChange={(e, data) => {
            thisProps.question.isOptional = !(data.checked);
            this.props.onChange(thisProps);
        }} />);
    }

    render() {
        let question: ActionSDK.ActionInstanceColumn = { ...this.props.question };
        return (
            <Flex gap="gap.smaller" className="question-component">
                {!this.props.renderForMobile && <Text content={(this.props.questionIndex + 1) + "."} weight="bold" />}
                <Flex column fill className="zero-min-width">
                    <div className="question-text">
                        <InputBox
                            ref={(inputBox) => {
                                if (inputBox && this.props.shouldFocusOnTitle) {
                                    setTimeout(() => {
                                        inputBox.focus();
                                    }, 0);
                                }
                            }}
                            className={(this.props.isValidationModeOn && question.title.length == 0 ? 'invalid' : '')}
                            fluid
                            key={this.props.questionIndex + question.title}
                            defaultValue={question.title}
                            placeholder={ActionSDK.Localizer.getString("QuestionTitlePlaceHolder")}
                            onBlur={(e) => {
                                if ((e.target as HTMLInputElement).value !== question.title) {
                                    question.title = (e.target as HTMLInputElement).value;
                                    updateQuestion(this.props.questionIndex, question);
                                }
                            }
                            }
                            showError={(this.props.isValidationModeOn && question.title.length == 0)}
                            errorText={ActionSDK.Localizer.getString("EmptyQuestionTitle")}
                            input={{
                                className: (this.props.isValidationModeOn && question.title.length == 0 ? 'invalid-error' : '')
                            }}
                        />
                    </div>
                    {this.getQuestionView()}
                </Flex>
            </Flex>
        )
    }
}