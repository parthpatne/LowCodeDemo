"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("@stardust-ui/react");
require("./ActionRootView.scss");
var ActionSDK = require("@actionSDK");
var ErrorView_1 = require("../ErrorView");
var images_1 = require("../images");
var ActionRootView = /** @class */ (function (_super) {
    __extends(ActionRootView, _super);
    function ActionRootView(props) {
        var _this = _super.call(this, props) || this;
        _this.LOG_TAG = "ActionRootView";
        _this.state = {
            hostContext: null,
            stringsInitialized: false
        };
        return _this;
    }
    ActionRootView.prototype.componentWillMount = function () {
        var _this = this;
        ActionSDK.APIs.getCurrentContext().
            then(function (context) {
            _this.setState({
                hostContext: context
            });
        });
    };
    ActionRootView.prototype.render = function () {
        var _this = this;
        if (!this.state.hostContext) {
            return null;
        }
        document.body.className = this.getClassNames();
        document.body.setAttribute("data-hostclienttype", this.state.hostContext.hostClientType);
        document.body.dir = ActionSDK.Utils.isRTL(this.state.hostContext.locale) ? "rtl" : "ltr";
        // Below line create the span for live text.
        ActionSDK.Utils.announceText("");
        return (React.createElement(react_1.Provider, { theme: this.getTheme(), rtl: ActionSDK.Utils.isRTL(this.state.hostContext.locale) },
            (function () {
                if (_this.state.hostContext.ecsSettings.IsUnsupportedView) {
                    _this.logInfo("Unsupported View");
                    ActionSDK.APIs.actionViewDidLoad(true /*success*/);
                    return _this.getUnsupportedPlatformErrorView();
                }
                else if (_this.shouldShowChatLieError()) {
                    _this.logInfo("Chat lie error occured");
                    ActionSDK.APIs.actionViewDidLoad(true /*success*/);
                    return _this.getChatLieErrorView();
                }
                else {
                    return _this.props.children;
                }
            })(),
            React.createElement(react_1.Flex, { className: "debug-view-setting" }, this.state.hostContext.environment != ActionSDK.ActionEnvironment.Prod ? React.createElement(react_1.Icon, { className: "pointer-cursor", name: "eye", size: 'small', onClick: function () {
                    ActionSDK.APIs.showDiagnosticView();
                } }) : null)));
    };
    ActionRootView.prototype.shouldShowChatLieError = function () {
        var conversationId = this.state.hostContext.conversationInfo.id;
        if (ActionSDK.Utils.isEmptyString(conversationId) || conversationId.search("preview") != -1) {
            var customPropsJson = JSON.parse(this.state.hostContext.customProps);
            if (!(customPropsJson["viewName"] == "PersonalHomeView" || customPropsJson["viewName"] == "PersonalHomeTemplatesView")) {
                return true;
            }
        }
        return false;
    };
    ActionRootView.prototype.getTheme = function () {
        switch (this.state.hostContext.theme) {
            case "contrast":
                return react_1.themes.teamsHighContrast;
            case "dark":
                return react_1.themes.teamsDark;
            default:
                return react_1.themes.teams;
        }
    };
    ActionRootView.prototype.getClassNames = function () {
        var classNames = [];
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
        }
        else if (this.state.hostContext.hostClientType == "ios") {
            classNames.push("client-mobile");
            classNames.push("client-ios");
        }
        else if (this.state.hostContext.hostClientType == "web") {
            classNames.push("desktop-web");
            classNames.push("web");
        }
        else if (this.state.hostContext.hostClientType == "desktop") {
            classNames.push("desktop-web");
            classNames.push("desktop");
        }
        else {
            classNames.push("desktop-web");
        }
        return classNames.join(" ");
    };
    ActionRootView.prototype.getUnsupportedPlatformErrorView = function () {
        // As this is a temporary solution due to Teams Android
        // bug# 3748272 we are not localizing any strings
        var subtitle = "";
        switch (this.state.hostContext.hostClientType) {
            case "android":
                subtitle = "Creation experience is currently not available on Android. Go ahead and use it from your PC";
                break;
            case "ios":
                subtitle = "Creation experience is currently not available on iOS. Go ahead and use it from your PC";
                break;
        }
        return React.createElement(ErrorView_1.ErrorView, { image: images_1.unsupportedPlatformError, title: "Coming Soon!", subtitle: subtitle, buttonTitle: "OK" });
    };
    ActionRootView.prototype.getChatLieErrorView = function () {
        // Initializing strings only if required
        if (!this.state.stringsInitialized) {
            this.initializeLocalizedStrings();
            return null;
        }
        return React.createElement(ErrorView_1.ErrorView, { image: images_1.chatLieError, title: ActionSDK.Localizer.getString("ChatLieErrorText"), buttonTitle: ActionSDK.Localizer.getString("GotIt") });
    };
    ActionRootView.prototype.initializeLocalizedStrings = function () {
        var _this = this;
        if (!this.state.stringsInitialized) {
            ActionSDK.Localizer.initialize()
                .then(function () {
                _this.setState({
                    stringsInitialized: true
                });
            });
        }
    };
    ActionRootView.prototype.logInfo = function (logMessage) {
        ActionSDK.Logger.logInfo(this.LOG_TAG, logMessage);
        ActionSDK.Logger.logDiagnostic(this.LOG_TAG, logMessage);
    };
    return ActionRootView;
}(React.Component));
exports.ActionRootView = ActionRootView;
