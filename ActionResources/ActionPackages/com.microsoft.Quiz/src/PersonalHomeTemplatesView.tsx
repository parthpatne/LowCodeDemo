import * as React from "react";
import * as ReactDOM from "react-dom";
import { PersonalHomePage } from "./components/personalHome/PersonalHomePage";
import { ActionRootView } from "@sharedUI";

ReactDOM.render(
    <ActionRootView >
        <PersonalHomePage showTemplatesOnly />
    </ActionRootView>,
    document.getElementById("root"));