import * as React from 'react';
import getStore, { ResponsePageViewType, ResponseViewMode } from "../../store/response/Store";
import { sendResponse, resetResponse, setResponseViewMode, setCurrentView, setSavedActionInstanceRow, showResponseView, initializeNavBarButtons, setResponseSubmissionFailed } from '../../actions/ResponseActions';
import { Flex, Button, Icon, Text } from '@stardust-ui/react';
import ResponsePage from './ResponsePage';
import { observer } from 'mobx-react';
import { InitializationState, LoaderUI, ButtonComponent, UxUtils, NavBarComponent, INavBarComponentProps, NavBarItemType, ErrorView, actionDeletedError } from '@sharedUI';
import * as ActionSDK from '@actionSDK';
import { MyResponsesListView } from '../myResponses/MyResponsesListView';
import { UserResponseView } from "../summary/UserResponseView";
import { initializeMyResponses } from "../../actions/MyResponsesActions";
import "../../css/Response.scss";

@observer
export default class ResponseRenderer extends React.Component<any, any> {

    render() {
        if (getStore().isActionDeleted) {
            return <ErrorView
                title={ActionSDK.Localizer.getString("SurveyDeletedError")}
                subtitle={ActionSDK.Localizer.getString("SurveyDeletedErrorDescription")}
                buttonTitle={ActionSDK.Localizer.getString("Close")}
                image={actionDeletedError}
            />;
        }

        if (getStore().isInitialized === InitializationState.NotInitialized) {
            return <LoaderUI fill />;
        }
        else if (getStore().isInitialized === InitializationState.Failed) {
            ActionSDK.APIs.actionViewDidLoad(false /*success*/);
            return <ErrorView
                title={ActionSDK.Localizer.getString("GenericError")}
                buttonTitle={ActionSDK.Localizer.getString("Close")}
            />;
        }

        ActionSDK.APIs.actionViewDidLoad(true /*success*/);

        if (UxUtils.renderingForMobile()) {
            return this.renderForMobile();
        } else {
            return this.renderForWebOrDesktop();
        }
    }

    private renderForWebOrDesktop() {
        if (getStore().currentView === ResponsePageViewType.MyResponses) {
            return (
                <>
                    <Flex className="body-container">
                        {this.renderMyResponsesListView()}
                    </Flex>
                    <Flex className="footer-layout" gap={"gap.small"}>
                        <Flex vAlign="center" className="pointer-cursor" {...UxUtils.getTabKeyProps()} onClick={() => {
                            this.myResponsesViewBackButtonHandler();
                        }} >
                            <Icon name="chevron-down" rotate={90} xSpacing="after" size="small" />
                            <Text content={ActionSDK.Localizer.getString("Back")} />
                        </Flex>
                    </Flex>
                </>
            )
        } else if (getStore().currentView === ResponsePageViewType.SelectedResponseView) {
            return this.renderUserResponseView();
        }
        let shouldShowRespondedNTimesLabel = getStore().actionInstance.canUserAddMultipleRows && getStore().myResponses.length > 0;
        return (
            <>
                <Flex className="body-container">
                    {this.renderResponsePage()}
                </Flex>
                <Flex className="footer-layout space-between" gap="gap.medium" hAlign="end">
                    <Flex column>
                        {shouldShowRespondedNTimesLabel && this.renderYouRespondedNTimesLabel()}
                        {getStore().responseSubmissionFailed &&
                            <Text content={ActionSDK.Localizer.getString("ResponseSubmitError")}
                                className={shouldShowRespondedNTimesLabel ? "response-error" : ""} error />}
                    </Flex>
                    <Flex.Item push>
                        {getStore().responseViewMode === ResponseViewMode.DisabledResponse ?
                            <Button content={ActionSDK.Localizer.getString("EditResponse")} primary onClick={() => {
                                /* 
                                Any update to this handler should also be made in the NAV_BAR_MENUITEM_EDIT_RESPONSE_ID  
                                section in navBarMenuCallback() in ResponseOrchestrator
                                */
                                setResponseViewMode(ResponseViewMode.UpdateResponse);
                            }} /> :
                            <Flex gap="gap.medium">
                                {getStore().responseViewMode === ResponseViewMode.UpdateResponse &&
                                    <Button content={ActionSDK.Localizer.getString("Cancel")} onClick={() => {
                                        this.responsePageCancelButtonHandler();
                                    }} />
                                }
                                <ButtonComponent
                                    primary
                                    showLoader={getStore().isSendActionInProgress}
                                    content={getStore().responseViewMode === ResponseViewMode.UpdateResponse ? ActionSDK.Localizer.getString("UpdateResponse") : ActionSDK.Localizer.getString("SubmitResponse")}
                                    onClick={() => {
                                        /* 
                                        Any update to this handler should also be made in the NAV_BAR_MENUITEM_SUBMIT_RESPONSE_ID  
                                        section in navBarMenuCallback() in ResponseOrchestrator
                                        */
                                        sendResponse();
                                    }}>
                                </ButtonComponent>
                            </Flex>
                        }
                    </Flex.Item>
                </Flex>
            </>
        );
    }

    private renderForMobile() {
        if (getStore().currentView === ResponsePageViewType.MyResponses) {
            initializeNavBarButtons();
            return (
                <Flex className={this.getMobileContainerClassName()}>
                    {this.shouldShowNavBar() && this.getNavBar()}
                    {this.renderMyResponsesListView()}
                </Flex>
            )
        } else if (getStore().currentView === ResponsePageViewType.SelectedResponseView) {
            return this.renderUserResponseView();
        }
        initializeNavBarButtons();
        return (
            <>
                <Flex className={this.getMobileContainerClassName()}>
                    {this.shouldShowNavBar() && this.getNavBar()}
                    {this.renderResponsePage()}
                </Flex>
                {
                    this.shouldShowFooterOnMobile() &&
                    <Flex className="footer-layout">
                        {this.renderYouRespondedNTimesLabel()}
                    </Flex>
                }
            </>
        );
    }

    private renderYouRespondedNTimesLabel() {
        return (
            <Flex.Item grow>
                <Text
                    size="small"
                    color="brand"
                    content={getStore().myResponses.length === 1
                        ? ActionSDK.Localizer.getString("YouRespondedOnce")
                        : ActionSDK.Localizer.getString("YouRespondedNTimes", getStore().myResponses.length)}
                    className="underline" onClick={() => {
                        setSavedActionInstanceRow(getStore().response.row);
                        initializeMyResponses(getStore().myResponses);
                        setCurrentView(ResponsePageViewType.MyResponses);
                    }}
                    {...UxUtils.getTabKeyProps()}
                    aria-label={getStore().myResponses.length === 1
                        ? ActionSDK.Localizer.getString("YouRespondedOnce")
                        : ActionSDK.Localizer.getString("YouRespondedNTimes", getStore().myResponses.length)}
                />
            </Flex.Item>
        );
    }

    private renderUserResponseView() {
        return (
            <UserResponseView
                responses={getStore().myResponses}
                goBack={() => {
                    setCurrentView(ResponsePageViewType.MyResponses);
                }}
                currentResponseIndex={getStore().currentResponseIndex}
                showResponseView={showResponseView}
                locale={getStore().context ? getStore().context.locale : ActionSDK.Utils.DEFAULT_LOCALE} />
        );
    }

    private renderMyResponsesListView() {
        return (
            <MyResponsesListView
                locale={getStore().context ? getStore().context.locale : ActionSDK.Utils.DEFAULT_LOCALE}
                onRowClick={(index, dataSource) => {
                    showResponseView(index, dataSource);
                }} />
        );
    }

    private renderResponsePage() {
        return (
            <ResponsePage showTitle responseViewMode={getStore().responseViewMode} />
        );
    }

    private getMobileContainerClassName() {
        let className = "body-container";
        if (!this.shouldShowFooterOnMobile()) {
            className += " no-mobile-footer";
        }
        return className;
    }

    private getNavBar() {
        let navBarComponentProps: INavBarComponentProps;
        if (getStore().responseViewMode === ResponseViewMode.UpdateResponse) {
            navBarComponentProps = {
                title: ActionSDK.Localizer.getString("Cancel"),
                leftNavBarItem: {
                    icon: { name: "close", outline: true, size: "large" },
                    ariaLabel: ActionSDK.Localizer.getString("Cancel"),
                    onClick: () => {
                        this.responsePageCancelButtonHandler();
                    },
                    type: NavBarItemType.BACK
                }
            };
        } else if (getStore().currentView === ResponsePageViewType.MyResponses) {
            navBarComponentProps = {
                title: ActionSDK.Localizer.getString("Back"),
                leftNavBarItem: {
                    icon: { name: "arrow-down", size: "large", rotate: 90 },
                    ariaLabel: ActionSDK.Localizer.getString("Back"),
                    onClick: () => {
                        this.myResponsesViewBackButtonHandler();
                    },
                    type: NavBarItemType.BACK
                }
            };
        }

        return (
            <NavBarComponent {...navBarComponentProps} />
        );
    }

    private myResponsesViewBackButtonHandler() {
        resetResponse();
        setCurrentView(ResponsePageViewType.Main);
    }

    private responsePageCancelButtonHandler() {
        setResponseSubmissionFailed(false);
        resetResponse();
        setResponseViewMode(ResponseViewMode.DisabledResponse);
    }

    private shouldShowFooterOnMobile(): boolean {
        return getStore().actionInstance.canUserAddMultipleRows && getStore().myResponses.length > 0 &&
            getStore().currentView !== ResponsePageViewType.MyResponses &&
            getStore().currentView !== ResponsePageViewType.SelectedResponseView;
    }

    private shouldShowNavBar(): boolean {
        return getStore().responseViewMode === ResponseViewMode.UpdateResponse ||
            getStore().currentView === ResponsePageViewType.MyResponses;
    }
}