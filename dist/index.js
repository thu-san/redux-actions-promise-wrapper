"use strict";
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
var effects_1 = require("redux-saga/effects");
/**
 * Automatically resolves promise of Action.promise
 * @param innerSaga - Generator Function for redux-saga
 */
var promiseHandler = function (innerSaga) {
    return function innerFunction(action) {
        var data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, effects_1.call(innerSaga, action.payload)];
                case 1:
                    data = _a.sent();
                    if (action.resolve) {
                        action.resolve(data);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    if (action.reject) {
                        action.reject(e_1);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    };
};
/**
 * Action Creator
 * @param type Action Type
 */
var actionCreator = function (type) { return function (payload) {
    var resolve = function () { };
    var reject = function () { };
    var promise = new Promise(function (pResolve, pReject) {
        resolve = pResolve;
        reject = pReject;
    });
    return {
        type: type,
        payload: payload,
        promise: promise,
        resolve: resolve,
        reject: reject
    };
}; };
/**
 * Generator return value
 * @param t any
 */
function reg(t) {
    return t;
}
exports.reg = reg;
function createAction(type, successType, failureType) {
    function actionPayload(handleTrigger, handleSuccess, handleFailure) {
        // handler return
        var routine = function (payload) {
            var resolve = function () { };
            var reject = function () { };
            var promise = new Promise(function (pResolve, pReject) {
                resolve = pResolve;
                reject = pReject;
            });
            return {
                type: type,
                payload: payload,
                promise: promise,
                resolve: resolve,
                reject: reject
            };
        };
        routine.TRIGGER = type;
        routine.trigger = actionCreator(type);
        if (handleTrigger) {
            routine.handleTrigger = promiseHandler(handleTrigger);
        }
        if (successType) {
            routine.SUCCESS = successType;
            routine.success = actionCreator(successType);
            if (handleSuccess) {
                routine.handleSuccess = promiseHandler(handleSuccess);
            }
        }
        if (failureType) {
            routine.FAILURE = failureType;
            routine.failure = actionCreator(failureType);
            if (handleFailure) {
                routine.handleFailure = promiseHandler(handleFailure);
            }
        }
        return routine;
    }
    return actionPayload;
}
exports.createAction = createAction;
