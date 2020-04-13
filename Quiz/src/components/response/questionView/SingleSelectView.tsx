import * as React from 'react';
import { QuestionView, IMultiChoiceProps } from './QuestionView';
import { RadioGroup } from '@stardust-ui/react';
import * as ActionSDK from "@actionSDK";
import '../../../css/Response.scss';
import { UxUtils } from '@sharedUI';


export class SingleSelectView extends React.Component<IMultiChoiceProps> {

    render() {
        let response: string = this.props.response as string;
        return (
            <QuestionView {...this.props}>
                <RadioGroup
                    vertical
                    items={this.getItems(this.props.options)}
                    checkedValue={!this.props.isPreview ? response : -1}
                    checkedValueChanged={!this.props.isPreview ? (event, data) => {
                        this.props.updateResponse(data.value);
                    } : null} />
            </QuestionView>
        );
    }

    private getItems(options: ActionSDK.ActionInstanceColumnOption[]): any[] {
        let opts: any[] = [];
        let className = "single-select";
        if (this.props.editable) {
            className = className + " pointer-cursor-important";
        }
        for (let i = 0; i < options.length; i++) {
            opts.push({
                key: options[i].id,
                label: options[i].title,
                value: options[i].id,
                icon: {
                    name: 'stardust-circle',
                    size: 'medium',
                    'aria-disabled': !this.props.editable,
                    className: (this.props.response == i && !this.props.editable) ? 'icon-disabled' : ''
                },
                disabled: !this.props.editable && !this.props.isPreview,
                'aria-disabled': !this.props.editable,
                className: i !== options.length - 1 ? "single-select options-space" : "single-select",
                tabIndex: this.props.editable ? 0 : -1,
                role: "radio"
            });


        }

        return opts;
    }
}