export enum LogMetric {
    WebApiCall = "WebApiCall", // Time spent in generic apis
    KasWebApiCall = "KasWebApiCall", // Time spent in KAS apis
    ActionSdkApiCall = "ActionSdkApiCall", // Time spent in Action SDK apis
    TeamsTokenFetch = "TeamsTokenFetch", // Time spent in fetching Teams auth token
    ActionHostLoad = "ActionHostLoad", // Time spent in loading Action host
    ActionViewLoad = "ActionViewLoad", // Time spent from action host load start to action view load end
    ActionViewEngagement = "ActionViewEngagement", // Total time user stayed on an Action view, from load to unload
}