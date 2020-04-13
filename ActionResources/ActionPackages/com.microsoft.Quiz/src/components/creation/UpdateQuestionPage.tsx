import * as React from 'react';

import * as ActionSDK from "@actionSDK";
import { INavBarComponentProps, NavBarItemType, NavBarComponent } from '@sharedUI';
import { goToPage, updateQuestion, deleteQuestion } from '../../actions/CreationActions';
import getStore, { Page } from '../../store/creation/Store';
import { Flex, Text, Divider, Icon, Button } from '@stardust-ui/react';
import { observer } from 'mobx-react';
import { isQuestionValid } from '../../common/Utils';
import QuestionComponent, { IQuestionComponentProps } from './questionContainer/QuestionComponent';
import { toJS } from 'mobx';

@observer
export class UpdateQuestionPage extends React.Component<any> {
    private questionIndex: number;
    private currentActiveIndex: number = -1;
    private shouldFocusOnTitle: boolean = false;

    render() {
        this.questionIndex = getStore().activeQuestionIndex;

        if (this.questionIndex !== this.currentActiveIndex) {
            this.shouldFocusOnTitle = true;
            this.currentActiveIndex = getStore().activeQuestionIndex;
        } else {
            this.shouldFocusOnTitle = false;
        }

        return (
            <Flex className="body-container no-mobile-footer" column>
                {this.getNavBar()}
                {this.getQuestionSection()}
                {this.getDeleteQuestionButton()}
            </Flex>
        );
    }

    private getNavBar() {
        let navBarComponentProps: INavBarComponentProps = {
            title: ActionSDK.Localizer.getString("QuestionIndex", this.questionIndex + 1),
            rightNavBarItem: {
                title: ActionSDK.Localizer.getString("Done").toUpperCase(),
                ariaLabel: ActionSDK.Localizer.getString("Done"),
                onClick: () => {
                    // React Bug: Tapping outside a React component's hierarchy in React doesn't invoke onBlur on the active element
                    // https://github.com/moroshko/react-autosuggest/issues/380
                    // We are dependent on onBlur events to update our stores for input elements.
                    // e.g: Tapping on Send Survey/Create Poll buttons in the Nav Bar doesn't invoke onBlur on a focused input element
                    (document.activeElement as HTMLElement).blur();
                    goToPage(Page.Main);
                },
                type: NavBarItemType.BACK,
                className: "nav-bar-done"
            }
        };
        return (
            <NavBarComponent {...navBarComponentProps} />
        );
    }

    private getQuestionSection() {
        let question: ActionSDK.ActionInstanceColumn = toJS(getStore().questions[this.questionIndex]);


        return (
            <div key={"question" + this.questionIndex} className={(getStore().isValidationModeOn && !isQuestionValid(question) ? 'question-box invalid' : 'question-box')}>
                <QuestionComponent
                    isValidationModeOn={getStore().isValidationModeOn}
                    onChange={(props: IQuestionComponentProps) => {
                        updateQuestion(this.questionIndex, props.question);
                    }}
                    question={question}
                    questionIndex={this.questionIndex}
                    shouldFocusOnTitle={this.shouldFocusOnTitle}
                    renderForMobile={true}
                />
            </div>
        );
    }

    private getDeleteQuestionButton() {
        return (
            <>
                <Divider className="delete-button-divider" />
                <Button
                    className="delete-question-button"
                    text
                    content={
                        <Flex vAlign="center" className="delete-question-button-container">
                            <Icon name="trash-can" outline className="delete-button-icon" />
                            <Text content={ActionSDK.Localizer.getString("DeleteQuestion")} className="delete-button-label" />
                        </Flex>
                    }

                    onClick={() => {
                        deleteQuestion(this.questionIndex);
                    }}
                />
            </>
        );
    }
}