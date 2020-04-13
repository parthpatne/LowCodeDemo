import * as React from 'react';
import getStore, { ResponseViewMode } from "../../store/response/Store";
import { Flex, Text } from '@stardust-ui/react';
import '../../css/Response.scss';
import { observer } from 'mobx-react';
import { updateResponse } from '../../actions/ResponseActions';
import * as ActionSDK from "@actionSDK";
import { getCoverImage } from '../../common/Utils';
import ResponseView from './ResponseView';
import { UxUtils } from '@sharedUI';

export interface IResponsePage {
    showTitle?: boolean;
    responseViewMode: ResponseViewMode;
}

@observer
export default class ResponsePage extends React.Component<IResponsePage, any> {

    render() {
        const coverImage = getCoverImage(getStore().actionInstance);
        return (
            <Flex gap='gap.smaller' column>
                {coverImage && <img src={coverImage.url} className="header-cover-image" />}
                {UxUtils.renderingForMobile() &&
                    getStore().responseSubmissionFailed &&
                    <Text content={ActionSDK.Localizer.getString("ResponseSubmitError")}
                        className="response-error" error />}
                {this.props.showTitle ? <><Text content={getStore().actionInstance.title} className="survey-title" /></> : null}
                <ol className={"ol-container"}>
                    {this.questionView()}
                </ol>
            </Flex>
        );
    }


    private questionView(): JSX.Element {
        let questionsView: JSX.Element[] = [];
        getStore().actionInstance.columns.forEach((column: ActionSDK.ActionInstanceColumn, index: number) => {
            const questionView: JSX.Element = (<ResponseView
                isValidationModeOn={getStore().isValidationModeOn}
                questionNumber={index + 1}
                actionInstanceColumn={column}
                response={getStore().response.row[column.id]}
                callback={(response: any) => {
                    updateResponse(index, response);
                }}
                setErroredFocus={getStore().topMostErrorIndex === index + 1}
                responseState={this.props.responseViewMode}
                locale={getStore().context ? getStore().context.locale : undefined}
            />);
            questionsView.push(<div className="bottom-space">{questionView}</div>);
        });
        return <Flex column>{questionsView}</Flex>
    }
}