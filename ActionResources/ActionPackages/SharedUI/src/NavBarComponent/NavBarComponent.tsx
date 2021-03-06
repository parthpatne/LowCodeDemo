import * as React from 'react';

import { Icon, IconProps, Flex, Text } from '@stardust-ui/react';

import * as ActionSDK from "@actionSDK";

import './NavBarComponent.scss';

export enum NavBarItemType {
    BACK
}

export interface INavBarItem {
    title?: string;
    icon?: IconProps;
    type?: NavBarItemType;
    ariaLabel?: string;
    className?: string;
    onClick?: () => void;
}

export interface INavBarComponentProps {
    title: string;
    leftNavBarItem?: INavBarItem;
    rightNavBarItem?: INavBarItem;
}

export class NavBarComponent extends React.PureComponent<INavBarComponentProps> {
    private isBackButtonHandlerRegistered: boolean;

    componentWillMount() {
        this.registerBackButtonHandlerIfRequired(this.props.leftNavBarItem);
        this.registerBackButtonHandlerIfRequired(this.props.rightNavBarItem);
    }

    private registerBackButtonHandlerIfRequired(navBarItem: INavBarItem) {
        if (!navBarItem) {
            return;
        }
        if (navBarItem.type == NavBarItemType.BACK && navBarItem.onClick) {
            ActionSDK.APIs.registerBackButtonHandler(() => {
                navBarItem.onClick();
            });
            this.isBackButtonHandlerRegistered = true;
        }
    }

    componentWillUnmount() {
        if (this.isBackButtonHandlerRegistered) {
            ActionSDK.APIs.registerBackButtonHandler(null);
        }
    }

    render() {
        return (
            <>
                <div className="nav-container">
                    {this.getNavBarItem(this.props.leftNavBarItem)}
                    <label className="nav-title">{this.props.title}</label>
                    {this.getNavBarItem(this.props.rightNavBarItem)}
                </div>
                <div className="nav-bar-offset-height" />
            </>
        );
    }

    private getNavBarItem(navBarItem: INavBarItem) {
        if (!navBarItem) {
            return null;
        }
        let navBarItemClassName = "nav-bar-item-default" + (navBarItem.className ? " " + navBarItem.className : "");
        return (
            <Flex vAlign="center"
                className={navBarItemClassName}
                role="button"
                aria-label={navBarItem.ariaLabel}
                onClick={() => { navBarItem.onClick() }}
                tabIndex={0}
            >
                {navBarItem.icon ? <Icon {...navBarItem.icon} /> : null}
                {navBarItem.title ? <Text className="nav-bar-item-text" content={navBarItem.title} /> : null}
            </Flex>
        );
    }
}