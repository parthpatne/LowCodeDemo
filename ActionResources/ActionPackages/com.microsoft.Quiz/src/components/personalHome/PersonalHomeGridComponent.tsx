import * as React from 'react';
import * as ActionSDK from "@actionSDK";
import { Flex, Text, Image, Label, Button, List, Icon, Popup } from '@stardust-ui/react';
import "../../css/homeview.scss";
import { InitializationState, UxUtils, Constants } from "@sharedUI";
import getStore, { Page } from "../../store/personalApp/Store";
import { createDraftSurvey, goToPage, initializeExternalActionInstance, setCreationPersonalAppMode, setSummaryPersonalAppMode, setSummaryPageContext, getActionInstanceSummary, deleteActionInstanceInStore, closeSurvey } from '../../actions/PersonalHomeActions';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { getCoverImage } from '../../common/Utils';
import { defaultSurveyImage } from "../../../images";
import { FocusTrapZone } from '@stardust-ui/react/dist/es/lib/accessibility/FocusZone';

export interface IPersonalHomeGridViewProps {
    surveyData: ActionSDK.ActionInstance;
    componentWidth?: number;
}

interface IPersonalHomeGridState {
    showButtons: boolean;
    showList: boolean;
}

interface listType {
    key: string;
    header: string;
}

const activeListItems: listType[] = [
    {
        key: "viewResults",
        header: ActionSDK.Localizer.getString("ViewResults"),
    },
    {
        key: "duplicate",
        header: ActionSDK.Localizer.getString("Duplicate"),
    },
    {
        key: "closeSurvey",
        header: ActionSDK.Localizer.getString("CloseSurvey"),
    },
    {
        key: "delete",
        header: ActionSDK.Localizer.getString("Delete"),
    },
    {
        key: "getLinkToResults",
        header: ActionSDK.Localizer.getString("GetLinkToResults"),
    },
]

const draftClosedExpiredListItems: listType[] = [
    {
        key: "duplicate",
        header: ActionSDK.Localizer.getString("Duplicate"),
    },
    {
        key: "delete",
        header: ActionSDK.Localizer.getString("Delete"),
    },
]

@observer
export class PersonalHomeGridComponent extends React.Component<IPersonalHomeGridViewProps, IPersonalHomeGridState> {
    private surveyComponentButton1Text: string = "";
    private surveyComponentButton2Text: string = "";
    private resQueMetadata: string = "";
    private listItems: listType[] = null;
    private selectedIndex: number = -1;
    private labelData: string = "";
    private sentTo: string = "";
    private defaultCoverimage: string = defaultSurveyImage;

    constructor(props) {
        super(props);
        this.state = {
            showButtons: false,
            showList: false,
        }

        if (this.props.surveyData.status != ActionSDK.ActionInstanceStatus.Draft)
            getActionInstanceSummary(this.props.surveyData.id);
    }

    private selectedDCItem(selectedIndex) {
        //code for draft closed 
        if (selectedIndex == 0) {
            createDraftSurvey(toJS(getStore().otherSurveyMap[this.props.surveyData.id]));
        }

        // delete
        else if (selectedIndex == 1) {
            deleteActionInstanceInStore(this.props.surveyData.id);
        }
    }

    private selectedActiveItem(selectedIndex) {
        //code for active
        if (selectedIndex == 0) {
            this.openSummaryPage();

        }
        else if (selectedIndex == 1) {
            // Duplicate Clicked
            createDraftSurvey(toJS(getStore().otherSurveyMap[this.props.surveyData.id]));
        }
        //close survey
        else if (selectedIndex == 2) {
            closeSurvey(toJS(getStore().otherSurveyMap[this.props.surveyData.id]));
        }

        // delete
        else if (selectedIndex == 3) {
            deleteActionInstanceInStore(this.props.surveyData.id);
            ActionSDK.APIs.deleteActionInstance(this.props.surveyData.id);
        }
    }

    private showButtonsEvent() {
        this.setState({ showButtons: true });
    }

    private hideButtonsListEvent() {
        this.setState({ showButtons: false, showList: false });
    }

    private onblurEvent() {
        this.setState({ showButtons: false })
    }

    private setShowList() {
        this.setState({ showList: true });
    }

    render() {
        if (this.props.surveyData.status == ActionSDK.ActionInstanceStatus.Draft) {
            this.surveyComponentButton1Text = ActionSDK.Localizer.getString("EditSurvey");
            this.resQueMetadata = ActionSDK.Localizer.getString("Questions", this.props.surveyData.columns.length);
            this.surveyComponentButton2Text = ActionSDK.Localizer.getString("SendSurvey");
            this.listItems = draftClosedExpiredListItems;
            this.labelData = this.props.surveyData.status;
        }
        else if (this.props.surveyData.status == ActionSDK.ActionInstanceStatus.Active) {
            this.surveyComponentButton1Text = ActionSDK.Localizer.getString("SendReminder");
            this.resQueMetadata = getStore().actionInstanceResponseInitializationMap.get(this.props.surveyData.id) != undefined ? (getStore().actionInstanceResponseInitializationMap.get(this.props.surveyData.id) == InitializationState.Initialized ? ActionSDK.Localizer.getString("TotalResponsesWithCount", getStore().actionIdActionSummaryMap[this.props.surveyData.id].rowCount) : ActionSDK.Localizer.getString("ResponseFetchError")) : ActionSDK.Localizer.getString("FetchingResponses");
            this.surveyComponentButton2Text = ActionSDK.Localizer.getString("ViewResults");
            this.listItems = activeListItems;
            this.sentTo = getStore().teamIdToTeamsGroupMap[this.props.surveyData.conversationInfo.aadObjectId] != null ? getStore().teamIdToTeamsGroupMap[this.props.surveyData.conversationInfo.aadObjectId].dispNm : "Chat";
            this.labelData = ActionSDK.Localizer.getString("dueByDate", new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            }).format(this.props.surveyData.expiry));
        }
        else {
            this.surveyComponentButton1Text = ActionSDK.Localizer.getString("ViewResults");
            this.resQueMetadata = getStore().actionInstanceResponseInitializationMap.get(this.props.surveyData.id) != undefined ? (getStore().actionInstanceResponseInitializationMap.get(this.props.surveyData.id) == InitializationState.Initialized ? ActionSDK.Localizer.getString("TotalResponsesWithCount", getStore().actionIdActionSummaryMap[this.props.surveyData.id].rowCount) : ActionSDK.Localizer.getString("ResponseFetchError")) : ActionSDK.Localizer.getString("FetchingResponses");
            this.surveyComponentButton2Text = ActionSDK.Localizer.getString("ShareResults");
            this.listItems = draftClosedExpiredListItems;
            this.labelData = this.props.surveyData.status;
            this.sentTo = getStore().teamIdToTeamsGroupMap[this.props.surveyData.conversationInfo.aadObjectId] != null ? getStore().teamIdToTeamsGroupMap[this.props.surveyData.conversationInfo.aadObjectId].dispNm : "Chat";
        }

        let bandClassName: string = "";
        if (this.labelData == "Draft") {
            bandClassName = "draft-band-color";
        } else if (this.labelData == "Closed") {
            bandClassName = "closed-band-color";
        } else {
            bandClassName = "active-band-color";
        }
        return (

            <Flex vAlign="center" className="component-layout" styles={{ width: (this.props.componentWidth) + "px" }} column
                onMouseEnter={() =>
                    this.showButtonsEvent()
                }
                onMouseLeave={() =>
                    this.hideButtonsListEvent()
                }
                {...UxUtils.getListItemProps()}
                onFocus={() =>
                    this.showButtonsEvent()
                }
                onBlur={() =>
                    this.onblurEvent()
                }>
                <Flex className="cover-image-div">
                    <Image fluid src={!ActionSDK.Utils.isEmptyObject(getCoverImage(this.props.surveyData)) ? getCoverImage(this.props.surveyData).url : this.defaultCoverimage} alt="coverUrl" className="cover-image" />
                </Flex>
                <Flex className={"survey-status " + bandClassName}>
                    <Text size="small" color="white" content={this.labelData} />
                </Flex>
                <Flex column className="component-info-layout">
                    <Text weight="bold" className="component-info-title" content={this.props.surveyData.title} size="large" />
                    <Text weight="light" className="component-info-title" content={this.resQueMetadata} size="small" />
                    {this.state.showButtons ?
                        <Flex gap="gap.small" vAlign="center">
                            <Button content={this.surveyComponentButton1Text}
                                onClick={() => {
                                    this.handleSurveyComponentButton1Click()
                                }}
                            />
                            <Button content={this.surveyComponentButton2Text}
                                onClick={() => {
                                    this.handleSurveyComponentButton2Click()
                                }}
                            />
                        </Flex>
                        :
                        (this.props.surveyData.status != ActionSDK.ActionInstanceStatus.Draft ?
                            <Flex vAlign="center" >
                                <Text content={ActionSDK.Localizer.getString("SentTo", this.sentTo)} size="small" weight="semibold" />
                            </Flex>
                            : <Flex vAlign="center" >
                                <Text content="Last modified 2 days ago" size="small" weight="semibold" />
                            </Flex>)
                    }
                    <Popup
                        open={this.state.showList}
                        trigger={
                            <Icon name="more"
                                onClick={() =>
                                    this.setShowList()
                                }
                                className="more-icon" {...UxUtils.getTabKeyProps()}
                            />
                        }
                        content={
                            <FocusTrapZone
                                onKeyDown={(e) => {
                                    if (!e.repeat && (e.keyCode || e.which) == Constants.ESCAPE_ASCII_VALUE && this.state.showList) {
                                        this.setState({ showList: false });
                                    }
                                }}>
                                <List selectable
                                    onSelectedIndexChange={(e, listItemProps) => {
                                        if (this.props.surveyData.status == ActionSDK.ActionInstanceStatus.Active) {
                                            this.selectedActiveItem(listItemProps.selectedIndex);
                                        }
                                        else {
                                            this.selectedDCItem(listItemProps.selectedIndex);
                                        }
                                        this.setState({ showList: false });
                                    }}
                                    items={this.listItems}
                                />
                            </FocusTrapZone>
                        }
                    />
                </Flex>
            </Flex>
        );
    }

    private handleSurveyComponentButton1Click() {
        if (this.props.surveyData.status == ActionSDK.ActionInstanceStatus.Draft) {
            this.openCreationPage();
        }
        else if (this.props.surveyData.status == ActionSDK.ActionInstanceStatus.Closed) {
            this.openSummaryPage();
        }
    }

    private handleSurveyComponentButton2Click() {
        if (this.props.surveyData.status == ActionSDK.ActionInstanceStatus.Active) {
            this.openSummaryPage();
        }
    }

    private openCreationPage() {
        setCreationPersonalAppMode();
        initializeExternalActionInstance(this.props.surveyData);
        goToPage(Page.Creation);
    }

    private openSummaryPage() {
        var summaryContext = getStore().context;
        summaryContext.actionInstanceId = this.props.surveyData.id;
        summaryContext.conversationInfo = this.props.surveyData.conversationInfo;
        setSummaryPageContext(summaryContext);
        setSummaryPersonalAppMode();
        goToPage(Page.Summary);
    }
}
