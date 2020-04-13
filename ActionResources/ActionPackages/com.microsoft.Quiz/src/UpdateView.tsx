import * as React from "react";
import * as ReactDOM from "react-dom";
import ResponseRenderer from "./components/response/ResponseRenderer";
import { initialize } from "./actions/ResponseActions";
import { ActionRootView } from "@sharedUI";

initialize();
ReactDOM.render(
    <ActionRootView>
        <ResponseRenderer />
    </ActionRootView>,
    document.getElementById("root"));
