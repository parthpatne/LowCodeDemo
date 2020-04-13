import React = require("react");
import * as ActionSDK from "@actionSDK";
import { Input } from "@stardust-ui/react";

const allowedImageTypes = ["jpg", "jpeg", "png"];
interface ImagePickerProps {
    trigger: JSX.Element; // HTML element whose onClick triggers file-input control
    onCancel?: () => void;
    onFileSelected: (image: ActionSDK.Attachment) => void;
}

export class ImagePicker extends React.Component<
    ImagePickerProps,
    any
    > {
    private imageObj: ActionSDK.Attachment;
    private inputRef: React.RefObject<HTMLInputElement>;
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

    render() {
        return (
            <div onClick={e => this.inputRef.current.click()}>
                <Input
                    type="file"
                    inputRef={this.inputRef}
                    id="coverImageInput"
                    onChange={this.onSelectFile}
                    accept="image/x-png,image/gif,image/jpeg"
                    style={{ display: "none" }}
                />
                {this.props.trigger}
            </div>
        );
    }

    private onSelectFile = e => {
        if (e.target.files && e.target.files.length == 1) {
            const file = e.target.files[0];

            const extBeginIndex = file.name.lastIndexOf(".") + 1;
            const fileExt = file.name.substring(extBeginIndex);
            if (!allowedImageTypes.includes(fileExt.toLowerCase())) {
                return;
            }

            this.imageObj = {
                type: ActionSDK.AttachmentType.Image,
                name: file.name,
                id: ActionSDK.Utils.generateGUID(),
                bytes: file.size,
                url: window.URL.createObjectURL(file)
            };

            if (this.props.onFileSelected)
                this.props.onFileSelected(this.imageObj);
        }
    };
}
