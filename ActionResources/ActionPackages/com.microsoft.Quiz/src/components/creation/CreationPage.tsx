import * as React from "react";
import {
    InitializationState, ButtonComponent, ISettingsComponentProps, InputBox, ISettingsProps, Settings, LoaderUI, SettingsSummaryComponent, SettingsSections,
    ISettingsComponentStrings, UxUtils, INavBarComponentProps, NavBarItemType, NavBarComponent, SettingsMobile, AdaptiveMenu, AdaptiveMenuItem, AdaptiveMenuRenderStyle,
    SettingsComponent, Constants, ErrorView, ImageCropper
} from "@sharedUI";
import { QuestionContainer } from './QuestionContainer';
import getStore, { Page } from "../../store/creation/Store";
import { Button, Flex, Icon, FlexItem, Loader, Text, Dialog } from '@stardust-ui/react';
import "../../css/Creation.scss";
import { QuestionDisplayType } from "../../common/QuestionDisplayType";
import {
    sendAction, addQuestion, updateSettings, updateTitle, previewAction, goToPage, initializeNavBarButtons, setContext,
    resetSurveyToDefault, sendActionForPersonalApp, setSettingDialogOpen, setChannelPickerDialogOpen, setSendSurveyAlertOpen, validateAndSend,
    setValidationMode, setPreviousPage
} from "../../actions/CreationActions";
import { observer } from "mobx-react";
import ResponsePage from "../response/ResponsePage";
import { toJS } from "mobx";
import * as ActionSDK from "@actionSDK";
import { QuestionContainerMobile } from "./QuestionContainerMobile";
import { UpdateQuestionPage } from "./UpdateQuestionPage";
import { isEmptyOrNull, getDialogButtonProps, areAllQuestionsOptional, QUESTION_DIV_ID_PREFIX, ADDQUESTIONBUTTONID } from '../../common/Utils';
import { ChannelPicker, IChannelPickerProps } from "./ChannelPicker";
import { ResponseViewMode } from "../../store/response/Store";

const LOG_TAG = "SurveyCreationPage";

@observer
export default class CreationPage extends React.Component<any, any> {

    private questionSize = 0;
    private prevPage: Page = null;
    private settingsFooterComponentRef: HTMLElement;

    shouldComponentUpdate() {
        if (this.prevPage) {
            this.prevPage = null;
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        if (getStore().previousPage === Page.Settings) {
            this.prevPage = getStore().previousPage;
            setPreviousPage(Page.Main);
            if (this.settingsFooterComponentRef) {
                this.settingsFooterComponentRef.focus();
                return;
            }
        }
        if (getStore().previousPage === Page.UpdateQuestion) {
            this.prevPage = getStore().previousPage;
            setPreviousPage(Page.Main);
            let focusableItem: HTMLElement = getStore().activeQuestionIndex === -1
                ? document.getElementById(ADDQUESTIONBUTTONID)
                : document.getElementById(QUESTION_DIV_ID_PREFIX + getStore().activeQuestionIndex);
            if (focusableItem) {
                (focusableItem as HTMLElement).focus();
                return;
            }
        }
        if (getStore().questions.length > this.questionSize) {
            this.questionSize = getStore().questions.length;
            const element = document.getElementById("add-question");
            if (element) {
                element.scrollIntoView();
            }
            return;
        } else {
            this.questionSize = getStore().questions.length;
        }
        //Not setting error focus in case new question is added because it will set focus to first invalid element instead of title of newly added question
        //In other cases, when error appears, focus is set to the first element with error
        if (getStore().shouldFocusOnError) {
            let element = document.querySelector(".invalid-error");
            if (element) {
                (element as HTMLElement).focus();
            }
        }
    }

    render() {
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
        else if (getStore().initPending) {
            ActionSDK.APIs.getCurrentContext()
                .then((context: ActionSDK.ActionContext) => {
                    setContext(context);
                });
            return <Loader />;
        }

        ActionSDK.APIs.actionViewDidLoad(true /*success*/);

        if (UxUtils.renderingForMobile()) {
            initializeNavBarButtons();
        }
        switch (getStore().currentPage) {
            case Page.Main:
                return this.renderMainPage();

            case Page.Preview:
                return this.renderPreviewPage();

            case Page.Settings:
                return this.renderSettingsPage();

            case Page.UpdateQuestion:
                return this.renderUpdateQuestionPage();
        }
    }

    private renderMainPage() {
        if (UxUtils.renderingForMobile()) {
            return (
                <>
                    <Flex className="body-container no-mobile-footer client-mobile">
                        {this.questionView()}
                        <div className="settings-summary-mobile-container">
                            {this.renderFooterSettingsSection()}
                        </div>
                    </Flex>
                    {this.setupSendSurveyDialog()}
                </>
            );
        } else if (getStore().inPersonalAppMode) {
            return this.getPersonalAppCreationView();
        } else {
            let shouldShowNext: boolean = false;
            if (!ActionSDK.Utils.isEmptyObject(getStore().context.ecsSettings)) {
                shouldShowNext = getStore().context.ecsSettings.ShouldSendBotMessagePreview;
            }
            return (
                <>
                    <Flex className="body-container" >
                        {this.questionView()}
                    </Flex>
                    <Flex className="footer-layout" gap={"gap.smaller"}>
                        {this.renderFooterSettingsSection()}
                        <FlexItem push>
                            <ButtonComponent
                                primary
                                content={shouldShowNext ? ActionSDK.Localizer.getString("Next") : ActionSDK.Localizer.getString("Preview")}
                                className="preview-button"
                                showLoader={getStore().isSendActionInProgress}
                                onClick={() => {
                                    if (shouldShowNext) {
                                        validateAndSend();
                                    } else {
                                        previewAction();
                                    }
                                }} />
                        </FlexItem>
                    </Flex>
                    {this.setupSendSurveyDialog()}
                </>
            );
        }
    }

    private renderPreviewPage() {
        if (UxUtils.renderingForMobile()) {
            let navBarComponentProps: INavBarComponentProps = {
                title: ActionSDK.Localizer.getString("Preview"),
                leftNavBarItem: {
                    icon: { name: "arrow-down", size: "large", rotate: 90 },
                    ariaLabel: ActionSDK.Localizer.getString("Back"),
                    onClick: () => {
                        goToPage(Page.Main);
                    },
                    type: NavBarItemType.BACK
                }
            };
            return (
                <>
                    <Flex className="body-container no-mobile-footer" column>
                        <NavBarComponent {...navBarComponentProps} />
                        <ResponsePage showTitle responseViewMode={ResponseViewMode.CreationPreview} />
                    </Flex>
                    {this.setupSendSurveyDialog()}
                </>
            );
        }
        else if (getStore().inPersonalAppMode) {

            let groupChannelIdProps: IChannelPickerProps = {
                setGroupChannelId: (gId: string, chId: string) => {
                    sendActionForPersonalApp(gId, chId, (actionInstance: ActionSDK.ActionInstance, error: ActionSDK.ActionError) => {
                        this.handleBackPress(actionInstance, error);
                    });
                }
            }

            let sendButton: JSX.Element = (
                <Flex>
                    <Button primary content={ActionSDK.Localizer.getString("SendSurvey")} onClick={() => setChannelPickerDialogOpen(true)} />
                    <ChannelPicker {...groupChannelIdProps} />
                </Flex>
            );

            return (
                <>

                    {this.getPersonalViewHeader()}
                    <Flex className="personal-app-body">
                        <ResponsePage showTitle responseViewMode={ResponseViewMode.CreationPreview} />
                    </Flex>
                    <Flex className="personal-footer-layout" >
                        <Flex.Item push>
                            {sendButton}
                        </Flex.Item>
                    </Flex>
                </>
            );
        }
        else {
            let shouldShowNext: boolean = false;
            if (!ActionSDK.Utils.isEmptyObject(getStore().context.ecsSettings)) {
                shouldShowNext = getStore().context.ecsSettings.ShouldSendBotMessagePreview;
            }
            let sendButton: JSX.Element = (
                <ButtonComponent primary showLoader={getStore().isSendActionInProgress}
                    content={shouldShowNext ? ActionSDK.Localizer.getString("Next") : ActionSDK.Localizer.getString("SendSurvey")}
                    onClick={() => {
                        if (areAllQuestionsOptional(getStore().questions)) {
                            setSendSurveyAlertOpen(true);
                        } else {
                            sendAction();
                        }
                    }}>
                </ButtonComponent>
            );
            let editButton: JSX.Element = (
                <ButtonComponent primary
                    content={ActionSDK.Localizer.getString("Edit")}
                    onClick={() => {
                        goToPage(Page.Main);
                    }}>
                </ButtonComponent>
            );
            return (
                <>
                    <Flex className="body-container">
                        <ResponsePage showTitle responseViewMode={ResponseViewMode.CreationPreview} />
                    </Flex>
                    <Flex className="footer-layout" gap={"gap.smaller"}>
                        {shouldShowNext === false ?
                            <Flex {...UxUtils.getTabKeyProps()} vAlign="center" className="pointer-cursor" onClick={() => {
                                goToPage(Page.Main);
                            }} >
                                <Icon name="chevron-down" rotate={90} xSpacing="after" size="small" />
                                {ActionSDK.Localizer.getString("Back")}
                            </Flex> : null
                        }
                        {
                            shouldShowNext === true ?
                                <>
                                    <FlexItem push>
                                        {editButton}
                                    </FlexItem>
                                    {sendButton}
                                </>
                                : <FlexItem push>
                                    {sendButton}
                                </FlexItem>
                        }
                        {this.setupSendSurveyDialog()}
                    </Flex>
                </>
            );
        }
    }

    private setupSendSurveyDialog() {
        return <Dialog
            open={getStore().isSendSurveyAlertOpen}
            onOpen={(e, { open }) => setSendSurveyAlertOpen(open)}
            cancelButton={getDialogButtonProps(ActionSDK.Localizer.getString("AllOptionalSendConfirmation"), ActionSDK.Localizer.getString("DontSend"))}
            confirmButton={getDialogButtonProps(ActionSDK.Localizer.getString("AllOptionalSendConfirmation"), ActionSDK.Localizer.getString("SendAnyway"))}
            content={
                <Text content={ActionSDK.Localizer.getString("NoRequiredQuestion")} />
            }
            header={ActionSDK.Localizer.getString("AllOptionalSendConfirmation")}
            onCancel={() => {
                setSendSurveyAlertOpen(false);
            }}
            onConfirm={() => {
                setSendSurveyAlertOpen(false);
                sendAction();
            }}
            className="optional-questions-alert-dialog"
            aria-label={ActionSDK.Localizer.getString("NoRequiredQuestion")}
        />
    }

    private renderSettingsPage() {
        let excludeSettingsSections: SettingsSections[] = [];
        if (getStore().context.ecsSettings && !getStore().context.ecsSettings.IsNotificationEnabled) {
            excludeSettingsSections.push(SettingsSections.NOTIFICATIONS);
        }
        let commonSettingsProps = {
            notificationSettings: getStore().settings.notificationSettings,
            resultVisibility: getStore().settings.resultVisibility,
            isResponseAnonymous: getStore().settings.isResponseAnonymous,
            isResponseEditable: getStore().settings.isResponseEditable,
            locale: getStore().context.locale,
            dueDate: getStore().settings.dueDate,
            isMultiResponseAllowed: getStore().settings.isMultiResponseAllowed,
            renderForMobile: UxUtils.renderingForMobile(),
            excludeSections: excludeSettingsSections,
            strings: this.getStringsForSettings(),
            onChange: (props: ISettingsComponentProps) => {
                updateSettings(props);
            },
            onMount: () => {
                UxUtils.setFocus(document.body, Constants.FOCUSABLE_ITEMS.All);
            }
        };
        if (UxUtils.renderingForMobile()) {
            let navBarComponentProps: INavBarComponentProps = {
                title: ActionSDK.Localizer.getString("Settings"),
                leftNavBarItem: {
                    icon: { name: "arrow-down", size: "large", rotate: 90 },
                    ariaLabel: ActionSDK.Localizer.getString("Back"),
                    onClick: () => {
                        goToPage(Page.Main);
                    },
                    type: NavBarItemType.BACK
                }
            };

            return (
                <Flex className="body-container no-mobile-footer" column>
                    <NavBarComponent {...navBarComponentProps} />
                    <SettingsMobile {...commonSettingsProps} />
                </Flex>
            );
        } else if (getStore().inPersonalAppMode) {
            return (
                <Dialog
                    className="personal-picker-dialog"
                    overlay={{
                        className: "dialog-overlay"
                    }}
                    open={getStore().openSettingDialog}
                    content={
                        <Flex className="setting-dialog-container" column gap="gap.medium">
                            <SettingsComponent {...commonSettingsProps} />
                        </Flex>
                    }
                    cancelButton={ActionSDK.Localizer.getString("Back")}
                    onCancel={() => {
                        setSettingDialogOpen(false)
                    }}
                />
            );
        } else {
            let settingsProps: ISettingsProps = {
                ...commonSettingsProps,
                onBack: () => {
                    goToPage(Page.Main);
                }
            };
            return <Settings {...settingsProps} />;
        }
    }

    private renderUpdateQuestionPage() {
        return <UpdateQuestionPage />;
    }

    private renderFooterSettingsSection() {
        return <SettingsSummaryComponent
            onRef={(element) => {
                this.settingsFooterComponentRef = element;
            }}
            dueDate={new Date(getStore().settings.dueDate)}
            resultVisibility={getStore().settings.resultVisibility}
            onClick={() => {
                goToPage(Page.Settings);
            }} />
    }

    private renderPersonalSettingsSection() {
        return (
            <Flex className="header-setting">
                {this.renderSettingsPage()}
                <SettingsSummaryComponent
                    onRef={(element) => {
                        this.settingsFooterComponentRef = element;
                    }}
                    dueDate={new Date(getStore().settings.dueDate)}
                    resultVisibility={getStore().settings.resultVisibility}
                    showDefaultTitle={true}
                    onClick={() => {
                        setSettingDialogOpen(true);
                    }} />
            </Flex >
        );
    }

    private questionView(): JSX.Element {
        let showTitleError: boolean = getStore().isValidationModeOn && isEmptyOrNull(getStore().title);
        return (
            <Flex column>
                <InputBox key="survey_title" defaultValue={getStore().title} fluid multiline
                    maxLength={240}
                    className="survey-title-container"
                    input={{
                        className: showTitleError ? "title-box invalid-title invalid-error" : "title-box"
                    }}
                    placeholder={ActionSDK.Localizer.getString("EnterSurveyTitle")} showError={showTitleError} errorText={ActionSDK.Localizer.getString("EmptySurveyTitle")}
                    onBlur={(e) => {
                        if ((e.target as HTMLInputElement).value !== getStore().title) {
                            updateTitle((e.target as HTMLInputElement).value);
                            setValidationMode(false);
                        }
                    }} />
                {
                    UxUtils.renderingForMobile() ?
                        <QuestionContainerMobile isValidationModeOn={getStore().isValidationModeOn} questions={toJS(getStore().questions)} />
                        :
                        <QuestionContainer
                            isValidationModeOn={getStore().isValidationModeOn}
                            questions={toJS(getStore().questions)}
                            activeQuestionIndex={getStore().activeQuestionIndex}
                            className={getStore().questions.length === 0 ? 'hidden' : 'visible'}
                        />
                }
                <Flex className="add-question-button-container">
                    <AdaptiveMenu
                        key="add_question"
                        renderAs={UxUtils.renderingForMobile() ? AdaptiveMenuRenderStyle.ACTIONSHEET : AdaptiveMenuRenderStyle.MENU}
                        content={this.getMenuContent()}
                        menuItems={[
                            this.getQuestionAdaptiveMenuItem('1', 'bullets', "Multichoice", ActionSDK.ActionInstanceColumnType.SingleOption, QuestionDisplayType.Select),
                            this.getQuestionAdaptiveMenuItem('2', 'format', "Text", ActionSDK.ActionInstanceColumnType.Text, QuestionDisplayType.None),
                            this.getQuestionAdaptiveMenuItem('3', 'call-dialpad', "Number", ActionSDK.ActionInstanceColumnType.Numeric, QuestionDisplayType.None),
                        ]}
                        dismissMenuAriaLabel={ActionSDK.Localizer.getString("DismissMenu")}
                    />
                </Flex>
                <label className={(getStore().isValidationModeOn && getStore().questions.length == 0 ? 'invalid' : 'hidden')} >{ActionSDK.Localizer.getString("EmptySurveyQuestions")}</label>
            </Flex>
        );
    }

    private getQuestionAdaptiveMenuItem(key: string, iconName: string, menuLabel: string, columnType: ActionSDK.ActionInstanceColumnType, displayType: QuestionDisplayType): AdaptiveMenuItem {
        let menuItem: AdaptiveMenuItem = {
            key: key,
            icon: { name: iconName, outline: true, className: "menu-icon" },
            content: <Text content={ActionSDK.Localizer.getString(menuLabel)} className="menu-icon" />,
            onClick: () => {
                let customProps = {};
                if (columnType == ActionSDK.ActionInstanceColumnType.SingleOption && displayType == QuestionDisplayType.FiveStar) {
                    customProps = { type: ActionSDK.Localizer.getString("StarText"), level: 5 };
                }
                addQuestion(columnType, displayType, customProps, UxUtils.renderingForMobile());
                setValidationMode(false);
            }
        }
        return menuItem;
    }

    private getMenuContent(): JSX.Element {
        return (
            <Button.Group
                aria-label={ActionSDK.Localizer.getString("AddQuestionSplitMenu")}
                buttons={[
                    {
                        key: "add",
                        icon: "add",
                        primary: true,
                        content: ActionSDK.Localizer.getString("AddQuestion"),
                        size: "large",
                        'aria-label': ActionSDK.Localizer.getString("AddQuestion"),
                        className: 'add-question-button',
                        id: ADDQUESTIONBUTTONID,
                        onClick: (e, props) => {
                            e.stopPropagation();
                            setValidationMode(false);
                            addQuestion(ActionSDK.ActionInstanceColumnType.SingleOption, QuestionDisplayType.Select, {}, UxUtils.renderingForMobile());
                        },
                        onKeyDown: (e) => {
                            //checking whether key pressed in Enter key and is not repeated by holding it down
                            if (!e.repeat && (e.keyCode || e.which) == Constants.CARRIAGE_RETURN_ASCII_VALUE) {
                                addQuestion(ActionSDK.ActionInstanceColumnType.SingleOption, QuestionDisplayType.Select, {}, UxUtils.renderingForMobile());
                            }
                        }
                    },
                    {
                        key: "show-menu",
                        icon: { name: "chevron-down", size: "small" },
                        iconOnly: true,
                        primary: true,
                        'aria-label': ActionSDK.Localizer.getString("AddMoreQuestions"),
                        size: "large",
                        className: 'show-menu-button'
                    }
                ]}
                id="add-question"
            />
        );
    }

    getStringsForSettings(): ISettingsComponentStrings {
        let settingsComponentStrings: ISettingsComponentStrings = {
            dueBy: ActionSDK.Localizer.getString("dueBy"),
            multipleResponses: ActionSDK.Localizer.getString("multipleResponses"),
            notifications: ActionSDK.Localizer.getString("notifications"),
            notificationsAsResponsesAsReceived: ActionSDK.Localizer.getString("notificationsAsResponsesAsReceived"),
            notificationsEverydayAt: ActionSDK.Localizer.getString("notificationsEverydayAt"),
            notificationsNever: ActionSDK.Localizer.getString("notificationsNever"),
            responseOptions: ActionSDK.Localizer.getString("responseOptions"),
            resultsVisibleTo: ActionSDK.Localizer.getString("resultsVisibleTo"),
            resultsVisibleToAll: ActionSDK.Localizer.getString("resultsVisibleToAll"),
            resultsVisibleToSender: ActionSDK.Localizer.getString("resultsVisibleToSender"),
            datePickerPlaceholder: ActionSDK.Localizer.getString("datePickerPlaceholder"),
            timePickerPlaceholder: ActionSDK.Localizer.getString("timePickerPlaceholder")
        }
        return settingsComponentStrings;
    }

    private getPersonalAppCreationView(): JSX.Element {
        const coverImageData = getStore().coverImageData;
        let url = "";
        if (coverImageData && coverImageData.coverImage) {
            url = coverImageData.coverImage.url;
        }
        return (
            <>
                {this.getPersonalViewHeader()}
                <Flex>
                    <Flex className="personal-app-body">
                        <Flex className="image-selector-parent">
                            {coverImageData && coverImageData.coverImage && <img src={coverImageData.coverImage.url} className="header-cover-image" />}
                            <Flex vAlign="end" hAlign="end">
                                <ImageCropper
                                    url={url}
                                    height={200}
                                    width={800}
                                    shadedDivWidthFraction={0}
                                />
                            </Flex>
                        </Flex>
                        {this.questionView()}
                    </Flex>
                </Flex>

                <Flex className="personal-footer-layout" gap={"gap.small"}>
                    <FlexItem push>
                        <Button primary content={ActionSDK.Localizer.getString("Preview")} onClick={() => {
                            previewAction();
                        }} />
                    </FlexItem>
                </Flex>
            </>
        );
    }

    private getPersonalViewHeader(): JSX.Element {
        return (
            <Flex space="between" className="header-container">
                <Flex gap="gap.small" onClick={() => { getStore().currentPage == Page.Main ? this.handleBackPress() : goToPage(Page.Main) }}>
                    < Icon name="chevron-down" rotate={90} />
                    <Text content={getStore().currentPage == Page.Main ? ActionSDK.Localizer.getString("CreateSurvey") : ActionSDK.Localizer.getString("Preview")} weight="bold" size="medium" color="brand" />
                </Flex>
                <Flex gap="gap.small" vAlign="center">
                    {this.renderPersonalSettingsSection()}
                    {this.getMenu()}
                    <ButtonComponent secondary className="secondary-button"
                        content={ActionSDK.Localizer.getString("Close")}
                        onClick={() => {
                            this.handleBackPress();
                        }} />
                </Flex>
            </Flex>
        );
    }

    private handleBackPress(actionInstance?: ActionSDK.ActionInstance, error?: ActionSDK.ActionError) {
        resetSurveyToDefault();
        this.props.onBackPress(actionInstance, error);
    }

    private getMenu() {
        let menuItems: AdaptiveMenuItem[] = this.getMenuItems();
        if (menuItems.length == 0) {
            return null;
        }
        return (
            <AdaptiveMenu
                key="header_options"
                renderAs={AdaptiveMenuRenderStyle.MENU}
                content={<Icon name="more" outline className="header-menu" />}
                menuItems={menuItems}
                dismissMenuAriaLabel={ActionSDK.Localizer.getString("DismissMenu")}
            />
        );
    }

    getMenuItems(): AdaptiveMenuItem[] {
        let menuItemList: AdaptiveMenuItem[] = [];

        let deleteSurvey: AdaptiveMenuItem = {
            key: "changeDueDate",
            content: ActionSDK.Localizer.getString("deleteSurvey"),
            icon: {},
            onClick: () => {
            }
        };
        menuItemList.push(deleteSurvey);
        return menuItemList;
    }

}
