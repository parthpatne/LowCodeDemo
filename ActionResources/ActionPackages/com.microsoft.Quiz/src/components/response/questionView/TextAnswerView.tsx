import * as React from 'react';
import { IQuestionProps, QuestionView } from './QuestionView';
import * as ActionSDK from "@actionSDK";
import { InputBox } from '@sharedUI';
import { IInputBoxProps } from '@sharedUI';

export class TextAnswerView extends React.Component<IQuestionProps> {
    render() {
        let value: string = this.props.response as string;
        let props: IInputBoxProps = {
            fluid: true,
            maxLength: 4000,
            multiline: true,
            placeholder: ActionSDK.Localizer.getString("EnterAnswer")
        };
        if (this.props.editable) {
            props = {
                ...props,
                defaultValue: value,
                onBlur: (e) => {
                    this.props.updateResponse((e.target as HTMLInputElement).value);
                }
            }
        } else {
            props = {
                ...props,
                value: value,
                disabled: true,
                className: 'break-word'
            }
        }
        return (
            <QuestionView {...this.props}>
                <InputBox {...props} />
            </QuestionView>
        );
    }
}