import * as React from 'react';
import * as ActionSDK from "@actionSDK";
import { Flex, Text, Image, Button, Label } from '@stardust-ui/react';
import "../../css/homeview.scss";
import { Page } from "../../store/personalApp/Store";
import { setCreationPersonalAppMode, goToPage } from '../../actions/PersonalHomeActions';
import { UxUtils } from '@sharedUI';

interface ITemplateGridState {
    showButtons: boolean;
}

export interface ITemplateViewProps {
    templateData: ActionSDK.ActionInstance;
    coverUrl: string;
    componentWidth: number;
    isTemplate: boolean;
}

export class TemplateView extends React.PureComponent<ITemplateViewProps, ITemplateGridState>{
    private surveyComponentButton1Text: string = "";
    private surveyComponentButton2Text: string = "";

    constructor(props) {
        super(props);
        this.state = {
            showButtons: false,
        }
    }

    private showButtonsEvent() {
        this.setState({ showButtons: true });
    }

    private hideButtonsEvent() {
        this.setState({ showButtons: false });
    }

    private createBlankSurvey() {
        setCreationPersonalAppMode();
        goToPage(Page.Creation);
    }

    render() {
        this.surveyComponentButton1Text = ActionSDK.Localizer.getString("Preview");
        this.surveyComponentButton2Text = ActionSDK.Localizer.getString("UseTemplate");
        let templateDescription: string = null;

        // if (this.props.templateData.title == "Event Registration") {
        //     templateDescription = "Collect event registration details";
        // } else if (this.props.templateData.title == "Net Promoter Score") {
        //     templateDescription = "Measure willingness of your users to recommend";
        // } else if (this.props.templateData.title == "Incident Report") {
        //     templateDescription = "Capture details of an incident";
        // }

        if (this.props.isTemplate) {
            return (
                <Flex column gap="gap.small" styles={{ width: (this.props.componentWidth) + "px" }}
                    className="template-component-layout" id={this.props.templateData.id}
                    onMouseEnter={() =>
                        this.showButtonsEvent()
                    }
                    onMouseLeave={() =>
                        this.hideButtonsEvent()
                    }
                    {...UxUtils.getListItemProps()}
                >
                    <Flex className="cover-image-div">
                        <Image src={this.props.coverUrl} alt="coverUrl" className="cover-image" />
                    </Flex>

                    <Flex className="survey-status template-status">
                        <Text size="small" />
                    </Flex>

                    <Flex column className="component-info-layout">

                        <Text weight="bold" className="component-info-title" content={this.props.templateData.title} size="large" />
                        <Text weight="light" className="component-info-title" content={ActionSDK.Localizer.getString("Questions", this.props.templateData.columns ? this.props.templateData.columns.length : 0)} size="small" />
                        {this.state.showButtons ?
                            <Flex gap="gap.small" vAlign="center">
                                <Button content={this.surveyComponentButton1Text}
                                    onClick={() => {
                                        this.createBlankSurvey()
                                    }}
                                />
                                <Button content={this.surveyComponentButton2Text} />
                            </Flex> :
                            templateDescription ?
                                <Flex vAlign="center" >
                                    <Text content={templateDescription} size="small" weight="semibold" />
                                </Flex>
                                : null
                        }
                    </Flex>
                </Flex>
            );
        }
        else {
            return (
                <Flex column gap="gap.small" styles={{ width: (this.props.componentWidth) + "px" }} className="template-component-layout" id={this.props.templateData.id}
                    onMouseEnter={() =>
                        this.showButtonsEvent()
                    } onMouseLeave={() =>
                        this.hideButtonsEvent()
                    }
                    onClick={() =>
                        this.createBlankSurvey()
                    }
                    {...UxUtils.getListItemProps()}
                >
                    <Flex className="cover-image-div">
                        <Image src={this.props.coverUrl} alt="coverUrl" className="create-survey-cover-image" />
                    </Flex>
                    <Flex className="survey-status template-status">
                        <Text size="small" />
                    </Flex>
                    <Flex column className="component-info-layout">
                        <Text weight="bold" className="component-info-title" content={this.props.templateData.title} size="large" />
                        <Text weight="light" className="component-info-title" content={ActionSDK.Localizer.getString("CreateSurvey")} size="small" />
                    </Flex>
                </Flex>
            );
        }
    }
}