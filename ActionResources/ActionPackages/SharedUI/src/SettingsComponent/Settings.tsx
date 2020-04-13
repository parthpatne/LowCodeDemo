import * as React from 'react';
import { Icon, Flex, Text } from '@stardust-ui/react';
import { UxUtils, ISettingsComponentProps, SettingsComponent } from '@sharedUI';
import * as ActionSDK from "@actionSDK";

export interface ISettingsProps extends ISettingsComponentProps {
    onBack: () => void;
}

export class Settings extends React.PureComponent<ISettingsProps> {

    render() {
        return (
            <Flex className="body-container" column gap="gap.medium">
                <SettingsComponent {...this.props} />
                {this.getBackElement()}
            </Flex>
        );
    }


    private getBackElement() {
        if (!this.props.renderForMobile) {
            return (
                <Flex className="footer-layout" gap={"gap.smaller"}>
                    <Flex vAlign="center" className="pointer-cursor" {...UxUtils.getTabKeyProps()} onClick={() => {
                        this.props.onBack();
                    }} >
                        <Icon name="chevron-down" rotate={90} xSpacing="after" size="small" />
                        <Text content={ActionSDK.Localizer.getString("Back")} />
                    </Flex>
                </Flex>
            );
        }
    }
}