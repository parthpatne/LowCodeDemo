"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var web_1 = require("recyclerlistview/web");
var react_1 = require("@stardust-ui/react");
require("./RecyclerViewComponent.scss");
var RecyclerViewType;
(function (RecyclerViewType) {
    RecyclerViewType[RecyclerViewType["Header"] = 0] = "Header";
    RecyclerViewType[RecyclerViewType["Item"] = 1] = "Item";
    RecyclerViewType[RecyclerViewType["Footer"] = 2] = "Footer";
})(RecyclerViewType = exports.RecyclerViewType || (exports.RecyclerViewType = {}));
var RecyclerViewComponent = /** @class */ (function (_super) {
    __extends(RecyclerViewComponent, _super);
    function RecyclerViewComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.layoutProvider = null;
        _this.dataProvider = new web_1.DataProvider(function (r1, r2) {
            return r1 !== r2;
        });
        _this.initialize(props);
        return _this;
    }
    RecyclerViewComponent.prototype.shouldComponentUpdate = function (nextProps) {
        if (nextProps !== this.props) {
            this.updateDataProvider(nextProps);
        }
        return true;
    };
    RecyclerViewComponent.prototype.initialize = function (props) {
        var _this = this;
        //Create the layout provider
        //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
        //Second: Given a type and object set the height and width for that type on given object
        this.layoutProvider = new web_1.LayoutProvider(function (index) {
            if (_this.props.showHeader && index == 0) {
                return RecyclerViewType.Header;
            }
            else if (_this.props.showFooter && index == _this.dataProvider.getSize() - 1) {
                return RecyclerViewType.Footer;
            }
            else {
                return RecyclerViewType.Item;
            }
        }, function (type, dim) {
            if (_this.props.gridWidth) {
                dim.width = _this.props.gridWidth;
            }
            else {
                dim.width = window.innerWidth;
            }
            dim.height = _this.props.rowHeight;
        });
        this.updateDataProvider(props);
    };
    RecyclerViewComponent.prototype.updateDataProvider = function (props) {
        var data = props.data;
        var dataRow = [];
        if (props.showHeader) {
            dataRow.push(props.showHeader);
        }
        dataRow = dataRow.concat(data);
        if (props.showFooter) {
            dataRow.push(props.showFooter);
        }
        this.dataProvider = this.dataProvider.cloneWithRows(dataRow);
    };
    RecyclerViewComponent.prototype.getViewProps = function () {
        return {
            forceNonDeterministicRendering: true
        };
    };
    RecyclerViewComponent.prototype.render = function () {
        var _this = this;
        return (React.createElement(react_1.Flex, { fill: true, column: true, className: "recycler-container" },
            React.createElement(web_1.RecyclerListView, __assign({ key: this.props.gridWidth, rowHeight: this.props.rowHeight, layoutProvider: this.layoutProvider, dataProvider: this.dataProvider, rowRenderer: function (type, data, index) {
                    return _this.props.onRowRender(type, index, data);
                } }, this.props.nonDeterministicRendering ? this.getViewProps() : {}))));
    };
    return RecyclerViewComponent;
}(React.Component));
exports.RecyclerViewComponent = RecyclerViewComponent;
