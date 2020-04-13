import * as React from "react";
import './ErrorView.scss';
import {
    Flex,
    Text
} from "@stardust-ui/react";
import * as ActionSDK from "@actionSDK";
import { ButtonComponent } from "../Button";
import { genericError } from "../images";

export interface IErrorViewProps {
    image?: string;
    title: string;
    subtitle?: string;
    buttonTitle: string;
}

export class ErrorView extends React.Component<IErrorViewProps, any> {

    render() {

        let image: string = this.props.image;
        if (ActionSDK.Utils.isEmptyString(this.props.image)) {
            image = genericError;
        }
        return (
            <Flex column gap="gap.large" fill className="body-container display-flex" hAlign="center" vAlign="center">
                <Flex column className="error-view-container">
                    <img src={image} className="error-view-image" />
                    <Text className="error-view-title">{this.props.title}</Text>
                    {!ActionSDK.Utils.isEmptyString(this.props.subtitle) && <Text className="error-view-subtitle">{this.props.subtitle}</Text>}
                </Flex>
                <ButtonComponent
                    primary
                    content={this.props.buttonTitle}
                    className="error-view-button"
                    onClick={() => {
                        ActionSDK.APIs.dismissScreen();
                    }}
                />
            </Flex>
        );
    }
}
