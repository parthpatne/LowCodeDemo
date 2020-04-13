import * as React from "react";
import { ChoiceContainer, IChoiceContainerOption, UxUtils, IChoiceContainerStrings } from "@sharedUI";
import '../../../css/Creation.scss';
import { Checkbox, Flex, Divider, Icon } from '@stardust-ui/react';
import * as ActionSDK from "@actionSDK";
import { updateQuestion, setValidationMode } from "../../../actions/CreationActions";
import { isEmptyOrNull } from '../../../common/Utils';
import { toJS } from 'mobx';


export interface IMCQComponentProps {
    question: ActionSDK.ActionInstanceColumn;
    isValidationModeOn: boolean;
    questionIndex: number;
    onChange?: (props: IMCQComponentProps) => void;
}

export interface IMCQComponentState {
    options: ActionSDK.ActionInstanceColumnOption[];
}

export class MCQComponent extends React.Component<IMCQComponentProps, IMCQComponentState> {

    constructor(props: IMCQComponentProps) {
        super(props);
        this.state = {
            options: JSON.parse(JSON.stringify(this.props.question.options))
        }
    }

    getOptions = () => {
        let choiceOptions = [];
        const choicePrefix = <Icon name="stardust-circle" outline size="small" className="choice-item-circle" />;
        let i = 0;
        this.state.options.forEach((option) => {
            const choiceOption: IChoiceContainerOption = {
                value: option.title,
                choicePrefix: choicePrefix,
                choicePlaceholder: ActionSDK.Localizer.getString("Choice", (i + 1)),
                deleteChoiceLabel: ActionSDK.Localizer.getString("DeleteChoiceX", i + 1)
            }
            choiceOptions.push(choiceOption);
            i++;
        });
        return choiceOptions;
    }

    generateOptionsErrorData(options: ActionSDK.ActionInstanceColumnOption[]): string[] {
        var optionsError: string[] = [];
        if (options.length < 2) return optionsError;
        for (var option of options) {
            if (isEmptyOrNull(option.title)) {
                optionsError.push(ActionSDK.Localizer.getString("Required"));
            } else {
                optionsError.push("");
            }
        }
        return optionsError;
    }

    updateQuestion = () => {
        if (JSON.stringify(this.props.question.options) !== JSON.stringify(this.state.options)) {
            let questionCopy: ActionSDK.ActionInstanceColumn = { ...this.props.question };
            questionCopy.options = [...this.state.options];
            updateQuestion(this.props.questionIndex, questionCopy);
        }
    }

    render() {
        let choices = this.getOptions();
        let thisProps: IMCQComponentProps = {
            question: { ...this.props.question },
            isValidationModeOn: this.props.isValidationModeOn,
            questionIndex: this.props.questionIndex
        };
        let optionsError: string[] = ["", ""];
        if (thisProps.isValidationModeOn) {
            optionsError = this.generateOptionsErrorData(thisProps.question.options);
        }
        return (
            <div className="left-space" onBlur={(e) => {
                this.updateQuestion();
            }}>
                <ChoiceContainer
                    optionsError={optionsError}
                    strings={this.getStringsForChoiceComponent()}
                    title=''
                    options={choices}
                    onDeleteChoice={(i) => {
                        let optionsCopy: ActionSDK.ActionInstanceColumnOption[] = [...this.state.options];
                        optionsCopy.splice(i, 1);
                        for (i; i < optionsCopy.length; i++) {
                            optionsCopy[i].id = i.toString();
                        }
                        this.setState(
                            { options: optionsCopy },
                            () => { this.updateQuestion(); }
                        );
                    }}
                    onUpdateChoice={(i, value) => {
                        let optionsCopy: ActionSDK.ActionInstanceColumnOption[] = [...this.state.options];
                        optionsCopy[i].title = value;
                        this.setState({
                            options: optionsCopy
                        });
                    }}
                    onAddChoice={() => {
                        let option: ActionSDK.ActionInstanceColumnOption = {
                            id: thisProps.question.options.length.toString(),
                            title: ""
                        }
                        let optionsCopy: ActionSDK.ActionInstanceColumnOption[] = [...this.state.options];
                        optionsCopy.push(option);
                        this.setState({
                            options: optionsCopy
                        });
                    }}
                    className="left-zero"
                    limit={10}
                    inputClassName='invalid-error'
                />
                <Divider className="question-divider" />
                <Flex className="MCQ-setting" gap="gap.large">
                    <Checkbox
                        className="MCQ-setting-item"
                        label={ActionSDK.Localizer.getString("MultipleAnswers")}
                        checked={this.props.question.type === ActionSDK.ActionInstanceColumnType.MultiOption}
                        onChange={(e, data) => {
                            thisProps.question.type = data.checked ? ActionSDK.ActionInstanceColumnType.MultiOption : ActionSDK.ActionInstanceColumnType.SingleOption;
                            this.props.onChange(thisProps);
                        }} />
                    <Checkbox
                        className="MCQ-setting-item"
                        checked={!this.props.question.isOptional}
                        label={ActionSDK.Localizer.getString("Required")}
                        onChange={(e, data) => {
                            thisProps.question.isOptional = !(data.checked);
                            this.props.onChange(thisProps);
                        }} />
                </Flex>
            </div>
        );
    }

    getStringsForChoiceComponent(): IChoiceContainerStrings {
        let choiceContainerStrings: IChoiceContainerStrings = {
            addChoice: ActionSDK.Localizer.getString("AddChoice")
        }
        return choiceContainerStrings;
    }
}
