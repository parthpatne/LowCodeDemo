import * as React from "react";
import { BarChartComponent, IBarChartItem, UxUtils } from "@sharedUI";
import { Divider, Flex, Icon, Text } from "@stardust-ui/react"
import { observer } from "mobx-react";
import "../../css/Summary.scss";
import { QuestionDisplayType } from "../../common/QuestionDisplayType";
import * as ActionSDK from "@actionSDK";
import { setCurrentView, setSelectedQuestionDrillDownInfo } from "../../actions/SummaryActions";
import { SummaryPageViewType, QuestionDrillDownInfo } from "../../store/summary/Store";
import { isEmptyOrNull } from "../../common/Utils";

export interface IResponseAggregationContainerProps {
    questions: ActionSDK.ActionInstanceColumn[];
    responseAggregates: {};
    totalResponsesCount: number;
}

@observer
export class ResponseAggregationContainer extends React.Component<IResponseAggregationContainerProps> {

    private getLikeDislikeSummaryItem(questionResultsData: JSON, question: ActionSDK.ActionInstanceColumn) {
        var likeCount = 0, likePercentage = 0;
        var dislikeCount = 0, dislikePercentage = 0;

        likeCount = questionResultsData[0] || 0;
        dislikeCount = questionResultsData[1] || 0;
        var totalResponsesForQuestion = likeCount + dislikeCount;
        likePercentage = likeCount == 0 ? 0 : Math.round((likeCount * 100) / (likeCount + dislikeCount));
        dislikePercentage = dislikeCount == 0 ? 0 : Math.round((dislikeCount * 100) / (likeCount + dislikeCount));
        var thumbsUpClasses = "reaction";
        var thumbsDownClasses = "reaction";
        if (likeCount >= dislikeCount) {
            thumbsUpClasses = thumbsUpClasses + " yellow-color";
        }
        if (dislikeCount >= likeCount) {
            thumbsDownClasses = thumbsDownClasses + " yellow-color";
        }

        let view = (<Flex padding="padding.medium" column>
            <Text className="stats-indicator" content={totalResponsesForQuestion === 1 ? ActionSDK.Localizer.getString("OneResponse")
                : ActionSDK.Localizer.getString("TotalResponsesWithCount", totalResponsesForQuestion)} />
            <Flex gap="gap.medium" padding="padding.medium" >
                <Flex.Item size="size.half">
                    <Flex hAlign="center" column gap="gap.small" className={likeCount > 0 ? "rating-drill-down" : ""} onClick={() => this.setDrillDownInfo(likeCount, question, 0, ActionSDK.Localizer.getString("ThumbsUpLabel"))} >
                        <Icon name="like" className={thumbsUpClasses} outline size="largest"></Icon>
                        <Flex>
                            <Text content={ActionSDK.Localizer.getString("ThumbsUpCounter", likeCount, likePercentage)} />
                        </Flex>
                    </Flex>
                </Flex.Item>

                <Flex.Item size="size.half">
                    <Flex hAlign="center" column gap="gap.small" className={dislikeCount > 0 ? "rating-drill-down" : ""} onClick={() => this.setDrillDownInfo(dislikeCount, question, 1, ActionSDK.Localizer.getString("ThumbsDownLabel"))}>
                        <Icon name="like" rotate={180} className={thumbsDownClasses} outline size="largest"></Icon>
                        <Flex>
                            <Text content={ActionSDK.Localizer.getString("ThumbsDownCounter", dislikeCount, dislikePercentage)} />
                        </Flex>
                    </Flex>
                </Flex.Item>
            </Flex></Flex>);
        return view;
    }

    private getMCQAggregatedView(questionResultsData: JSON, question: ActionSDK.ActionInstanceColumn) {
        var customProps = JSON.parse(question.customProperties);
        var displayType: QuestionDisplayType = (customProps && customProps.hasOwnProperty("dt")) ? customProps["dt"] : QuestionDisplayType.None;
        if (displayType == QuestionDisplayType.LikeDislike) {
            return (this.getLikeDislikeSummaryItem(questionResultsData, question));
        }
        else {
            let responsesAsBarChartItems: IBarChartItem[] = [];
            let totalResponsesForQuestion: number = 0;
            let average: number = 0;

            for (var j = 0; j < question.options.length; j++) {
                var option = question.options[j];
                let optionCount = questionResultsData[option.id] || 0;
                //TODO - color code for winner once css is finalized
                // let maxSelectedOptionQuantity = ActionSDK.Utils.getMaxValue(ActionSDK.Utils.getValues(questionResultsData));
                average = average + (parseInt(option.id)) * optionCount;
                totalResponsesForQuestion = totalResponsesForQuestion + optionCount;
                responsesAsBarChartItems.push({
                    id: option.id,
                    title: option.title,
                    quantity: optionCount,
                    className: "loser"
                });
            }

            let item = (
                <BarChartComponent items={responsesAsBarChartItems}
                    getBarPercentageString={(percentage: number) => {
                        return ActionSDK.Localizer.getString("BarPercentage", percentage);
                    }}
                    totalQuantity={this.props.totalResponsesCount}
                    onItemClicked={(choiceIndex) => {
                        let optionCount = responsesAsBarChartItems[choiceIndex].quantity;
                        let title = responsesAsBarChartItems[choiceIndex].title;
                        this.setDrillDownInfo(optionCount, question, choiceIndex, title);
                    }}
                />
            );

            if (displayType === QuestionDisplayType.FiveStar ||
                displayType === QuestionDisplayType.TenStar ||
                displayType === QuestionDisplayType.FiveNumber ||
                displayType === QuestionDisplayType.TenNumber) {
                average = totalResponsesForQuestion === 0 ? 0 : average / totalResponsesForQuestion;
                item = (
                    <>
                        <Flex hAlign="start" vAlign="center" className="stats-indicator">
                            <Text content={average.toFixed(1)} />
                            {(displayType === QuestionDisplayType.FiveStar || displayType === QuestionDisplayType.TenStar) && <Icon size="small" name="star" className="star-icon-average-rating"></Icon>}
                            <Text className="average-rating-text" content={ActionSDK.Localizer.getString("AverageRating")} />
                        </Flex>
                        <div className="rating-items">
                            {item}
                        </div>
                    </>
                );
            }
            return (<div className="mcq-summary-item">{item}</div>);
        }
    }

    private getTextAggregationView(responseCount: number, question: ActionSDK.ActionInstanceColumn) {
        var className = "mcq-summary-item question-summary-text";
        if (responseCount > 0) {
            className = className + " underline";
        }
        return this.getQuestionDrillDownInfoView(undefined, question, className);
    }

    private getNumericResponseAggregationView(questionResultsData: JSON, question: ActionSDK.ActionInstanceColumn) {
        var sum = questionResultsData.hasOwnProperty("s") ? questionResultsData["s"] : 0;
        var average = questionResultsData.hasOwnProperty("a") ? questionResultsData["a"] : 0;
        var responsesCount = (sum === 0) ? this.props.totalResponsesCount : (Math.round(sum / average));
        const sumString = <Text content={ActionSDK.Localizer.getString("Sum", sum)} />;
        const averageString = <Text content={ActionSDK.Localizer.getString("Average", average.toFixed(2))} />;
        let className = "";
        if (responsesCount > 0) {
            className = className + " underline";
        }
        if (UxUtils.renderingForMobile()) {
            return (
                <Flex className="stats-indicator mcq-summary-item" column>
                    {this.getQuestionDrillDownInfoView(responsesCount, question, className)}
                    {sumString}
                    {averageString}
                </Flex>
            );
        }
        return (
            <Flex gap="gap.medium" className="stats-indicator mcq-summary-item">
                {this.getQuestionDrillDownInfoView(responsesCount, question, className)}
                <span className="vertical-divider" />
                {sumString}
                <span className="vertical-divider" />
                {averageString}
            </Flex>
        );
    }

    private setDrillDownInfo(responseCount: number, question: ActionSDK.ActionInstanceColumn, choiceIndex: number, subTitle: string) {
        if (responseCount !== 0) {
            var questionDrillDownInfo: QuestionDrillDownInfo = {
                id: parseInt(question.id),
                title: question.title,
                type: question.type,
                responseCount: responseCount,
                choiceIndex: choiceIndex,
                displayType: JSON.parse(question.customProperties)["dt"],
                subTitle: subTitle
            }
            setSelectedQuestionDrillDownInfo(questionDrillDownInfo);
            setCurrentView(SummaryPageViewType.ResponseAggregationView);
        }
    }

    private getQuestionDrillDownInfoView(responseCount: number, question: ActionSDK.ActionInstanceColumn, className: string) {
        const responseCountString = responseCount === undefined ? ActionSDK.Localizer.getString("ViewResponses") :
            responseCount === 1 ? ActionSDK.Localizer.getString("OneResponse")
                : ActionSDK.Localizer.getString("TotalResponsesWithCount", responseCount);
        return (
            <Flex
                onClick={() => {
                    this.setDrillDownInfo(responseCount, question, -1, responseCount === undefined ? undefined : responseCount === 1 ?
                        ActionSDK.Localizer.getString("OneResponse") : ActionSDK.Localizer.getString("TotalResponsesWithCount", responseCount));
                }}
                className={className} vAlign="center"
                {...(responseCount > 0 && UxUtils.getTabKeyProps())}
                aria-label={responseCountString} >
                <Text weight="regular"
                    className="question-summary-text"
                    content={responseCountString}
                />
            </Flex>
        );
    }

    render() {
        const maxSingleDigit = 9;
        let questionsSummaryList = [];
        let questions = this.props.questions;
        let responseAggregates = this.props.responseAggregates;
        /*
         Whenever number of questions cross single digit below class is added to align single and double digits
        */
        let className = questions.length > maxSingleDigit ? "question-number-container" : "";
        for (let i = 0; i < questions.length; i++) {
            let titleClassName: string = "question-title";
            if (!questions[i].isOptional) {
                titleClassName = titleClassName + " required";
            }

            switch (questions[i].type) {

                case ActionSDK.ActionInstanceColumnType.SingleOption:
                case ActionSDK.ActionInstanceColumnType.MultiOption:

                    var questionResultsData = responseAggregates.hasOwnProperty(questions[i].id) ? JSON.parse(responseAggregates[questions[i].id]) : {};
                    questionsSummaryList.push(
                        <>
                            <Flex gap="gap.smaller">
                                <Flex className={className}>
                                    <Text content={ActionSDK.Localizer.getString("QuestionNumber", i + 1)} className="question-number" />
                                </Flex>
                                <Flex column className="overflow-hidden" fill>
                                    <Text content={questions[i].title} className={titleClassName} />
                                    {this.getMCQAggregatedView(questionResultsData, questions[i])}
                                </Flex>
                            </Flex>
                            {i != questions.length - 1 && <Divider />}
                        </>);
                    break;

                case ActionSDK.ActionInstanceColumnType.Text:
                case ActionSDK.ActionInstanceColumnType.Date:
                case ActionSDK.ActionInstanceColumnType.DateTime:

                    var questionResultsData = responseAggregates.hasOwnProperty(questions[i].id) ? JSON.parse(responseAggregates[questions[i].id]) : [];
                    let responseCount = 0;
                    for (let i = 0; i < questionResultsData.length; i++) {
                        if (!isEmptyOrNull(questionResultsData[i])) {
                            responseCount++;
                        }
                    }
                    questionsSummaryList.push(
                        <>
                            <Flex gap="gap.smaller">
                                <Flex className={className}>
                                    <Text content={ActionSDK.Localizer.getString("QuestionNumber", i + 1)} className="question-number" />
                                </Flex>
                                <Flex column>
                                    <Text content={questions[i].title} className={titleClassName} />
                                    {this.getTextAggregationView(responseCount, questions[i])}
                                </Flex>
                            </Flex>
                            {i != questions.length - 1 && <Divider />}
                        </>);
                    break;

                case ActionSDK.ActionInstanceColumnType.Numeric:

                    var questionResultsData = responseAggregates.hasOwnProperty(questions[i].id) ? JSON.parse(responseAggregates[questions[i].id]) : {};

                    questionsSummaryList.push(
                        <>
                            <Flex gap="gap.smaller">
                                <Flex className={className}>
                                    <Text content={ActionSDK.Localizer.getString("QuestionNumber", i + 1)} className="question-number" />
                                </Flex>
                                <Flex column>
                                    <Text content={questions[i].title} className={titleClassName} />
                                    {this.getNumericResponseAggregationView(questionResultsData, questions[i])}
                                </Flex>
                            </Flex>
                            {i != questions.length - 1 && <Divider />}
                        </>);
            }
        }
        return (<div> {questionsSummaryList}</div >);
    }

}
