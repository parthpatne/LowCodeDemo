import '../../css/Creation.scss';
import { UxUtils } from "@sharedUI";
import * as ActionSDK from '@actionSDK';
import { Icon, Flex } from '@stardust-ui/react';
import * as React from 'react';

import {
    deleteQuestion,
    duplicateQuestion,
    moveQuestionDown,
    moveQuestionUp,
    updateActiveQuestionIndex,
    updateQuestion,
} from '../../actions/CreationActions';
import { isQuestionValid, isEmptyOrNull } from '../../common/Utils';
import QuestionComponent, { IQuestionComponentProps } from './questionContainer/QuestionComponent';
import { ResponseViewMode } from '../../store/response/Store';
import ResponseView from '../response/ResponseView';


export interface IQuestionContainerProps {
    questions: ActionSDK.ActionInstanceColumn[];
    activeQuestionIndex: number;
    isValidationModeOn: boolean;
    className?: string;
}

export class QuestionContainer extends React.Component<IQuestionContainerProps> {

    private shouldFocus = false;
    private isQuestionTitleBoxClicked = false;

    shouldComponentUpdate(props: any, nextState: any) {
        //should focus on title only when question title box is clicked and active question index is changed 
        //or a new question is added
        if (this.props.activeQuestionIndex !== props.activeQuestionIndex && this.isQuestionTitleBoxClicked
            || this.props.questions.length < props.questions.length) {
            this.shouldFocus = true;
            this.isQuestionTitleBoxClicked = false;
        } else {
            this.shouldFocus = false;
        }
        return true;
    }

    private getTitleContentView(index: number, question: ActionSDK.ActionInstanceColumn): JSX.Element {
        let questionPreview: JSX.Element = (
            <div
                key={"question" + index}
                className={(this.props.isValidationModeOn && !isQuestionValid(question) ? 'questionPaneTitle invalid' : 'questionPaneTitle')}
                {...UxUtils.getListItemProps()}
                onClick={(e) => {
                    this.isQuestionTitleBoxClicked = true;
                    updateActiveQuestionIndex(index);
                }}>
                <ResponseView
                    questionNumber={index + 1}
                    actionInstanceColumn={question}
                    responseState={ResponseViewMode.CreationPreview}
                />
            </div>);
        return questionPreview;
    }

    private getContentView(index: number, question: ActionSDK.ActionInstanceColumn) {
        return (
            <div key={"question" + index} className={(this.props.isValidationModeOn && !isQuestionValid(question) ? 'question-box invalid' : 'question-box')}>
                <div className="question-controls">
                    <Icon
                        name="canvas-add-page"
                        {...UxUtils.getTabKeyProps()}
                        title={ActionSDK.Localizer.getString("DuplicateQuestion")}
                        aria-label={ActionSDK.Localizer.getString("DuplicateQuestion")}
                        outline xSpacing="after"
                        className="pointer-cursor"
                        onClick={() => {
                            duplicateQuestion(index);
                        }} />

                    <Icon
                        name="trash-can"
                        {...UxUtils.getTabKeyProps()}
                        title={ActionSDK.Localizer.getString("DeleteQuestion")}
                        aria-label={ActionSDK.Localizer.getString("DeleteQuestion")}
                        outline
                        xSpacing="after"
                        className="pointer-cursor" onClick={() => {
                            deleteQuestion(index);
                        }} />

                    <Icon
                        name="arrow-up"
                        {...(index != 0 && UxUtils.getTabKeyProps())}
                        role="button"
                        title={ActionSDK.Localizer.getString("MoveQuestionUp")}
                        aria-label={ActionSDK.Localizer.getString("MoveQuestionUp")}
                        xSpacing="after"
                        className={index !== 0 ? "pointer-cursor" : ""}
                        disabled={index === 0}
                        aria-disabled={index === 0}
                        onClick={index !== 0 ? () => {
                            moveQuestionUp(index);
                            ActionSDK.Utils.announceText("QuestionMovedUp");
                        } : null} />

                    <Icon
                        name="arrow-down"
                        {...(index != this.props.questions.length - 1 && UxUtils.getTabKeyProps())}
                        role="button"
                        title={ActionSDK.Localizer.getString("MoveQuestionDown")}
                        aria-label={ActionSDK.Localizer.getString("MoveQuestionDown")}
                        xSpacing="after"
                        className={index !== this.props.questions.length - 1 ? "pointer-cursor" : ""}
                        disabled={index === this.props.questions.length - 1}
                        aria-disabled={index === this.props.questions.length - 1}
                        onClick={index !== this.props.questions.length - 1 ? () => {
                            moveQuestionDown(index);
                            ActionSDK.Utils.announceText("QuestionMovedDown");
                        } : null} />
                </div>
                <QuestionComponent
                    isValidationModeOn={this.props.isValidationModeOn}
                    onChange={(props: IQuestionComponentProps) => {
                        updateQuestion(index, props.question);
                    }}
                    question={question}
                    questionIndex={index}
                    shouldFocusOnTitle={index === this.props.activeQuestionIndex && this.shouldFocus}
                    renderForMobile={false}
                />
            </div>
        );
    }

    render() {
        const questions: ActionSDK.ActionInstanceColumn[] = this.props.questions;
        let questionsView: JSX.Element[] = [];
        for (let i = 0; i < questions.length; i++) {
            let question: ActionSDK.ActionInstanceColumn = { ...questions[i] };
            if (i === this.props.activeQuestionIndex) {
                questionsView.push(this.getContentView(i, question));
            } else {
                questionsView.push(this.getTitleContentView(i, question));
            }
        }

        return (
            <Flex column>
                {questionsView}
            </Flex>
        );
    }
}
