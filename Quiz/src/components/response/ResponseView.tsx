import * as React from 'react';
import * as ActionSDK from '@actionSDK';
import { ResponseViewMode } from '../../store/response/Store';
import { isValidResponse, isInvalidNumericPattern } from '../../common/Utils';
import { QuestionDisplayType } from '../../common/QuestionDisplayType';
import { IRatingAnswerProps, IQuestionProps, IMultiChoiceProps } from './questionView/QuestionView';
import { ScaleRatingAnswerView } from './questionView/ScaleRatingAnswerView';
import { StarRatingAnswerView } from './questionView/StarRatingAnswerView';
import { Text } from '@stardust-ui/react';
import { DateOnlyAnswerView } from './questionView/DateOnlyAnswerView';
import { NumericAnswerView } from './questionView/NumericAnswerView';
import { TextAnswerView } from './questionView/TextAnswerView';
import { MultiSelectView } from './questionView/MultiSelectView';
import { SingleSelectView } from './questionView/SingleSelectView';
import { LikeToggleRatingAnswerView } from './questionView/LikeToggleAnswerView';
import '../../css/Response.scss';
import * as ReactDOM from "react-dom";
import { UxUtils, Constants } from '@sharedUI';
import { updateTopMostErrorIndex } from '../../actions/ResponseActions';

export interface IResponseView {
    questionNumber: number;
    actionInstanceColumn: ActionSDK.ActionInstanceColumn;
    response?: any;
    callback?: (response: any) => void;
    responseState: ResponseViewMode;
    isValidationModeOn?: boolean;
    locale?: string;
    setErroredFocus?: boolean;
}

export default class ResponseView extends React.Component<IResponseView, any> {

    shouldComponentUpdate(nextProps: IResponseView) {
        if (this.props.responseState === ResponseViewMode.CreationPreview && nextProps.responseState === ResponseViewMode.CreationPreview) {
            if (this.props.questionNumber == nextProps.questionNumber
                && JSON.stringify(this.props.actionInstanceColumn) == JSON.stringify(nextProps.actionInstanceColumn)) {
                return false;
            }
        }
        return true;
    }

    setErroredFocus() {
        const node = ReactDOM.findDOMNode(this) as HTMLElement;
        UxUtils.setFocus(node, [Constants.FOCUSABLE_ITEMS.INPUT, Constants.FOCUSABLE_ITEMS.TEXTAREA, Constants.FOCUSABLE_ITEMS.TAB]);
        updateTopMostErrorIndex(-1);
    }

    render() {
        let errorString = this.props.isValidationModeOn
            && !isValidResponse(this.props.response, this.props.actionInstanceColumn.isOptional, this.props.actionInstanceColumn.type) ? ActionSDK.Localizer.getString("RequiredAsterisk") : "";
        let questionType: ActionSDK.ActionInstanceColumnType = this.props.actionInstanceColumn.type;
        if (questionType === ActionSDK.ActionInstanceColumnType.Numeric &&
            isInvalidNumericPattern(this.props.response)) {
            errorString = ActionSDK.Localizer.getString("OnlyNumericAccepted");
        }
        let isPreview = (this.props.responseState === ResponseViewMode.CreationPreview);
        let editable = (this.props.responseState === ResponseViewMode.NewResponse || this.props.responseState === ResponseViewMode.UpdateResponse);
        if (errorString.length > 0 && this.props.setErroredFocus) {
            this.setErroredFocus();
        }

        return (<li className={errorString.length > 0 ? "invalid question-view" : "question-view"} key={this.props.actionInstanceColumn.id} tabIndex={0}>
            {(() => {
                switch (questionType) {
                    case ActionSDK.ActionInstanceColumnType.SingleOption: {
                        let displayType: number = JSON.parse(this.props.actionInstanceColumn.customProperties)["dt"];
                        switch (displayType) {
                            case QuestionDisplayType.TenNumber:
                            case QuestionDisplayType.FiveNumber:
                                let scaleRatingAnswerViewProps: IRatingAnswerProps = {
                                    questionNumber: this.props.questionNumber,
                                    questionText: this.props.actionInstanceColumn.title,
                                    editable: editable,
                                    required: !this.props.actionInstanceColumn.isOptional,
                                    count: displayType == QuestionDisplayType.TenNumber ? 10 : 5,
                                    response: this.props.response,
                                    updateResponse: this.props.callback,
                                    isPreview: isPreview
                                }
                                return <ScaleRatingAnswerView {...scaleRatingAnswerViewProps} />;

                            case QuestionDisplayType.TenStar:
                            case QuestionDisplayType.FiveStar:
                                let starRatingAnswerViewProps: IRatingAnswerProps = {
                                    questionNumber: this.props.questionNumber,
                                    questionText: this.props.actionInstanceColumn.title,
                                    editable: editable,
                                    required: !this.props.actionInstanceColumn.isOptional,
                                    count: displayType == QuestionDisplayType.TenStar ? 10 : 5,
                                    response: this.props.response,
                                    updateResponse: this.props.callback,
                                    isPreview: isPreview
                                }
                                return <StarRatingAnswerView {...starRatingAnswerViewProps} />;

                            case QuestionDisplayType.LikeDislike:
                                let likeToggleAnswerViewProps: IQuestionProps = {
                                    questionNumber: this.props.questionNumber,
                                    questionText: this.props.actionInstanceColumn.title,
                                    editable: editable,
                                    required: !this.props.actionInstanceColumn.isOptional,
                                    response: this.props.response,
                                    updateResponse: this.props.callback,
                                    isPreview: isPreview
                                }
                                return <LikeToggleRatingAnswerView {...likeToggleAnswerViewProps} />;

                            default:
                                let singleSelectProps: IMultiChoiceProps = {
                                    questionNumber: this.props.questionNumber,
                                    questionText: this.props.actionInstanceColumn.title,
                                    editable: editable,
                                    required: !this.props.actionInstanceColumn.isOptional,
                                    options: this.props.actionInstanceColumn.options,
                                    response: this.props.response,
                                    updateResponse: this.props.callback,
                                    isPreview: isPreview
                                }
                                return <SingleSelectView {...singleSelectProps} />;
                        }

                    }

                    case ActionSDK.ActionInstanceColumnType.MultiOption:
                        let multiSelectProps: IMultiChoiceProps = {
                            questionNumber: this.props.questionNumber,
                            questionText: this.props.actionInstanceColumn.title,
                            editable: editable,
                            required: !this.props.actionInstanceColumn.isOptional,
                            options: this.props.actionInstanceColumn.options,
                            response: this.props.response,
                            updateResponse: this.props.callback,
                            isPreview: isPreview
                        }
                        return <MultiSelectView {...multiSelectProps} />;

                    case ActionSDK.ActionInstanceColumnType.Text:
                        let textAnswerProps: IQuestionProps = {
                            questionNumber: this.props.questionNumber,
                            questionText: this.props.actionInstanceColumn.title,
                            editable: editable,
                            required: !this.props.actionInstanceColumn.isOptional,
                            response: this.props.response,
                            updateResponse: this.props.callback,
                            isPreview: isPreview
                        }
                        return <TextAnswerView {...textAnswerProps} />;

                    case ActionSDK.ActionInstanceColumnType.Numeric:
                        let numAnswerProps: IQuestionProps = {
                            questionNumber: this.props.questionNumber,
                            questionText: this.props.actionInstanceColumn.title,
                            editable: editable,
                            required: !this.props.actionInstanceColumn.isOptional,
                            response: this.props.response,
                            updateResponse: this.props.callback,
                            isPreview: isPreview
                        }
                        return <NumericAnswerView {...numAnswerProps} />;

                    case ActionSDK.ActionInstanceColumnType.Date:
                        let dateAnswerProps: IQuestionProps = {
                            questionNumber: this.props.questionNumber,
                            questionText: this.props.actionInstanceColumn.title,
                            editable: editable,
                            required: !this.props.actionInstanceColumn.isOptional,
                            response: this.props.response,
                            updateResponse: this.props.callback,
                            isPreview: isPreview,
                            locale: this.props.locale
                        }
                        return <DateOnlyAnswerView {...dateAnswerProps} />;

                    default:
                        return null;
                }
            })()}
            {(errorString.length > 0)
                && <Text className="response-mandatory" content={errorString} />
            }
        </li>);
    }
}