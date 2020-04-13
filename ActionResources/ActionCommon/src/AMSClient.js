"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _actionCommon_1 = require("@actionCommon");
var IMAGE_OBJECT_TYPE = "pish/image";
// Task: 3726644 to remove this
var baseUrl = "https://absharstorage.blob.core.windows.net/createfromblob1/";
var AMSClient = /** @class */ (function () {
    function AMSClient() {
    }
    AMSClient.uploadBlob = function (imageObj, sasToken) {
        return __awaiter(this, void 0, void 0, function () {
            var blob, fileName, url, imageData, uploadResponse, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch(imageObj.url).then(function (r) { return r.blob(); })];
                    case 1:
                        blob = _a.sent();
                        fileName = imageObj.id;
                        url = "" + baseUrl + fileName + sasToken;
                        return [4 /*yield*/, _actionCommon_1.Utils.readBlobAsync(blob)];
                    case 2:
                        imageData = _a.sent();
                        return [4 /*yield*/, fetch(url, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "image/png",
                                    "x-ms-client-version": "2015-02-21",
                                    "x-ms-date": new Date().toString(),
                                    "x-ms-blob-type": "BlockBlob"
                                },
                                body: imageData
                            })];
                    case 3:
                        uploadResponse = _a.sent();
                        if (uploadResponse.ok) {
                            return [2 /*return*/, "" + baseUrl + fileName];
                        }
                        else {
                            return [2 /*return*/, Promise.reject("Error in uploadBlob")];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        return [2 /*return*/, Promise.reject("Error in uploadBlob: " + (e_1.errorMessage) ? e_1.errorMessage : e_1)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return AMSClient;
}());
exports.AMSClient = AMSClient;
