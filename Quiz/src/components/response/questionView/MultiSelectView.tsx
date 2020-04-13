import * as React from 'react';
import { QuestionView, IMultiChoiceProps } from './QuestionView';
import { Checkbox } from '@stardust-ui/react';
import { UxUtils } from '@sharedUI';
import '../../../css/Response.scss'

export class MultiSelectView extends React.Component<IMultiChoiceProps> {

    private selectedOption: string[] = [];

    render() {
        let options: JSX.Element[] = [];
        let response: string[] = this.props.response ? JSON.parse(this.props.response) as string[] : [];
        this.selectedOption = response;
        let className = "multi-select";
        if (this.props.editable) {
            className = className + " pointer-cursor";
        } else if (this.props.isPreview) {
            className = className + " default-cursor";
        }
        for (let i = 0; i < this.props.options.length; i++) {
            options.push(<Checkbox
                role="checkbox"
                label={this.props.options[i].title}
                key={this.props.options[i].id}
                checked={response ? this.isOptionSelected(i, response) : null}
                disabled={!this.props.editable && !this.props.isPreview}
                aria-disabled={!this.props.editable}
                tabIndex={this.props.editable ? 0 : -1}
                onChange={!this.props.isPreview ? (event, data) => {
                    this.updateSelection(this.props.options[i].id, data.checked);
                } : null}
                className={(!this.props.editable && this.isOptionSelected(i, response)) ? className + " disabled-selected-item" : className}
            />);
        }

        return (
            <QuestionView {...this.props}>
                {options}
            </QuestionView>
        );
    }

    private updateSelection(id: string, checked: boolean) {
        if (checked) {
            this.selectedOption.push(id);
        } else {
            this.selectedOption.splice(this.selectedOption.indexOf(id), 1);
        }

        this.props.updateResponse(this.selectedOption);
    }

    private isOptionSelected(index: number, response) {
        return response.indexOf(this.props.options[index].id) != -1;
    }

}