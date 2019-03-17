"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
it('reg returns same object', function () {
    expect(index_1.reg(1)).toEqual(1);
    expect(index_1.reg('string')).toEqual('string');
    expect(index_1.reg(true)).toEqual(true);
    expect(index_1.reg({ name: 'John' })).toEqual({ name: 'John' });
    expect(index_1.reg(['cat', 'dog'])).toEqual(['cat', 'dog']);
});
var testAction = function (action, type, payload, handlerReturn, handleAction, throwHandler) { return __awaiter(_this, void 0, void 0, function () {
    var gen, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(action.type).toEqual(type);
                expect(action.payload).toEqual(payload);
                // check promise
                expect(typeof action.promise.then).toEqual('function');
                expect(typeof action.resolve).toEqual('function');
                expect(typeof action.resolve).toEqual('function');
                if (!handleAction) return [3 /*break*/, 4];
                gen = handleAction(action);
                gen.next();
                if (throwHandler) {
                    gen.throw(handlerReturn);
                }
                else {
                    gen.next(handlerReturn);
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, action.promise];
            case 2:
                result = _a.sent();
                expect(result).toEqual(handlerReturn);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                expect(error_1).toEqual(handlerReturn);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var testTriggerAction = function (actionCreator, type, payload, handlerReturn) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(actionCreator.TRIGGER).toEqual(type);
                return [4 /*yield*/, testAction(actionCreator(payload), type, payload, handlerReturn, actionCreator.handleTrigger)];
            case 1:
                _a.sent();
                return [4 /*yield*/, testAction(actionCreator(payload), type, payload, handlerReturn, actionCreator.handleTrigger, true)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var testSuccessAction = function (actionCreator, type, payload, handlerReturn) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(actionCreator.SUCCESS).toEqual(type);
                return [4 /*yield*/, testAction(actionCreator.success(payload), type, payload, handlerReturn, actionCreator.handleSuccess)];
            case 1:
                _a.sent();
                return [4 /*yield*/, testAction(actionCreator.success(payload), type, payload, handlerReturn, actionCreator.handleSuccess, true)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var testFailureAction = function (actionCreator, type, payload, handlerReturn) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(actionCreator.FAILURE).toEqual(type);
                return [4 /*yield*/, testAction(actionCreator.failure(payload), type, payload, handlerReturn, actionCreator.handleFailure)];
            case 1:
                _a.sent();
                return [4 /*yield*/, testAction(actionCreator.failure(payload), type, payload, handlerReturn, actionCreator.handleFailure, true)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
describe('ACTIONS', function () {
    var triggerType = 'TRIGGER';
    var successType = 'SUCCESS';
    var failureType = 'FAILURE';
    it('create action', function () { return __awaiter(_this, void 0, void 0, function () {
        var t, s, f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    t = index_1.createAction(triggerType)();
                    s = index_1.createAction(triggerType, successType)();
                    f = index_1.createAction(triggerType, successType, failureType)();
                    return [4 /*yield*/, testTriggerAction(t, triggerType, undefined, undefined)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testTriggerAction(s, triggerType, undefined, undefined)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, testSuccessAction(s, successType, undefined, undefined)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, testTriggerAction(f, triggerType, undefined, undefined)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, testSuccessAction(f, successType, undefined, undefined)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, testFailureAction(f, failureType, undefined, undefined)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('create action with handler', function () { return __awaiter(_this, void 0, void 0, function () {
        var actionReturn, handleAction, t, s, f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actionReturn = 'ACTION RETURN';
                    handleAction = function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, 'a'];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, index_1.reg(actionReturn)];
                            }
                        });
                    };
                    t = index_1.createAction(triggerType)(handleAction);
                    s = index_1.createAction(triggerType, successType)(handleAction, handleAction);
                    f = index_1.createAction(triggerType, successType, failureType)(handleAction, handleAction);
                    return [4 /*yield*/, testTriggerAction(t, triggerType, undefined, actionReturn)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testTriggerAction(s, triggerType, undefined, actionReturn)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, testSuccessAction(s, successType, undefined, actionReturn)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, testTriggerAction(f, triggerType, undefined, actionReturn)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, testSuccessAction(f, successType, undefined, actionReturn)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, testFailureAction(f, failureType, undefined, actionReturn)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('create trigger action with handler and payload', function () { return __awaiter(_this, void 0, void 0, function () {
        var actionReturn, handleAction, t, s, f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actionReturn = 'ACTION RETURN';
                    handleAction = function (_a) {
                        var name = _a.name;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, name];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, 'a'];
                                case 2:
                                    _b.sent();
                                    return [2 /*return*/, index_1.reg(actionReturn)];
                            }
                        });
                    };
                    t = index_1.createAction(triggerType)(handleAction);
                    s = index_1.createAction(triggerType, successType)(handleAction, handleAction);
                    f = index_1.createAction(triggerType, successType, failureType)(handleAction, handleAction, handleAction);
                    return [4 /*yield*/, testTriggerAction(t, triggerType, { name: 'John' }, actionReturn)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, testTriggerAction(s, triggerType, { name: 'John' }, actionReturn)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, testSuccessAction(s, successType, { name: 'John' }, actionReturn)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, testTriggerAction(f, triggerType, { name: 'John' }, actionReturn)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, testSuccessAction(f, successType, { name: 'John' }, actionReturn)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, testFailureAction(f, failureType, { name: 'John' }, actionReturn)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
