import * as React from "react";
import '../../../css/Creation.scss';
import { Dropdown, Checkbox, Flex, Text, Divider, DropdownItemProps, DropdownProps } from '@stardust-ui/react';
import { getRatingQuestionOptions } from "../../../common/Utils";
import { updateCustomProps } from "../../../actions/CreationActions";
import { QuestionDisplayType } from "../../../common/QuestionDisplayType";
import * as ActionSDK from "@actionSDK";
import { StarRatingView, ToggleRatingView, ScaleRatingView } from "@sharedUI";

export interface IRatingsQuestionComponentProps {
    question: ActionSDK.ActionInstanceColumn;
    questionIndex: number;
    onChange?: (props: IRatingsQuestionComponentProps) => void;
    renderForMobile?: boolean;
}


export class RatingsQuestionComponent extends React.Component<IRatingsQuestionComponentProps> {

    private selectedLevel = JSON.parse(this.props.question.customProperties)["level"];
    private selectedQuestionType = JSON.parse(this.props.question.customProperties)["type"];
    private questionDisplayType = JSON.parse(this.props.question.customProperties)["dt"];

    state = { isDropDownOpen: false }

    typeChoiceSet = [
        {
            index: 0,
            content: ActionSDK.Localizer.getString("StarText")
        },
        {
            index: 1,
            content: ActionSDK.Localizer.getString("Number")
        },
        {
            index: 2,
            content: ActionSDK.Localizer.getString("LikeDislike")
        }
    ];

    levelChoiceSet = [
        {
            content: 5
        },
        {
            content: 10
        }
    ];



    private setQuestionDisplayType() {
        switch (this.selectedQuestionType) {
            case ActionSDK.Localizer.getString("StarText"):
                if (this.selectedLevel == 5) {
                    this.questionDisplayType = QuestionDisplayType.FiveStar;
                } else {
                    this.questionDisplayType = QuestionDisplayType.TenStar;
                }
                break;
            case ActionSDK.Localizer.getString("Number"):
                if (this.selectedLevel == 5) {
                    this.questionDisplayType = QuestionDisplayType.FiveNumber;
                } else {
                    this.questionDisplayType = QuestionDisplayType.TenNumber;
                }
                break;
            case ActionSDK.Localizer.getString("LikeDislike"):
                this.questionDisplayType = QuestionDisplayType.LikeDislike;
        }
    }


    private handleOpenChange = (e, { open }) => {
        this.setState({
            isDropDownOpen: this.selectedQuestionType !== ActionSDK.Localizer.getString("LikeDislike") ? open : false,
        })
    }

    private getTypeDropDown = () => {
        let thisProps: IRatingsQuestionComponentProps = {
            question: { ...this.props.question },
            questionIndex: this.props.questionIndex
        };
        let selectedTypeIndex: number = 0;
        let ratingTypes: DropdownItemProps[] = this.typeChoiceSet.map((ratingType, index) => {
            selectedTypeIndex = this.selectedQuestionType === ratingType.content ? index : selectedTypeIndex;
            return {
                header: ratingType.content,
                "aria-label": this.selectedQuestionType === ratingType.content
                    ? ActionSDK.Localizer.getString("SelectedRatingType", ratingType.content)
                    : ActionSDK.Localizer.getString("UnselectedRatingType", ratingType.content),
                isFromKeyboard: !this.props.renderForMobile //this is set to handle focus of selected item - no changes needed for mobile
            };
        });
        let getA11yStatusMessage = (options) => {
            if (this.props.renderForMobile)
                return ActionSDK.Localizer.getString("DropDownListInfoMobile", ratingTypes.length);
            return ActionSDK.Localizer.getString("DropDownListInfo", ratingTypes.length);
        };
        return (
            <Flex gap="gap.medium" className="rating-dropdown-container">
                <Text className="align-center" content={ActionSDK.Localizer.getString("TypeText")} />
                <Dropdown value={ratingTypes[selectedTypeIndex]} items={ratingTypes}
                    onSelectedChange={(e: React.SyntheticEvent<HTMLElement>, props: DropdownProps) => {
                        this.selectedQuestionType = props.value["header"].toString();
                        this.setQuestionDisplayType();
                        let customProps = JSON.parse(thisProps.question.customProperties);
                        customProps["dt"] = this.questionDisplayType;
                        thisProps.question.customProperties = JSON.stringify(customProps);
                        thisProps.question.options = getRatingQuestionOptions(this.questionDisplayType);
                        this.props.onChange(thisProps);
                        customProps["type"] = this.selectedQuestionType;
                        updateCustomProps(thisProps.questionIndex, customProps);
                    }}
                    getA11yStatusMessage={getA11yStatusMessage}
                    getA11ySelectionMessage={{
                        onAdd: (item: DropdownItemProps) => ActionSDK.Localizer.getString("RatingTypeSelected", item.header)
                    }}
                    triggerButton={{ "aria-label": ActionSDK.Localizer.getString("RatingType", this.selectedQuestionType) }}
                    inline className="rating-dropdown" />
            </Flex>
        );
    }

    private getLevelDropDown = () => {
        let thisProps: IRatingsQuestionComponentProps = {
            question: { ...this.props.question },
            questionIndex: this.props.questionIndex
        };
        let selectedLevelIndex: number = 0;
        let ratingScales: DropdownItemProps[] = this.levelChoiceSet.map((ratingScale, index) => {
            selectedLevelIndex = this.selectedLevel === ratingScale.content ? index : selectedLevelIndex;
            return {
                header: ratingScale.content.toString(),
                "aria-label": this.selectedLevel === ratingScale.content
                    ? ActionSDK.Localizer.getString("SelectedRatingScale", ratingScale.content)
                    : ActionSDK.Localizer.getString("UnselectedRatingScale", ratingScale.content),
                isFromKeyboard: !this.props.renderForMobile //this is set to handle focus of selected item - no changes needed for mobile
            };
        });
        let getA11yStatusMessage = (options) => {
            if (this.props.renderForMobile)
                return ActionSDK.Localizer.getString("DropDownListInfoMobile", ratingScales.length);
            return ActionSDK.Localizer.getString("DropDownListInfo", ratingScales.length);
        };
        return (
            <Flex gap="gap.medium" className="rating-dropdown-container">
                <Text className="align-center" content={ActionSDK.Localizer.getString("ScaleText")} />
                <Dropdown value={ratingScales[selectedLevelIndex]} items={ratingScales}
                    onSelectedChange={(e: React.SyntheticEvent<HTMLElement>, props: DropdownProps) => {
                        this.selectedLevel = parseInt(props.value["header"]);
                        let customProps = JSON.parse(thisProps.question.customProperties);
                        this.setQuestionDisplayType();
                        customProps["dt"] = this.questionDisplayType;
                        thisProps.question.customProperties = JSON.stringify(customProps);
                        thisProps.question.options = getRatingQuestionOptions(this.questionDisplayType);
                        this.props.onChange(thisProps);
                        customProps["level"] = this.selectedLevel;
                        updateCustomProps(thisProps.questionIndex, customProps);
                    }}
                    getA11yStatusMessage={getA11yStatusMessage}
                    getA11ySelectionMessage={{
                        onAdd: (item: DropdownItemProps) => ActionSDK.Localizer.getString("RatingLevelSelected", item.header)
                    }}
                    triggerButton={{ "aria-label": ActionSDK.Localizer.getString("RatingScale", this.selectedLevel) }}
                    inline className="rating-dropdown" open={this.state.isDropDownOpen} onOpenChange={this.handleOpenChange} />
            </Flex>
        );
    }

    private getCheckBox = () => {
        let thisProps: IRatingsQuestionComponentProps = {
            question: { ...this.props.question },
            questionIndex: this.props.questionIndex
        };
        return (
            <Checkbox checked={!(this.props.question.isOptional)} label={ActionSDK.Localizer.getString("Required")} onChange={(e, data) => {
                thisProps.question.isOptional = !(data.checked);
                this.props.onChange(thisProps);
            }} className="required-question-checkbox" />
        );
    }


    private getQuestionView() {
        switch (this.questionDisplayType) {
            case QuestionDisplayType.FiveStar:
            case QuestionDisplayType.TenStar:
                return (<div className="question-preview rating-star"><StarRatingView max={this.selectedLevel} disabled defaultValue={0} isPreview /></div>);
            case QuestionDisplayType.FiveNumber:
            case QuestionDisplayType.TenNumber:
                return (<div className="question-preview"><ScaleRatingView max={this.selectedLevel} disabled defaultValue={0} isPreview /></div>);
            case QuestionDisplayType.LikeDislike:
                return (<div className="question-preview rating-star"><ToggleRatingView isPreview /></div>);
        }
    }


    render() {
        return (
            <div>
                {this.getQuestionView()}
                <Flex column>
                    <Flex className="rating-setting" gap="gap.large">
                        {this.getTypeDropDown()}
                        {this.questionDisplayType !== QuestionDisplayType.LikeDislike ? this.getLevelDropDown() : null}
                    </Flex>
                    <Divider className="question-divider" />
                    {this.getCheckBox()}
                </Flex>
            </div>
        );
    }
}
