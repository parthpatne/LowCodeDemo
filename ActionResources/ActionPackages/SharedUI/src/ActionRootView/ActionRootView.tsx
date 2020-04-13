import * as React from 'react';
import { Flex, Icon, Provider, themes, ThemePrepared } from '@stardust-ui/react'
import './ActionRootView.scss';
import * as ActionSDK from "@actionSDK";
import { ErrorView } from "../ErrorView";
import { chatLieError, unsupportedPlatformError, actionDeletedError } from "../images";

interface IActionRootViewState {
    hostContext: ActionSDK.ActionContext;
    stringsInitialized: boolean;
    shouldBlockCreationInMeeting: boolean;
    meetingMemberCount?: number;
}
export class ActionRootView extends React.Component<any, IActionRootViewState> {

    private LOG_TAG = "ActionRootView";

    constructor(props: any) {
        super(props);
        this.state = {
            hostContext: null,
            stringsInitialized: false,
            shouldBlockCreationInMeeting: false
        }
    }

    componentWillMount() {
        ActionSDK.APIs.getCurrentContext().
            then((context: ActionSDK.ActionContext) => {

                if (context.ecsSettings.MeetingMaxGroupCount == 0 && this.isMeetingConversation(context)) {
                    this.setState({
                        hostContext: context,
                        shouldBlockCreationInMeeting: true
                    });
                } else if (context.ecsSettings.MeetingMaxGroupCount > 0 && this.isMeetingConversation(context)) {
                    ActionSDK.APIs.getConversationMembersCount(context.conversationInfo, context.actionInstanceId).
                        then((memberCount: ActionSDK.MemberCount) => {
                            this.setState({
                                hostContext: context,
                                shouldBlockCreationInMeeting: (memberCount.count > context.ecsSettings.MeetingMaxGroupCount),
                                meetingMemberCount: memberCount.count
                            });
                        }).
                        catch((error: ActionSDK.ActionError) => {
                            this.logInfo(error != null ?
                                error.errorMessage :
                                "Couldn't fetch conversation member count");
                            this.setState({
                                hostContext: context
                            })
                        });
                } else {
                    this.setState({
                        hostContext: context
                    })
                }
            });
    }

    isMeetingConversation(context: ActionSDK.ActionContext): boolean {
        return (context.conversationInfo.id.search("meeting") != -1 &&
            ActionSDK.Utils.isEmptyString(context.conversationInfo.aadObjectId));
    }

    render() {

        if (!this.state.hostContext) {
            return null;
        }

        document.body.className = this.getClassNames();
        document.body.setAttribute("data-hostclienttype", this.state.hostContext.hostClientType);
        document.body.dir = ActionSDK.Utils.isRTL(this.state.hostContext.locale) ? "rtl" : "ltr";

        // Below line create the span for live text.
        ActionSDK.Utils.announceText("");

        return (
            <Provider theme={this.getTheme()} rtl={ActionSDK.Utils.isRTL(this.state.hostContext.locale)}>
                {
                    (() => {
                        if (this.state.hostContext.ecsSettings.IsUnsupportedView) {
                            this.logInfo("Unsupported View");
                            ActionSDK.APIs.actionViewDidLoad(true /*success*/);
                            return this.getUnsupportedPlatformErrorView();
                        }
                        else if (this.shouldShowChatLieError()) {
                            this.logInfo("Chat lie error occured");
                            ActionSDK.APIs.actionViewDidLoad(true /*success*/);
                            return this.getChatLieErrorView();
                        } else if (this.state.shouldBlockCreationInMeeting) {
                            let context: ActionSDK.ActionContext = this.state.hostContext;
                            this.logInfo(`Blocking creation in meeting, actual member count - ${this.state.meetingMemberCount}, max count - ${context.ecsSettings.MeetingMaxGroupCount}`);
                            ActionSDK.APIs.actionViewDidLoad(true /*success*/);
                            return this.getMeetingErrorView();
                        } else {
                            return this.props.children;
                        }
                    })()
                }
                <Flex className="debug-view-setting">
                    {this.state.hostContext.environment != ActionSDK.ActionEnvironment.Prod ? <Icon className="pointer-cursor" name="eye" size='small' onClick={() => {
                        ActionSDK.APIs.showDiagnosticView();
                    }} /> : null}
                </Flex>
            </Provider>
        );
    }

    private shouldShowChatLieError(): boolean {
        let conversationId = this.state.hostContext.conversationInfo.id;
        if (ActionSDK.Utils.isEmptyString(conversationId) || conversationId.search("preview") != -1) {
            let customPropsJson = JSON.parse(this.state.hostContext.customProps);
            if (!(customPropsJson["viewName"] == "PersonalHomeView" || customPropsJson["viewName"] == "PersonalHomeTemplatesView")) {
                return true;
            }
        }

        return false;
    }

    private getTheme(): ThemePrepared {
        switch (this.state.hostContext.theme) {
            case "contrast":
                return themes.teamsHighContrast;

            case "dark":
                return themes.teamsDark;

            default:
                return themes.teams;
        }
    }

    private getClassNames(): string {
        let classNames: string[] = [];

        switch (this.state.hostContext.theme) {
            case "contrast":
                classNames.push("theme-contrast");
                break;
            case "dark":
                classNames.push("theme-dark");
                break;
            case "default":
                classNames.push("theme-default");
                break;
            default:
                break;
        }

        if (this.state.hostContext.hostClientType == "android") {
            classNames.push("client-mobile");
            classNames.push("client-android");
        } else if (this.state.hostContext.hostClientType == "ios") {
            classNames.push("client-mobile");
            classNames.push("client-ios");
        } else if (this.state.hostContext.hostClientType == "web") {
            classNames.push("desktop-web");
            classNames.push("web");
        } else if (this.state.hostContext.hostClientType == "desktop") {
            classNames.push("desktop-web");
            classNames.push("desktop");
        } else {
            classNames.push("desktop-web");
        }

        return classNames.join(" ");
    }

    private getUnsupportedPlatformErrorView() {
        // As this is a temporary solution due to Teams Android
        // bug# 3748272 we are not localizing any strings
        let subtitle = "";
        switch (this.state.hostContext.hostClientType) {
            case "android":
                subtitle = "Creation experience is currently not available on Android. Go ahead and use it from your PC"
                break;
            case "ios":
                subtitle = "Creation experience is currently not available on iOS. Go ahead and use it from your PC"
                break;
        }
        return <ErrorView
            image={unsupportedPlatformError}
            title="Coming Soon!"
            subtitle={subtitle}
            buttonTitle="OK"
        />;
    }

    private getChatLieErrorView() {
        // Initializing strings only if required
        if (!this.state.stringsInitialized) {
            this.initializeLocalizedStrings();
            return null;
        }
        return <ErrorView
            image={chatLieError}
            title={ActionSDK.Localizer.getString("ChatLieErrorText")}
            buttonTitle={ActionSDK.Localizer.getString("GotIt")}
        />;
    }

    private getMeetingErrorView() {
        // Initializing strings only if required
        if (!this.state.stringsInitialized) {
            this.initializeLocalizedStrings();
            return null;
        }
        let errorTitle: string = (this.state.hostContext.ecsSettings.MeetingMaxGroupCount > 1) ?
            ActionSDK.Localizer.getString("Meeting_X_ErrorText",
                this.state.hostContext.ecsSettings.MeetingMaxGroupCount) :
            ActionSDK.Localizer.getString("MeetingErrorText");
        return <ErrorView
            image={actionDeletedError}
            title={errorTitle}
            buttonTitle={ActionSDK.Localizer.getString("GotIt")}
        />;
    }

    private initializeLocalizedStrings() {
        if (!this.state.stringsInitialized) {
            ActionSDK.Localizer.initialize()
                .then(() => {
                    this.setState({
                        stringsInitialized: true
                    })
                });
        }
    }

    private logInfo(logMessage: string) {
        ActionSDK.Logger.logInfo(this.LOG_TAG, logMessage);
        ActionSDK.Logger.logDiagnostic(this.LOG_TAG, logMessage);
    }
}