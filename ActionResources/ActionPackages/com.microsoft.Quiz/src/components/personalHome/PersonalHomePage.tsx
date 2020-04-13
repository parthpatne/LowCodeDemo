import * as React from 'react';
import * as ActionSDK from "@actionSDK";
import getStore, { Page } from "../../store/personalApp/Store";
import { PersonalHomeGridComponent, IPersonalHomeGridViewProps } from "./PersonalHomeGridComponent"
import { Flex, Text, Input, Dropdown, Grid, gridBehavior } from '@stardust-ui/react';
import { RecyclerViewComponent, RecyclerViewType, InitializationState, LoaderUI } from '@sharedUI';
import { TemplateView, ITemplateViewProps } from "./TemplateView";
import "../../css/homeview.scss";
import { initialize, goToPage, updateSurvey } from '../../actions/PersonalHomeActions';
import { observer } from "mobx-react";
import { toJS } from 'mobx';
import CreationPage from "../creation/CreationPage";
import SummaryPage from '../summary/SummaryPage';
import { createSurveyImage } from "../../../images";
import { FocusZone } from '@stardust-ui/react/dist/es/lib/accessibility/FocusZone';

interface IPersonalHomePageState {
    gridWidth: number;
}

@observer
export class PersonalHomePage extends React.Component<any, IPersonalHomePageState>{
    private gridViewInstance: IPersonalHomeGridViewProps[] = [];
    private templateViewInstance: ITemplateViewProps[] = [];
    private templateViewsMap: { [key: string]: ITemplateViewProps[] } = {};
    private templates: any[] = [];
    private windowWidth: number;
    // 64 is the difference between window.innerwidth and gridlayout width.intially gridlayout is not loaded,hence
    // we cannot get width of grid layout. so as approximation we are using window.innerwidth-windowGridLayoutWidthDiff
    private windowGridLayoutWidthDiff: number = 64;
    constructor(props) {
        super(props);
        this.state = {
            gridWidth: 360,
        };
    }

    filterItems = [
        ActionSDK.Localizer.getString("All"),
        ActionSDK.Localizer.getString("Draft"),
        ActionSDK.Localizer.getString("Closed"),
        ActionSDK.Localizer.getString("Active"),
    ]

    componentWillMount() {
        initialize();
    }

    updateWidthAndHeight = () => {

        if (!(document.getElementById('homepageLayout'))) {
            this.windowWidth = window.innerWidth - this.windowGridLayoutWidthDiff;
        }
        else {
            this.windowWidth = document.getElementById('homepageLayout').clientWidth;
        }

        let reqWidth = 360 + (this.windowWidth % 360) / Math.floor(this.windowWidth / 360);
        this.setState({
            gridWidth: reqWidth
        });
    }

    render() {
        window.onresize = this.updateWidthAndHeight;
        if (getStore().currentPage == Page.Creation) {
            return (
                <>
                    <Flex>
                        <CreationPage onBackPress={(actionInstance: ActionSDK.ActionInstance, error: ActionSDK.ActionError) => {
                            goToPage(Page.Home);
                            updateSurvey(actionInstance);
                            // we can handle error and show proper error message 
                        }} />
                    </Flex>
                </>
            );
        }

        if (getStore().currentPage == Page.Summary) {
            return (
                <>
                    <Flex>
                        <SummaryPage onBackPress={() => { goToPage(Page.Home) }} />
                    </Flex>
                </>
            );
        }

        ActionSDK.APIs.actionViewDidLoad(true /*success*/);
        this.gridViewInstance = [];
        this.templateViewInstance = [];
        if (getStore().isInitialized === InitializationState.NotInitialized) {
            return <LoaderUI fill />;
        }

        if (getStore().sortedActionInstanceArray) {
            for (let survey of getStore().sortedActionInstanceArray) {
                this.addGridInfoProps(toJS(survey));
            }
        }

        let createSurvey: ActionSDK.ActionInstance = {
            title: ActionSDK.Localizer.getString("BlankSurvey"),
            columns: null,
            properties: null,
            expiry: null
        }
        let createSurveyCoverImage: string = createSurveyImage;
        let templateCoverImage = "https://i.pinimg.com/originals/2e/44/96/2e44964ed62f5b8219e5bb30015e1abf.jpg";
        this.addTemplateInfoProps(toJS(createSurvey), createSurveyCoverImage, false, this.templateViewInstance);
        this.templates = [
            <TemplateView {...this.templateViewInstance[0]} />
        ]
        if (getStore().sortedTemplatePageMap.length) {
            for (let template of toJS(getStore().sortedTemplatePageMap.Example)) {
                this.addTemplateInfoProps(toJS(template), templateCoverImage, true, this.templateViewInstance);
            }
            this.templates = [
                <TemplateView {...this.templateViewInstance[0]} />,
                <TemplateView {...this.templateViewInstance[1]} />,
                <TemplateView {...this.templateViewInstance[2]} />,
                <TemplateView {...this.templateViewInstance[3]} />,
                <TemplateView {...this.templateViewInstance[4]} />
            ]

        }

        if (this.props.showTemplatesOnly) {
            return (
                <Flex className="body-container personal-home-container" vAlign="center" >
                    {this.showTemplatesFromMap()}
                </Flex>
            );
        }
        else {
            return (
                <Flex column className="body-container personal-home-container" vAlign="center">
                    <Flex column>
                        <Flex gap="gap.small" vAlign="center" className="bg-color" >
                            <Flex.Item push >
                                <Text weight="semibold" size="small" content={ActionSDK.Localizer.getString("ViewAllTemplates")} className="view-all-templates" tabIndex={0} aria-label={ActionSDK.Localizer.getString("ViewAllTemplates")} />
                            </Flex.Item>
                        </Flex>
                        <Grid content={this.templates} accessibility={gridBehavior} columns={Math.floor(this.windowWidth / 360)} />
                    </Flex>
                    <Flex vAlign="center" gap="gap.medium" className="homepage-mysurvey-bar" id="homepageLayout">
                        <Text className="text-mysurvey" content={ActionSDK.Localizer.getString("MySurveys")} tabIndex={0} />
                        <Flex.Item push >
                            <Dropdown fluid className="drop-down-bg-color"
                                items={this.filterItems}
                                defaultValue={ActionSDK.Localizer.getString("All")}
                            />
                        </Flex.Item>
                        <Input placeholder={ActionSDK.Localizer.getString("Search")} className="bg-color" />
                    </Flex>
                    <FocusZone className="zero-padding grid-draft-layout-focuszone" isCircularNavigation={true}>
                        <RecyclerViewComponent
                            data={this.gridViewInstance}
                            rowHeight={250}
                            gridWidth={this.state.gridWidth}
                            onRowRender={(type: RecyclerViewType, index: number, props: IPersonalHomeGridViewProps): JSX.Element => {
                                return <PersonalHomeGridComponent {...props} />;
                            }} />
                    </FocusZone>
                </Flex>
            );
        }
    }

    private addGridInfoProps(survey: ActionSDK.ActionInstance): void {

        let gridProps: Partial<IPersonalHomeGridViewProps> = {
            surveyData: survey,
            componentWidth: (this.state.gridWidth - 30),
        }
        this.gridViewInstance.push(gridProps as IPersonalHomeGridViewProps);
    }

    private addTemplateInfoProps(template: ActionSDK.ActionInstance, coverImage: string, isTemplate: boolean, container: ITemplateViewProps[]): void {
        let templateProps: Partial<ITemplateViewProps> = {
            templateData: template,
            componentWidth: (this.state.gridWidth - 30),
            coverUrl: coverImage,
            isTemplate: isTemplate
        }
        container.push(templateProps as ITemplateViewProps);
    }

    private showTemplatesFromMap() {
        this.initTemplatesMap();
        let templateGroups: any[] = [];
        let pageTemplates: any[] = [];
        for (var key in this.templateViewsMap) {
            pageTemplates = [];
            for (var templates of this.templateViewsMap[key]) {
                pageTemplates.push(<TemplateView {...templates} />)
            }
            templateGroups.push(
                <Flex column>
                    <Flex className="template-page-text">
                        <Text content={key} className="start-survey" tabIndex={0} />
                    </Flex>
                    <Grid content={pageTemplates} accessibility={gridBehavior} columns={Math.floor(this.windowWidth / 360)} />
                </Flex>
            );
        }
        return (
            <> {templateGroups} </>)
    }

    private initTemplatesMap() {
        let templateCoverImage = "https://i.pinimg.com/originals/2e/44/96/2e44964ed62f5b8219e5bb30015e1abf.jpg";
        for (let key in toJS(getStore().sortedTemplatePageMap)) {
            if (key != "Example") {
                this.templateViewsMap[key] = [];
                for (let template of toJS(getStore().sortedTemplatePageMap[key])) {
                    this.addTemplateInfoProps(toJS(template), templateCoverImage, true, this.templateViewsMap[key]);
                }
            }
        }
    }
}