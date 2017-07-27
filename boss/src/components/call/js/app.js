import $ from 'jquery'
import {Message} from 'element-ui';

// jquery-json
var escape = /["\\\x00-\x1f\x7f-\x9f]/g, meta = {"\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, hasOwn = Object.prototype.hasOwnProperty;
$.toJSON = "object" == typeof JSON && JSON.stringify ? JSON.stringify : function (t) {
    if (null === t)return "null";
    var e, r, n, o, i = $.type(t);
    if ("undefined" === i)return void 0;
    if ("number" === i || "boolean" === i)return String(t);
    if ("string" === i)return $.quoteString(t);
    if ("function" == typeof t.toJSON)return $.toJSON(t.toJSON());
    if ("date" === i) {
        var u = t.getUTCMonth() + 1, f = t.getUTCDate(), s = t.getUTCFullYear(), a = t.getUTCHours(),
            l = t.getUTCMinutes(), c = t.getUTCSeconds(), p = t.getUTCMilliseconds();
        return 10 > u && (u = "0" + u), 10 > f && (f = "0" + f), 10 > a && (a = "0" + a), 10 > l && (l = "0" + l), 10 > c && (c = "0" + c), 100 > p && (p = "0" + p), 10 > p && (p = "0" + p), '"' + s + "-" + u + "-" + f + "T" + a + ":" + l + ":" + c + "." + p + 'Z"'
    }
    if (e = [], $.isArray(t)) {
        for (r = 0; r < t.length; r++)e.push($.toJSON(t[r]) || "null");
        return "[" + e.join(",") + "]"
    }
    if ("object" == typeof t) {
        for (r in t)if (hasOwn.call(t, r)) {
            if (i = typeof r, "number" === i) n = '"' + r + '"'; else {
                if ("string" !== i)continue;
                n = $.quoteString(r)
            }
            i = typeof t[r], "function" !== i && "undefined" !== i && (o = $.toJSON(t[r]), e.push(n + ":" + o))
        }
        return "{" + e.join(",") + "}"
    }
}, $.evalJSON = "object" == typeof JSON && JSON.parse ? JSON.parse : function (str) {
    return eval("(" + str + ")")
}, $.secureEvalJSON = "object" == typeof JSON && JSON.parse ? JSON.parse : function (str) {
    var filtered = str.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "");
    if (/^[\],:{}\s]*$/.test(filtered))return eval("(" + str + ")");
    throw new SyntaxError("Error parsing JSON, source is not valid.")
}, $.quoteString = function (t) {
    return t.match(escape) ? '"' + t.replace(escape, function (t) {
            var e = meta[t];
            return "string" == typeof e ? e : (e = t.charCodeAt(), "\\u00" + Math.floor(e / 16).toString(16) + (e % 16).toString(16))
        }) + '"' : '"' + t + '"'
}

$.ajaxSetup({ cache: true });
Array.indexOf = function (arr, elt) { for (let i = 0; i < arr.length; i++) { if (arr[i] === elt) { return i; } } return -1; };

let holly = {
    session: {
        logined: false,
        extenType: 'sip',
        user: null,
        account: null
    },
    app: {
        init: function () {
            $("#softphoneBarKick").on("click", function () {
                if (holly.session.logined) {
                    holly.phone._phone_exit(true);
                }
            });
            $("#softphoneBarPick").on("click", function () {
                if (!holly.session.logined) {
                    holly.phone._phone_relogin(false);
                    $('.errorMsg').html('');
                }
            });
            $("#softphone-bar .state_dropdown").click(function () {
                $("#softphone_otherstate").fadeToggle('fast');
            });
            $('body').click(function (e) {
                if ($("#softphone_otherstate").css("display") === "block" && e.target.id !== "softphone_dropdown" && e.target.id != "softphone_dropdown_caret") {
                    $("#softphone_otherstate").fadeOut('fast');
                }
            });
        },
        loginSuccessCallback: function () {
            if (hollyglobal.loginSuccessCallback && typeof hollyglobal.loginSuccessCallback == 'function') {
                hollyglobal.loginSuccessCallback();
            }
        },
        loginFailureCallback: function (mess) {
            if (hollyglobal.loginFailureCallback && typeof hollyglobal.loginFailureCallback == 'function') {
                hollyglobal.loginFailureCallback(mess);
            } else {
                alert(mess);
            }
        },
        loginMonitor: function () {
            holly.app._initMonitorPhone();
        },
        _initMonitorPhone: function () {
            let currentPbxId = hollyglobal.sipConfigId, pbx, nickName, proxyUrl, pbxId;
            let config = {
                monitor: true
            };
            for (let i = 0; i < hollyglobal.pbxs.length; i++) {
                pbx = hollyglobal.pbxs[i];
                nickName = pbx.NickName;
                proxyUrl = pbx.proxyUrl;
                pbxId = pbx.PBX;
                pbx = {
                    sipConfigId: pbxId,
                    pbxNick: nickName,
                    proxyUrl: proxyUrl,
                    sessionId: "",
                    isWaitingPbxEvent: false,
                    isMonitorLogOff: false
                };
                if (pbxId !== currentPbxId) {
                    if (!config.monitor) {
                        continue;
                    }
//                    pbx.monitor = false;
                } else {//找到账户相应的PBX，存储到phone_pbx，做为监控数据的基础数据
                    config.proxy_url = proxyUrl;
                    config.extenType = hollyglobal.loginExtenType;
                    config.password = hollyglobal.loginPassword;
                    config.user = hollyglobal.loginUser;
                    config.busyType = hollyglobal.loginBusyType;
                    config.pbxNick = nickName;
                    config.curPbx = pbxId;
                }
                holly.phone.phone_pbxs[pbxId] = pbx;
            }
            let phoneJson = {
                Command: "Action",
                Action: "Login",
                ActionID: "Login" + Math.random(),
                PBX: config.curPbx,
                Account: hollyglobal.accountId,
                Password: hollyglobal.monitorPassword,
                UserID: hollyglobal.monitorUserID,
                MonitorUser: true
            };
            phoneJson.isMonitorPage = true;
            holly.phone.phone_register(config, phoneJson);
        },
        _initSoftbarPhone: function (web_call, web_key) {
            hollyglobal.loginUser = web_call;
            hollyglobal.loginPassword = web_key;
            holly.app.init();
            let actionName = "Login",
                phoneJson = {
                    Command: "Action",
                    Action: actionName,
                    ActionID: actionName + Math.random(),
                    Monitor: false,
                    ExtenType: hollyglobal.loginExtenType,
                    Password: hollyglobal.loginPassword,
                    BusyType: hollyglobal.loginBusyType,
                    User: hollyglobal.loginUser
                },
                config = {
                    proxy_url: hollyglobal.loginProxyUrl,
                    user: hollyglobal.loginUser
                };
            holly.phone.phone_register(config, phoneJson);
        }
    }
};

holly.phone = {
    phone_data: {},
    _phone_url: "",
    _phone_iccCount: 0,
    _phone_isWaitingEvent: false,
    _phone_isKick: true,
    _phone_unregister: 0,
    _phone_peerstate: 1,
    _phone_dialing: 2,
    _phone_innerDialing: 3,
    _phone_belling: 4,
    _phone_innerBelling: 5,
    _phone_listening: 6,
    _phone_talking: 7,
    _phone_threeWayTalking: 8,
    _phone_innerTalking: 9,
    _phone_dialTalking: 10,
    _phone_listened: 11,
    _phone_transferBelling: 12,
    _phone_transferDialing: 13,
    _phone_transfer: 14,
    _phone_dialoutTransfer: 15,
    _phone_systemBusy: 99,
    _phone_currentState: "",
    _phone_stateBeforeHold: "",
    _phone_isInvestigatting: false,
    _phone_stateDescription: ["unregister", "peerstate", "dialing", "innerDialing", "belling", "innerBelling", "listening", "talking", "threeWayTalking", "innerTalking", "dialTalking", "listened", "transferBelling", "transferDialing", "transfer", "dialTransfer"],

    _phone_peersFromSip: [],
    phone_peers: [],
    phone_peers_sip: [],
    phone_queues: [],
    phone_accountCalls: [],
    phone_serviceNos: [],
    _phone_isSettingbusy: false,
    _phone_isRelogin: false,
    phone_pbxs: [],
    _phone_callObject: {},
    _phone_sendAction: function(jsonData, onload, onerror) {
        var json = $.toJSON(jsonData);
        var timeout = 15000;
        if (jsonData.Timeout != undefined) {
            timeout = jsonData.Timeout;
        }
        $.ajax({
            type: "get",
            url: holly.phone._phone_url,
            timeout: timeout,
            cache: false,
            data: {
                json: json
            },
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    phone_register: function(config, phoneJson) {
        holly.phone._phone_url = config.proxy_url;
        var isMonitorPage = phoneJson.isMonitorPage;
        delete phoneJson.isMonitorPage;
        var onload = function(response) {
            var _response = response;
            if (!_response.Succeed) {
                var code = _response.Result;
                if (code) {
                    if (code == 601) {
                        holly.app.loginFailureCallback("您的账户通话座席登录数已达最大或者已经到期,通话功能将不能使用");
                    } else {
                        if (code == 602) {
                            holly.app.loginFailureCallback("您的账户无通话座席登录数已达最大或者已经到期,通话功能将不能使用");
                        } else if (code == 408) {
                            holly.app.loginFailureCallback("由于您的主软电话条没有签入，不能登录软电话");
                        } else {
                            holly.app.loginFailureCallback("登录失败" + code + ",通话功能将不能使用");
                        }
                    }
                }
            } else if (_response.SessionID) {
                config.uniqueId = _response.SessionID;
                var date = new Date();
                var identity = date.valueOf();
                config.currentServerTime = identity - _response.Timestamp * 1000;
                config.phonebarConfig = _response.PhonebarConfig;
                config.autoBusyTime = _response.AutoBusyTime;
                config.userId = _response.UserID;
                config.pbx_in_ip = _response.PBX;
                config.accountId = _response.Account;
                config.loginName = config.user;
                config.sipNo = _response.SipNum;
                config.monitorUser = _response.MonitorUser;
                config.monitorPassword = _response.MonitorPassword;
                config.depts = $.evalJSON(_response.Departments);
                config.departmentID = (_response.DepartmentID) ? (_response.DepartmentID) : "";
                holly.session.logined = true;
                holly.softphonebar.softphonebar_init();
                holly.phone._phone_init(config);
                holly.phone._phone_waitEvent(isMonitorPage);
                if (isMonitorPage) {
                    hollyglobal.isMonitorPage = true;
                    var curpbx;
                    if (holly.phone.phone_data.pbx_in_ip) {
                        curpbx = holly.phone.phone_pbxs[holly.phone.phone_data.pbx_in_ip];
                        curpbx.sessionId = _response.SessionID;
                    } else {
                        curpbx = holly.phone.phone_pbxs[hollyglobal.sipConfigId];
                        curpbx.sessionId = _response.SessionID;
                        holly.phone.phone_data.pbx_in_ip = hollyglobal.sipConfigId;
                        holly.phone.phone_data.accountId = hollyglobal.accountId;
                        holly.phone.phone_data.userId = config.userId;
                    }
                    $("#monitor_allpbx").css("display", "block");
                    holly.softphonebar.monitor_agent();
                } else {
                    holly.utils.pickSoftphonebar();
                }
                holly.app.loginSuccessCallback();
            }
        };
        var onerror = function(xhr, status, error) {
            holly.app.loginFailureCallback('请求超时，请检查本地网络');
        };
        holly.phone._phone_sendAction(phoneJson, onload, onerror);
    },
    _phone_init: function(config) {
        holly.session.user = {};
        holly.session.user.userId = config.userId;
        holly.session.user.loginName = config.loginName;
        holly.session.user.password = config.password;
        holly.session.user.extenType = config.extenType;
        holly.session.user.busyType = config.busyType;
        holly.session.user.sipConfigId = config.curPbx;
        holly.phone.phone_data.uniqueId = config.uniqueId;
        holly.phone.phone_data.currentServerTime = config.currentServerTime;
        holly.phone.phone_data.autoBusyTime = config.autoBusyTime;
        holly.phone.phone_data.userId = config.userId;
        holly.phone.phone_data.pbx_in_ip = config.pbx_in_ip;
        holly.phone.phone_data.accountId = config.accountId;
        holly.phone.phone_data.loginName = config.loginName;
        holly.phone.phone_data.sipNo = config.sipNo;
        holly.phone.phone_data.monitor = config.monitor;
        holly.phone.phone_data.user = config.user;
        holly.phone.phone_data.password = config.password;
        holly.phone.phone_data.extenType = config.extenType;
        holly.phone.phone_data.busyType = config.busyType;
        holly.phone.phone_data.monitorUser = config.monitorUser;
        holly.phone.phone_data.monitorPassword = config.monitorPassword;
        holly.phone.phone_data.depts = config.depts;
        holly.phone.phone_data.departmentID = config.departmentID;
        holly.phone.phone_data.phonebarConfig = new Array();
        if (config.phonebarConfig) {
            var peerstates = config.phonebarConfig.split(",");
            for (var i = 0; i < peerstates.length; i++) {
                holly.phone.phone_data.phonebarConfig[peerstates[i].split(":")[0]] = peerstates[i].split(":")[1]
            }
        }
        holly.phone._phone_currentState = holly.phone._phone_unregister;
        holly.phone.phone_publishEvent("toolbarupdate", [holly.phone._phone_stateDescription[holly.phone._phone_currentState], ""]);
    },
    _phone_waitEvent: function(isMonitorPage) {
        if (holly.phone._phone_isWaitingEvent)
            return;
        holly.phone._phone_isWaitingEvent = true;
        var phoneJson = {
            Command: "Action",
            Action: "GetState",
            ActionID: "GetState" + Math.random(),
            SessionID: holly.phone.phone_data.uniqueId,
            User: holly.phone.phone_data.userId
        };
        var onload = function(response) {
            holly.phone._phone_iccCount = 0;
            if (!response)
                return;
            var datas = response;
            var _response = datas.Response;
            if (!_response)
                _response = datas;
            if (_response.Succeed && !_response.HasEvent) {} else if (!_response.Succeed) {
                holly.app.loginFailureCallback(response.Message);
                if (_response.Expired && holly.phone._phone_isKick) {
                    holly.phone._phone_relogin(isMonitorPage);
                    holly.phone._phone_isWaitingEvent = false;
                    return;
                }
                return;
            } else {
                if (_response.Kick) {
                    var comments = "";
                    if (_response.Comments)
                        comments = _response.Comments;
                    if (!isMonitorPage) {
                        if (comments == "ukick" || comments == "ekick") {
                            $('.errorMsg').html('您的帐号在其他地方登录了');
                            holly.utils.kickSoftphonebar();
                        } else {
                            $('.errorMsg').html('您已被管理员强制签出');
                            holly.utils.kickSoftphonebar();
                        }
                        holly.session.logined = false;
                        holly.phone._phone_isWaitingEvent = false;
                        holly.utils.kickSoftphonebar();
                        holly.phone._phone_isKick = false;
                        holly.softphonebar._softphonebar_barupdate('', 'unregister', '');
                        return;
                    }
                } else {
                    var events = datas.Event;
                    if (events != null && holly.phone._phone_isKick) {
                        holly.phone._phone_eventHandler(events);
                        if (hollyglobal.multiLogin && holly.phone._phone_currentState === holly.phone._phone_unregister) {
                            holly.session.logined = false;
                            holly.phone._phone_isWaitingEvent = false;
                            return;
                        }
                    }
                }
            }
            holly.phone._phone_isWaitingEvent = false;
            holly.phone._phone_waitEvent(isMonitorPage);
        };
        var onerror = function() {
            holly.phone._phone_isWaitingEvent = false;
            holly.phone._phone_isKick = true;
            window.setTimeout(function() {
                holly.phone._phone_iccCount++;
                if (holly.phone._phone_iccCount >= 3) {
                    holly.phone._phone_iccCount = 0;
                    holly.utils.unRegisterSoftphonebar();
                    $('.errorMsg').html('连接服务器超时，可能是您的网络问题，正在尝试重新连接');
                    // alert("连接服务器超时，可能是您的网络问题，正在尝试重新连接...");
                    // holly.utils.showError("连接超时，尝试重新连接", "softphone_transfer");
                }
                holly.phone._phone_waitEvent(isMonitorPage);
            }, 1000);
        };
        holly.phone._phone_sendAction(phoneJson, onload, onerror);
    },
    _phone_relogin: function(isMonitorPage) {
        if (holly.phone._phone_isRelogin)
            return;
        holly.phone._phone_isRelogin = true;
        var actionName = "Login";
        if (hollyglobal.multiLogin) {
            actionName = "MultipleLogin";
        }
        var phoneJson = {
            Command: "Action",
            Action: actionName,
            ActionID: "Login" + Math.random(),
            Monitor: holly.phone.phone_data.monitor
        };
        var config = {
            monitor: false
        };
        phoneJson.ExtenType = hollyglobal.loginExtenType;
        phoneJson.Password = hollyglobal.loginPassword;
        phoneJson.BusyType = hollyglobal.loginBusyType;
        phoneJson.User = hollyglobal.loginUser;
        config.extenType = hollyglobal.loginExtenType;
        config.password = hollyglobal.loginPassword;
        config.user = hollyglobal.loginUser;
        if (isMonitorPage) {
            var phoneJson = {
                Command: "Action",
                Action: "Login",
                ActionID: "Login" + Math.random(),
                PBX: holly.session.user.sipConfigId,
                Account: hollyglobal.accountId,
                Password: hollyglobal.monitorPassword,
                UserID: hollyglobal.monitorUserID,
                MonitorUser: true
            };
        }
        var onload = function(response) {
            var _response = response;
            if (!_response.Succeed) {
                var code = _response.Result;
                if (code) {
                    if (code == 601) {
                        holly.app.loginFailureCallback("您的账户通话座席登录数已达最大或者已经到期,通话功能将不能使用");
                    } else if (code == 602) {
                        holly.app.loginFailureCallback("您的账户无通话座席登录数已达最大或者已经到期,通话功能将不能使用");
                    } else if (code == 408) {
                        holly.app.loginFailureCallback("由于您的主软电话条没有签入，不能签入软电话");
                    } else {
                        holly.app.loginFailureCallback("登录失败" + code + ",通话功能将不能使用");
                    }
                } else {
                    holly.app.loginFailureCallback("您当前的会话已经失效,通话功能将不能使用");
                }
            } else if (_response.SessionID) {
                config.uniqueId = _response.SessionID;
                var date = new Date();
                var identity = date.valueOf();
                config.currentServerTime = identity - _response.Timestamp * 1000;
                config.phonebarConfig = _response.PhonebarConfig;
                config.autoBusyTime = _response.AutoBusyTime;
                config.userId = _response.UserID;
                config.pbx_in_ip = _response.PBX;
                config.accountId = _response.Account;
                config.sipNo = _response.SipNum;
                config.monitorUser = _response.MonitorUser;
                config.monitorPassword = _response.MonitorPassword;
                config.depts = $.evalJSON(_response.Departments);
                config.departmentID = (_response.DepartmentID) ? (_response.DepartmentID) : "";
                holly.session.logined = true;
                holly.softphonebar.softphonebar_init();
                holly.phone._phone_init(config);
                if (isMonitorPage) {
                    var curPbx;
                    if (holly.phone.phone_data.pbx_in_ip) {
                        curPbx = holly.phone.phone_pbxs[holly.phone.phone_data.pbx_in_ip];
                        curPbx.sessionId = _response.SessionID;
                    } else {
                        curPbx = holly.phone.phone_pbxs[holly.session.user.sipConfigId];
                        curPbx.sessionId = _response.SessionID;
                        holly.phone.phone_data.pbx_in_ip = holly.session.user.sipConfigId;
                        holly.phone.phone_data.accountId = hollyglobal.accountId;
                        holly.phone.phone_data.userId = holly.session.user.userId;
                    }
                } else
                    holly.utils.pickSoftphonebar();
                holly.phone._phone_isWaitingEvent = false;
                holly.phone._phone_isKick = true;
                holly.phone._phone_waitEvent(isMonitorPage);
                holly.app.loginSuccessCallback();
            }
            holly.phone._phone_isRelogin = false;
        };
        var onerror = function() {
            holly.app.loginFailureCallback('请求合力通话服务器超时，请检查本地网络');
            holly.phone._phone_isRelogin = false;
            holly.phone._phone_isKick = true;
        };
        holly.phone._phone_sendAction(phoneJson, onload, onerror);
    },
    _phone_eventHandler: function(evtJsons) {
        $.each(evtJsons, function(i, item) {
            holly.phone._phone_stateProcess(item);
            if (hollyglobal.isMonitorPage) {
                holly.phone._phone_monitorPeer(item);
                holly.phone._phone_monitorQueue(item);
                holly.phone._phone_monitorServiceNo(item);
            }
            if (item.Event === "UserStatus" && item.PeerStatus === "Unregistered" && holly.phone.phone_data.userId === item.UserID) {
                if (!holly.phone.phone_data.monitor)
                    return false;
            }
        });
    },
    _phone_monitorAccount: function(evtJson) {
        if (evtJson.Event === "AccountStatus") {
            var account;
            if (!holly.phone.phone_accountCalls[evtJson.PBX]) {
                account = {
                    account: evtJson.Account,
                    inCalls: evtJson.InCalls,
                    outComplete: evtJson.OutComplete,
                    inComplete: evtJson.InComplete,
                    outCalls: evtJson.OutCalls,
                    inCallsPerHour: evtJson.InCallsPerHour,
                    currentOutCalls: evtJson.CurrentOutCalls,
                    pbx: evtJson.PBX,
                    inCompletePerHour: evtJson.InCompletePerHour,
                    outCallsPerHour: evtJson.OutCallsPerHour,
                    currentInCalls: evtJson.CurrentInCalls,
                    outCompletePerHour: evtJson.OutCompletePerHour
                };
                holly.phone.phone_accountCalls[evtJson.PBX] = account;
                holly.phone.phone_publishEvent("EvtAccountCalls", [account]);
            } else {
                account = holly.phone.phone_accountCalls[evtJson.PBX];
                account.account = evtJson.Account;
                account.inCalls = evtJson.InCalls;
                account.outComplete = evtJson.OutComplete;
                account.inComplete = evtJson.InComplete;
                account.outCalls = evtJson.OutCalls;
                account.inCallsPerHour = evtJson.InCallsPerHour;
                account.currentOutCalls = evtJson.CurrentOutCalls;
                account.pbx = evtJson.PBX;
                account.inCompletePerHour = evtJson.InCompletePerHour;
                account.outCallsPerHour = evtJson.OutCallsPerHour;
                account.currentInCalls = evtJson.CurrentInCalls;
                account.outCompletePerHour = evtJson.OutCompletePerHour;
                holly.phone.phone_publishEvent("EvtAccountCalls", [account]);
            }
        }
    },
    phone_pbxMonitor: function(pbx) {
        for (var i in holly.phone.phone_pbxs) {
            if (i === holly.phone.phone_data.pbx_in_ip)
                continue;
            if (i === pbx) {
                if (!holly.phone.phone_pbxs[pbx].monitor)
                    holly.phone._phone_pbxMonitorResister(i);
            } else {
                if (holly.phone.phone_pbxs[i].monitor)
                    holly.phone._phone_pbxMonitorLogOff(i)
            }
        }
    },
    _phone_pbxMonitorLogOff: function(pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        if (phone_pbx.isMonitorLogOff)
            return;
        phone_pbx.isMonitorLogOff = true;
        var url = phone_pbx.proxyUrl;
        var phoneJson = {
            Command: "Action",
            Action: "Logoff",
            ActionID: "Logoff" + Math.random(),
            SessionID: phone_pbx.sessionId
        };
        var onload = function(response) {
            phone_pbx.isMonitorLogOff = false;
            phone_pbx.monitor = false;
        };
        var onerror = function() {
            phone_pbx.isMonitorLogOff = false;
            phone_pbx.monitor = false;
        };
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {
                json: json
            },
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    _phone_pbxMonitorResister: function(pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx],
            url = phone_pbx.proxyUrl,
            phoneJson = {
                Command: "Action",
                Action: "Login",
                ActionID: "Login" + Math.random(),
                PBX: pbx,
                Account: holly.phone.phone_data.accountId,
                UserID: hollyglobal.monitorUserID,
                Password: hollyglobal.monitorPassword,
                MonitorUser: true
            };
        if (pbx === hollyglobal.sipConfigId)
            phoneJson.MonitorRealUserID = hollyglobal.userId;
        var onload = function(response) {
            if (response.Succeed) {
                holly.phone.phone_pbxs[pbx].sessionId = response.SessionID;
                holly.phone.phone_pbxs[pbx].isWaitingPbxEvent = false;
                holly.phone.phone_pbxs[pbx].monitor = true;
                holly.phone._phone_waitPbxEvent(pbx);
            } else {
                holly.phone.phone_pbxs[pbx].monitor = false;
            }
        };
        var onerror = function() {
            holly.phone.phone_pbxs[pbx].monitor = false;
            holly.utils.showError("请求超时，请检查本地网络", "softphone_transfer");

        };
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {
                json: json
            },
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    _phone_waitPbxEvent: function(pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        if (!phone_pbx || !phone_pbx.monitor || phone_pbx.isWaitingPbxEvent)
            return;
        phone_pbx.isWaitingPbxEvent = true;
        var url = phone_pbx.proxyUrl,
            phoneJson = {
                Command: "Action",
                Action: "GetState",
                ActionID: "GetState" + Math.random(),
                SessionID: phone_pbx.sessionId,
                User: holly.phone.phone_data.monitorUser
            };
        var onload = function(response) {
            if (!response) {
                return;
            }
            var _response = response.Response;
            if (!_response.Succeed) {
                holly.app.loginFailureCallback(response.Message);
                if (_response.Expired) {
                    phone_pbx.isWaitingPbxEvent = false;
                    holly.phone._phone_pbxMonitorResister(pbx, url);
                    return;
                }
            } else if (_response.Succeed && _response.HasEvent) {
                var events = response.Event;
                if (events != null) {
                    holly.phone._phone_eventHandler(events, true);
                }
            }
            phone_pbx.isWaitingPbxEvent = false;
            holly.phone._phone_waitPbxEvent(pbx);
        };
        var onerror = function() {
            phone_pbx.isWaitingPbxEvent = false;
        };
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {
                json: json
            },
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    _phone_monitorServiceNo: function(evtJson) {
        if (evtJson.Event === "TrunkStatus") {
            var displayName, serviceNo;
            if (evtJson.DisplayName) {
                displayName = evtJson.DisplayName;
                if (holly.utils.startWith(displayName, "serviceno-"))
                    displayName = "";
            }
            if (!holly.phone.phone_serviceNos[evtJson.ServiceNo]) {
                serviceNo = {
                    serviceNo: evtJson.ServiceNo,
                    inCalls: evtJson.InCalls,
                    inLost: evtJson.InLost,
                    inComplete: evtJson.InComplete,
                    outCalls: 0,
                    outComplete: 0,
                    displayName: displayName,
                    pbx: evtJson.PBX
                };
                holly.phone.phone_serviceNos[evtJson.ServiceNo] = serviceNo;
            } else {
                serviceNo = holly.phone.phone_serviceNos[evtJson.ServiceNo];
                serviceNo.inCalls = evtJson.InCalls,
                    serviceNo.inLost = evtJson.InLost,
                    serviceNo.inComplete = evtJson.InComplete,
                    serviceNo.outCalls = 0,
                    serviceNo.outComplete = 0,
                    serviceNo.displayName = displayName
            }
            holly.phone.phone_publishEvent("EvtMonitorServiceNo", [holly.phone.phone_serviceNos[evtJson.ServiceNo]]);
        }
    },
    _phone_stateProcess: function(evtJson) {
        holly.phone._phone_super(evtJson);
        switch (holly.phone._phone_currentState) {
            case holly.phone._phone_unregister:
                if (evtJson.Event === "PeerStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.PeerStatus === "Registered") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                } else if (evtJson.Event === "UserStatus") {
                    if (holly.phone.phone_data.userId === evtJson.UserID) {
                        if (holly.phone.phone_data.sipNo !== evtJson.SipNum) {
                            if (evtJson.PeerStatus === "Registered") {
                                holly.phone._phone_currentState = holly.phone._phone_peerstate;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_peerstate:
                if (evtJson.Event === "UserBusy") {
                    if (holly.phone.phone_data.userId === evtJson.UserID) {
                        holly.phone.phone_data.busyType = evtJson.BusyType;
                        holly.phone._phone_currentState = holly.phone._phone_peerstate;
                        holly.phone._phone_update(evtJson);
                    }
                } else if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Ringing") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_belling;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerBelling;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transferBelling;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transferDialing;
                                holly.phone._phone_update(evtJson);
                            }
                        } else if (evtJson.ChannelStatus === "Ring") {
                            if (evtJson.ChannelType === "dialout") {
                                holly.phone._phone_currentState = holly.phone._phone_dialing;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerDialing;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.ChannelType === "listen") {
                                holly.phone._phone_currentState = holly.phone._phone_listening;
                                holly.phone._phone_update(evtJson);
                            }
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_talking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialout") {
                                holly.phone._phone_currentState = holly.phone._phone_dialTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transfer;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_dialoutTransfer;
                                holly.phone._phone_update(evtJson);
                            }
                        } else if (evtJson.ChannelStatus === "Up") {
                            if (evtJson.ChannelType === "listen") {
                                holly.phone._phone_currentState = holly.phone._phone_listened;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                } else if (evtJson.Event === "PeerStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.PeerStatus !== "Registered") {
                            holly.phone._phone_currentState = holly.phone._phone_unregister;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_dialing:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.ChannelType === "dialout") {
                                holly.phone._phone_currentState = holly.phone._phone_dialTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_innerDialing:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_belling:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_talking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transfer;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_dialoutTransfer;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_innerBelling:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "inner") {
                                holly.phone._phone_currentState = holly.phone._phone_innerTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_listening:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Up") {
                            if (evtJson.ChannelType === "listen") {
                                holly.phone._phone_currentState = holly.phone._phone_listened;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_talking:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "ThreeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_transfer:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "ThreeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_dialoutTransfer:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "ThreeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_threeWayTalking:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_innerTalking:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_dialTalking:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "ThreeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_listened:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_transferBelling:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus == "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_talking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transfer;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_dialoutTransfer;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
            case holly.phone._phone_transferDialing:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone._phone_currentState = holly.phone._phone_peerstate;
                            holly.phone._phone_update(evtJson);
                        } else if (evtJson.ChannelStatus === "Link") {
                            if (evtJson.LinkedChannel.ChannelType === "normal") {
                                holly.phone._phone_currentState = holly.phone._phone_talking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "threeWayCall") {
                                holly.phone._phone_currentState = holly.phone._phone_threeWayTalking;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "transfer") {
                                holly.phone._phone_currentState = holly.phone._phone_transfer;
                                holly.phone._phone_update(evtJson);
                            } else if (evtJson.LinkedChannel.ChannelType === "dialTransfer") {
                                holly.phone._phone_currentState = holly.phone._phone_dialoutTransfer;
                                holly.phone._phone_update(evtJson);
                            }
                        }
                    }
                }
                break;
        }
    },
    _phone_monitorPeer: function(evtJson) {
        if (evtJson.Event === "ChannelStatus") {
            if (evtJson.ChannelStatus === "Hangup" && !evtJson.UserID)
                return;
            var peer = holly.phone.phone_peers_sip[evtJson.Exten];
            if (!peer)
                return;
            if (evtJson.ChannelStatus === "Down") {
                peer.callStatus = "Down";
                peer.channel = evtJson.Channel;
                holly.phone._phone_updateQueueInfo();
            } else if (evtJson.ChannelStatus === "Ring") {
                peer.callStatus = "Ring";
                peer.called = false;
                peer.C5Status = evtJson.C5Status;
                peer.timestamp = evtJson.Timestamp;
                peer.channel = evtJson.Channel;
                peer.queueName = "";
                if (evtJson.C5Status === "OutboundCall" || evtJson.C5Status === "InboundCall" || evtJson.C5Status === "listen") {
                    peer.callNo = evtJson.Data.ListenExten;
                } else if (evtJson.FromDid)
                    peer.callNo = evtJson.FromDid;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
            } else if (evtJson.ChannelStatus === "Ringing") {
                peer.called = true;
                peer.callStatus = "Ringing";
                peer.C5Status = evtJson.C5Status;
                peer.channel = evtJson.Channel;
                peer.linkedChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.LinkedChannel)
                    peer.queueName = evtJson.LinkedChannel.QueueName;
                if (evtJson.ChannelType === "dialTransfer")
                    peer.callNo = evtJson.FromDid;
                else
                    peer.callNo = evtJson.FromCid;
                peer.timestamp = evtJson.Timestamp;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
            } else if (evtJson.ChannelStatus === "Up") {
                if (evtJson.ChannelType === "listen") {
                    peer.callNo = evtJson.Data.ListenExten;
                    peer.timestamp = evtJson.Timestamp;
                    peer.C5Status = evtJson.C5Status;
                    peer.callStatus = evtJson.ChannelType;
                    peer.linked = true;
                    peer.channel = evtJson.Channel;
                    holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                }
            } else if (evtJson.ChannelStatus === "Link") {
                peer.timestamp = evtJson.Timestamp;
                peer.C5Status = evtJson.C5Status;
                peer.linked = true;
                peer.channel = evtJson.Channel;
                peer.callStatus = evtJson.ChannelType;
                if (evtJson.LinkedChannel) {
                    peer.linkedChannel = evtJson.LinkedChannel.Channel;
                    peer.queueName = evtJson.LinkedChannel.QueueName;
                }
                if (evtJson.ChannelType === "dialout" || evtJson.ChannelType === "dialTransfer")
                    peer.callNo = evtJson.FromDid;
                else if (evtJson.ChannelType === "inner") {
                    if (evtJson.LinkedChannel) {
                        var linkExten = evtJson.LinkedChannel.Exten;
                        //                        var linkPeer = holly.phone._phone_getUserFromSip(linkExten);
                        var linkPeer = holly.phone.phone_peers_sip[linkExten];
                        if (linkPeer) {
                            if (linkPeer.callStatus !== "inner") {
                                peer.callNo = evtJson.FromDid;
                            } else {
                                peer.callNo = evtJson.FromCid;
                            }
                        } else {
                            peer.callNo = evtJson.FromCid;
                        }
                    } else {
                        peer.callNo = evtJson.FromCid;
                    }
                } else
                    peer.callNo = evtJson.FromCid;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
            } else if (evtJson.ChannelStatus === "Unlink") {

            } else if (evtJson.ChannelStatus === "Hangup") {
                if (evtJson.ChannelType === "listen") {
                    if (holly.phone.phone_data._curChannel === evtJson.Channel) {
                        holly.phone.phone_data._otherChannel = "";
                        holly.phone.phone_publishEvent("EvtEndListen", []);
                    }
                }
                if (peer.channel === evtJson.Channel) {
                    if (holly.phone.phone_data._otherChannel === evtJson.Channel && (holly.phone._phone_stateDescription[holly.phone._phone_currentState] === "listening" || holly.phone._phone_stateDescription[holly.phone._phone_currentState] == "listened")) {
                        holly.phone.phone_hangup();
                    }
                }
                peer.callNo = "";
                peer.callStatus = "Idle";
                peer.timestamp = evtJson.Timestamp;
                peer.channel = "";
                peer.linkedChannel = "";
                peer.queueName = "";
                holly.phone._phone_updateQueueInfo();
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);

                if (evtJson.Exten && peer.sipNo === evtJson.Exten) {
                    if (hollyglobal.hangupEvent && typeof hollyglobal.hangupEvent === 'function') {
                        //                        hollyglobal.hangupEvent(peer);
                    }
                }
            }
        } else if (evtJson.Event === "UserStatus") {
            var isRegistered = false;
            if (evtJson.PeerStatus === "Registered")
                isRegistered = true;
            if (!holly.phone.phone_peers[evtJson.UserID]) {
                peer = {
                    exten: evtJson.Exten,
                    sipNo: evtJson.SipNum,
                    name: evtJson.User,
                    DisplayName: evtJson.DisplayName,
                    loginExten: evtJson.LoginExten,
                    peerStatus: evtJson.PeerStatus,
                    status: evtJson.Status,
                    C5Status: evtJson.C5Status,
                    busy: evtJson.Busy,
                    extenType: evtJson.ExtenType,
                    login: evtJson.Login,
                    userId: evtJson.UserID,
                    user: evtJson.User,
                    localNo: evtJson.Local,
                    register: isRegistered,
                    InCalls: evtJson.InCalls,
                    InComplete: evtJson.InComplete,
                    TransferComplete: evtJson.TransferComplete,
                    OutCalls: evtJson.OutCalls,
                    OutComplete: evtJson.OutComplete,
                    DialoutTimeLength: evtJson.DialoutTimeLength,
                    linked: false,
                    channel: "",
                    linkedChannel: "",
                    called: false, //是否是被呼
                    callStatus: "Idle",
                    callNo: "",
                    department: evtJson.DepartmentID ? evtJson.DepartmentID : "",
                    timestamp: evtJson.Login ? (evtJson.BusyTimestamp) : "",
                    busyTimestamp: evtJson.BusyTimestamp,
                    loginTimestamp: evtJson.LoginTimestamp,
                    busyType: evtJson.BusyType,
                    pinyin: cnToSpell.getSpell(evtJson.DisplayName),
                    pbx: evtJson.PBX
                };
                holly.phone.phone_peers[evtJson.UserID] = peer;
                holly.phone.phone_peers_sip[evtJson.SipNum] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
            } else {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.peerStatus = evtJson.PeerStatus;
                peer.status = evtJson.Status;
                peer.exten = evtJson.Exten;
                peer.sipNo = evtJson.SipNum;
                peer.C5Status = evtJson.C5Status;
                peer.busy = evtJson.Busy;
                peer.extenType = evtJson.ExtenType;
                peer.login = evtJson.Login;
                peer.loginExten = evtJson.LoginExten;
                peer.name = evtJson.User;
                peer.DisplayName = evtJson.DisplayName;
                peer.userId = evtJson.UserID;
                peer.user = evtJson.User;
                peer.localNo = evtJson.Local;
                peer.register = isRegistered;
                peer.InCalls = evtJson.InCalls;
                peer.InComplete = evtJson.InComplete;
                peer.TransferComplete = evtJson.TransferComplete;
                peer.DialoutTimeLength = evtJson.DialoutTimeLength;
                peer.OutCalls = evtJson.OutCalls;
                peer.OutComplete = evtJson.OutComplete;
                peer.department = evtJson.DepartmentID ? evtJson.DepartmentID : "";
                peer.busyTimestamp = evtJson.BusyTimestamp;
                peer.loginTimestamp = evtJson.LoginTimestamp;
                peer.busyType = evtJson.BusyType;
                peer.timestamp = peer.login ? (peer.busyTimestamp) : "";
                if (peer.DisplayName !== evtJson.DisplayName)
                    peer.pinyin = cnToSpell.getSpell(evtJson.DisplayName);
                holly.phone.phone_peers_sip[evtJson.SipNum] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "UserBusy") {
            if (holly.phone.phone_peers[evtJson.UserID]) {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.busy = evtJson.Busy;
                peer.busyType = evtJson.BusyType;
                peer.busyTimestamp = evtJson.BusyTimestamp;
                peer.timestamp = peer.login ? (peer.busyTimestamp) : "";
                peer.loginTimestamp = evtJson.LoginTimestamp;
                holly.phone.phone_peers_sip[peer.sipNo] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "UserCallsUpdate") {
            if (holly.phone.phone_peers[evtJson.UserID]) {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.InCalls = evtJson.InCalls;
                peer.InComplete = evtJson.InComplete;
                peer.TransferComplete = evtJson.TransferComplete;
                peer.DialoutTimeLength = evtJson.DialoutTimeLength;
                peer.OutCalls = evtJson.OutCalls;
                peer.OutComplete = evtJson.OutComplete;
                holly.phone.phone_peers_sip[peer.sipNo] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "UserSignIn") {
            if (holly.phone.phone_peers[evtJson.UserID]) {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.extenType = evtJson.ExtenType;
                peer.login = evtJson.Login;
                peer.sipNo = evtJson.SipNum;
                holly.phone.phone_peers_sip[peer.sipNo] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "UserSignOut") {
            if (holly.phone.phone_peers[evtJson.UserID]) {
                peer = holly.phone.phone_peers[evtJson.UserID];
                peer.extenType = evtJson.ExtenType;
                peer.sipNo = evtJson.SipNum;
                peer.login = evtJson.Login;
                holly.phone.phone_peers_sip[peer.sipNo] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        } else if (evtJson.Event === "PeerStatus") {
            isRegistered = false;
            if (evtJson.PeerStatus === "Registered")
                isRegistered = true;
            //            var peer = holly.phone._phone_getUserFromSip(evtJson.Exten);
            peer = holly.phone.phone_peers_sip[evtJson.Exten];
            if (peer) {
                peer.register = isRegistered;
                peer.status = evtJson.Status;
                if (evtJson.ExtenType && evtJson.ExtenType === 'Local') {
                    peer.localNo = evtJson.LocalNum;
                    peer.loginExten = evtJson.LocalNum;
                }
                holly.phone.phone_peers[peer.UserID] = peer;
                holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                holly.phone._phone_updateQueueInfo();
            }
        }
    },
    phone_registerEvent: function(eventName, method) {
        $("#icc_event").on(eventName, method);
    },
    phone_publishEvent: function(eventName, params) {
        $("#icc_event").trigger(eventName, params);
    },
    _phone_updateQueueInfo: function() {
        //        if(!phone_queues || phone_queues.length<1)
        //            return;
        for (var i in holly.phone.phone_queues) {
            var queue = holly.phone.phone_queues[i];
            var members = queue.members;
            queue.busyAgentCount = 0;
            queue.idleAgentCount = 0;
            for (var j in members) {
                //                var peer = holly.phone._phone_getUserFromSip(members[j]);
                var peer = holly.phone.phone_peers_sip[members[j]];
                if (peer) {
                    if (peer.extenType === "sip") {
                        if (!peer.register || !peer.login || peer.busy || peer.callStatus !== "Idle") {
                            queue.busyAgentCount++;
                        } else {
                            queue.idleAgentCount++;
                        }
                    } else if (peer.extenType === "gateway") {
                        if (!peer.register || peer.busy || peer.callStatus !== "Idle") {
                            queue.busyAgentCount++;
                        } else {
                            queue.idleAgentCount++;
                        }
                    } else if (peer.extenType === "Local") {
                        if (peer.busy || peer.callStatus !== "Idle") {
                            queue.busyAgentCount++;
                        } else {
                            queue.idleAgentCount++;
                        }
                    } else {
                        queue.busyAgentCount++;
                    }
                } else {
                    queue.idleAgentCount++;
                }
            }
            holly.phone.phone_publishEvent("EvtMonitorQueue", [queue, "noNeedWaitCount"]);
        }
    },
    _phone_update: function(evtJson) {
        var timestamp = "";
        if (evtJson.Event === "ChannelStatus") {
            if (evtJson.Timestamp)
                timestamp = evtJson.Timestamp;
        } else if (evtJson.Event === "UserStatus") {
            timestamp = (evtJson.Login ? (evtJson.BusyTimestamp) : "");
        } else if (evtJson.Event === "UserBusy") {
            timestamp = evtJson.BusyTimestamp;
        }
        if (holly.phone._phone_currentState !== holly.phone._phone_peerstate) {
            holly.utils.hideSoftphonebar();
        } else {
            holly.utils.pickSoftphonebar();
        }
        holly.phone.phone_publishEvent("toolbarupdate", [holly.phone._phone_stateDescription[holly.phone._phone_currentState], timestamp]);
        switch (holly.phone._phone_currentState) {
            case holly.phone._phone_unregister:
                break;
            case holly.phone._phone_peerstate:
                if (evtJson.Event === "ChannelStatus") {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        holly.phone.phone_data._curChannel = evtJson.Channel;
                        if (evtJson.ChannelStatus === "Hangup") {
                            holly.phone.phone_publishEvent("EvtHangup", evtJson);
                        }
                    }
                }
                break;
            case holly.phone._phone_dialing:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                    holly.phone.phone_publishEvent("EvtRing", evtJson);
                    //                    holly.softphonebar._softphonebar_evtRing(evtJson);
                }
                break;
            case holly.phone._phone_innerDialing:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                break;
            case holly.phone._phone_belling:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    holly.phone.phone_publishEvent("EvtRing", evtJson);
                    //                    holly.softphonebar._softphonebar_evtRing(evtJson);
                }
                break;
            case holly.phone._phone_innerBelling:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        //                        holly.phone.phone_publishEvent("EvtRing", evtJson);
                    }
                }
                break;
            case holly.phone._phone_listening:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                break;
            case holly.phone._phone_talking:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Exten == holly.phone.phone_data.sipNo) {
                    //                    holly.phone.phone_publishEvent("EvtTalking", evtJson);
                    holly.softphonebar._softphonebar_evtTalking(evtJson);
                }
                break;
            case holly.phone._phone_transfer:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        //                        holly.phone.phone_publishEvent("EvtTalking", evtJson);
                    }
                }
                break;
            case holly.phone._phone_dialoutTransfer:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                if (evtJson.LinkedChannel) {
                    holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                }
                break;
            case holly.phone._phone_threeWayTalking:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                break;
            case holly.phone._phone_innerTalking:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                if (evtJson.LinkedChannel)
                    holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        //                        holly.phone.phone_publishEvent("EvtTalking", evtJson);
                    }
                }
                break;
            case holly.phone._phone_dialTalking:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                    //                    holly.phone.phone_publishEvent("EvtTalking", evtJson);
                    holly.softphonebar._softphonebar_evtTalking(evtJson);
                }
                break;
            case holly.phone._phone_listened:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                break;
            case holly.phone._phone_transferBelling:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                        //                        holly.phone.phone_publishEvent("EvtRing", evtJson);
                    }
                }
                break;
            case holly.phone._phone_transferDialing:
                holly.phone.phone_data._curChannel = evtJson.Channel;
                holly.phone.phone_data._otherChannel = evtJson.LinkedChannel.Channel;
                if (evtJson.Link) {
                    var linkedChannel = evtJson.LinkedChannel;
                    if (holly.phone._phone_callObject.callId !== linkedChannel.Uniqueid) {
                        holly.phone._phone_callObject.callId = linkedChannel.Uniqueid;
                        var callsheetid = "";
                        if (linkedChannel.Data && linkedChannel.Data.CallSheetID)
                            callsheetid = linkedChannel.Data.CallSheetID;
                        holly.phone._phone_callObject = {
                            callSheetId: callsheetid,
                            originId: linkedChannel.Uniqueid,
                            originCallNo: linkedChannel.FromDid,
                            originCalledNo: linkedChannel.FromCid,
                            callType: linkedChannel.ChannelType,
                            callId: linkedChannel.Uniqueid,
                            queue: linkedChannel.Queue,
                            location: linkedChannel.Location,
                            offeringTime: holly.phone._phone_dateParse(new Date(evtJson.Timestamp * 1000)),
                            callerProvince: decodeURIComponent(evtJson.CallerProvince),
                            callerProvinceCode: evtJson.CallerProvinceCode,
                            callerCity: decodeURIComponent(evtJson.CallerCity),
                            callerCityCode: evtJson.CallerCityCode,
                            data: {}
                        };
                        if (linkedChannel.Data) {
                            holly.phone._phone_callObject.data = linkedChannel.Data;
                            holly.phone._phone_callObject.data.callSheetId = callsheetid;
                        }
                        var queue = holly.phone.phone_queues[holly.phone._phone_callObject.queue];
                        if (queue) {
                            holly.phone._phone_callObject.queueName = queue.queueName;
                        }
                        //                        holly.phone.phone_publishEvent("EvtRing", [holly.phone._phone_callObject]);
                    }
                }
                break;
        }
    },
    _phone_getUserFromSip: function(sipNo) {
        var peer = holly.phone._phone_peersFromSip[sipNo];
        if (!peer) {
            if (!holly.phone.phone_peers)
                return null;
            for (var i in holly.phone.phone_peers) {
                if (holly.phone.phone_peers[i].sipNo === sipNo) {
                    holly.phone._phone_peersFromSip[sipNo] = holly.phone.phone_peers[i];
                    return holly.phone._phone_peersFromSip[sipNo];
                }
            }
            return null;
        } else {
            return peer;
        }
    },
    _phone_getUserFromExten: function(exten) {
        if (!holly.phone.phone_peers)
            return null;
        for (var i in holly.phone.phone_peers) {
            if (holly.phone.phone_peers[i].exten === exten) {
                return holly.phone.phone_peers[i];
            }
        }
        return null;
    },

    _phone_super: function(evtJson) {
        if (evtJson.Event === "UserStatus") {
            if (holly.phone.phone_data.userId === evtJson.UserID) {
                holly.phone.phone_data.busyType = evtJson.BusyType;
                if (holly.phone.phone_data.sipNo !== evtJson.SipNum) {
                    holly.phone.phone_data.sipNo = evtJson.SipNum;
                    if (evtJson.PeerStatus === "Unregistered") {
                        holly.phone._phone_currentState = holly.phone._phone_unregister;
                        holly.phone._phone_update(evtJson);
                        if (hollyglobal.multiLogin) {
                            holly.utils.kickSoftphonebar();
                        }
                    } else if (evtJson.PeerStatus === "Registered") {
                        holly.phone._phone_currentState = holly.phone._phone_peerstate;
                        holly.phone._phone_update(evtJson);
                        if (hollyglobal.multiLogin) {
                            holly.utils.pickSoftphonebar();
                        }
                    }
                }
            }
        } else if (evtJson.Event === "UserBusy") {
            if (holly.phone.phone_data.userId === evtJson.UserID)
                holly.phone.phone_data.busyType = evtJson.BusyType;
        } else if (evtJson.Event === "ChannelStatus") {
            if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                if (evtJson.ChannelStatus === "Unlink") {
                    holly.phone.phone_data._curChannel = evtJson.Channel;
                    holly.phone.phone_data._callId = "";
                }
            }
        } else if (evtJson.Event === "PeerStatus") {
            if (evtJson.Exten === holly.phone.phone_data.sipNo) {
                if (holly.phone._phone_currentState == holly.phone._phone_peerstate)
                    return;
                if (holly.phone.phone_data.busyType == holly.phone._phone_systemBusy)
                    return;
                //                var peer = holly.phone._phone_getUserFromSip(evtJson.Exten);
                var peer = holly.phone.phone_peers_sip[evtJson.Exten];
                if (peer)
                    holly.phone.phone_publishEvent("toolbarupdate", [holly.phone._phone_stateDescription[holly.phone._phone_currentState], ""]);
            }
        } else if (evtJson.Event === "TransferSuccess" || evtJson.Event === "TransferFailed") {
            evtJson.Type = "Transfer";
            if (evtJson.Investigate) {
                evtJson.Type = "Investigate";
            }
            holly.phone.phone_publishEvent("transfering", [evtJson]);
        } else if (evtJson.Event === "IvrMenuEnd") {
            holly.phone.phone_publishEvent("ivrMenuTransfering", [evtJson]);
        } else if (evtJson.Event === "DialinAgentBusyMessage") {
            holly.phone.phone_publishEvent("EvtDialinAgentBusyMessage", [evtJson]);
        }
    },
    phone_dialout: function(phoneNum, interfaceData) {
        if (/^\d+$/.test(phoneNum)) {
            var call_type = "";
            if (phoneNum.length < 5 && phoneNum.length !== 4) {
                var peer = holly.phone._phone_getUserFromExten(phoneNum);
                if (!peer) {
                    phoneNum = "9" + phoneNum;
                    call_type = "dialout";
                } else {
                    call_type = "inner";
                }
            } else if (phoneNum.length === 4) {
                call_type = "inner";
            } else if (phoneNum.length === 5) {
                if (holly.utils.startWith(phoneNum, '1') || holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                    phoneNum = "9" + phoneNum;
                    call_type = "dialout";
                } else {
                    call_type = "inner";
                }
            } else {
                phoneNum = "9" + phoneNum;
                call_type = "dialout";
            }
            interfaceData = {
                'tt': '131'
            };
            //            var Variable = "directCallerIDNum%3d13488817474";
            hollyglobal.isPopPage = true;
            var phoneJson = {
                Command: "Action",
                Action: "Originate",
                ActionID: "Originate" + Math.random(),
                Channel: "SIP/" + holly.phone.phone_data.sipNo,
                Context: holly.phone.phone_data.accountId,
                Exten: phoneNum,
                Priority: '1',
                UserID: holly.phone.phone_data.userId,
                Timeout: 60000,
                Async: "true",
                CallType: call_type,
                //                Variable:Variable,
                PBX: holly.phone.phone_data.pbx_in_ip,
                Account: holly.phone.phone_data.accountId,
                SessionID: holly.phone.phone_data.uniqueId
            };
            //            if(interfaceData)
            //                phoneJson.InterfaceData = interfaceData;
            var onload = function(response) {
                try {
                    if (!response.Succeed) {
                        Message.error(response.Message)
                        if (response.Expired) {
                            holly.phone._phone_relogin(false);
                        }
                    } else {
                        $('#DialEnable').attr("disabled", "true");
                    }
                } catch (e) {
                    if ($('#DialEnable'))
                        $('#DialEnable').removeAttr("disabled");
                }
            }
            var onerror = function() {
                if ($('#DialEnable'))
                    $('#DialEnable').removeAttr("disabled");
            };
            holly.phone._phone_sendAction(phoneJson, onload, onerror);
            return true;
        } else {
            alert("请输入正确的电话号码");
            if ($('#DialEnable'))
                $('#DialEnable').removeAttr("disabled");
            return false;
        }
    },
    phone_setBusy: function(isBusy, busyType) {
        if (holly.phone._phone_isSettingbusy)
            return;
        else
            holly.phone._phone_isSettingbusy = true;
        var phoneJson = {
            Command: "Action",
            Action: "Busy",
            ActionID: "Busy" + Math.random(),
            Exten: holly.phone.phone_data.userId,
            Busy: isBusy,
            BusyType: "" + busyType,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (!response.Succeed) {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
            holly.phone._phone_isSettingbusy = false;
        }
        var onerror = function() {
            holly.phone._phone_isSettingbusy = false;
        };
        holly.phone._phone_sendAction(phoneJson, onload, onerror);
    },
    phone_hangup: function() {
        var phoneJson = {
            Command: "Action",
            Action: "Hangup",
            ActionID: "Hangup" + Math.random(),
            Channel: holly.phone.phone_data._curChannel,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (!response.Succeed) {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        holly.phone._phone_sendAction(phoneJson, onload, function() {});
    },

    phone_hold: function() {
        var phoneJson = {
            Command: "Action",
            Action: "Hold",
            ActionID: "Hold" + Math.random(),
            Channel: holly.phone.phone_data._otherChannel,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (response.Succeed) {
                holly.phone._phone_stateBeforeHold = holly.phone._phone_currentState;
                holly.phone.phone_publishEvent("barupdate", ["hold", "continueTime"]);
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        holly.phone._phone_sendAction(phoneJson, onload, function() {});
    },
    phone_unhold: function() {
        var phoneJson = {
            Command: "Action",
            Action: "Unhold",
            ActionID: "Unhold" + Math.random(),
            Channel: holly.phone.phone_data._otherChannel,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (response.Succeed) {
                holly.phone.phone_publishEvent("barupdate", [holly.phone._phone_stateDescription[holly.phone._phone_stateBeforeHold], "continueTime"]);
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        holly.phone._phone_sendAction(phoneJson, onload, function() {});
    },
    phone_consult: function(phoneNum, mode) {
        if (mode === "number") {
            if (phoneNum.length <= 6) {
                var phoneNumBak = phoneNum;
                phoneNum = phoneNum.substr(1);
                if (phoneNum.length === 5) {
                    if (holly.utils.startWith(phoneNum, '1') || holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                        holly.softphonebar._softphonebar_showConsult(phoneNumBak + " ");
                        phoneNum = phoneNumBak;
                    } else {
                        holly.softphonebar._softphonebar_showConsult("工号 " + phoneNum + " ");
                    }
                } else if (phoneNum.length === 4) {
                    if (holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                        holly.softphonebar._softphonebar_showConsult(phoneNumBak + " ");
                        phoneNum = phoneNumBak;
                    } else {
                        holly.softphonebar._softphonebar_showConsult("工号 " + phoneNum + " ");
                    }
                }
            } else
                holly.softphonebar._softphonebar_showConsult(phoneNum + " ");
        } else if (mode === "skillgroup") {
            holly.softphonebar._softphonebar_showConsult(phoneNum + " ");
        }
        var phoneJson = {
            Command: "Action",
            Action: "Consult",
            ActionID: "Consult" + Math.random(),
            FromExten: holly.phone.phone_data.sipNo,
            Exten: phoneNum,
            Timeout: 60000,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            holly.softphonebar.softphonebar_close();
            if (response.Succeed) {
                holly.utils.showTransferOrConsultSucc("咨询成功", "softphone_consult");
                holly.phone.phone_publishEvent("toolbarupdate", ["consultTalking", "continueTime"]);
            } else {
                holly.utils.showTransferOrConsultError("咨询失败", "softphone_consult");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {
            holly.softphonebar.softphonebar_close();
            holly.utils.showTransferOrConsultError("咨询失败", "softphone_consult");
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },

    phone_stopConsult: function() {
        var phoneJson = {
            Command: "Action",
            Action: "StopConsult",
            ActionID: "StopConsult" + Math.random(),
            FromExten: holly.phone.phone_data.sipNo,
            Timeout: 60000,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (response.Succeed) {
                if (response.Message != undefined) {
                    if (response.Message === "Idle") {
                        holly.phone.phone_publishEvent("toolbarupdate", ["peerstate", "continueTime"]);
                    } else {
                        holly.phone.phone_publishEvent("toolbarupdate", ["talking", "continueTime"]);
                    }
                } else {
                    holly.phone.phone_publishEvent("toolbarupdate", ["talking", "continueTime"]);
                }
            } else {
                holly.utils.showTransferOrConsultError("结束咨询通话失败", "softphone_consult");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {
            holly.utils.showTransferOrConsultError("结束咨询通话失败", "softphone_consult");
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_toMenu: function(exten, displayName) {
        holly.softphonebar.softphonebar_closeModel();
        holly.softphonebar._softphonebar_showToMenu(displayName);
        var phoneJson = {
            Command: "Action",
            Action: "IvrMenu",
            ActionID: "IvrMenu" + Math.random(),
            Channel: holly.phone.phone_data._otherChannel,
            Context: exten,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId
        }
        var onload = function(response) {
            if (response.Succeed) {
                //holly.softphonebar.softphonebar_closeModel();
            } else {
                holly.softphonebar.softphonebar_close();
                holly.utils.showError("转IVR菜单失败", "softphone_transfer");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {
            holly.softphonebar.softphonebar_close();
            holly.utils.showError("转IVR菜单失败", "softphone_transfer");
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_transfer: function(phoneNum, mode) {
        if (mode == "number") {
            if (phoneNum.length <= 6) {
                var phoneNumBak = phoneNum;
                phoneNum = phoneNum.substr(1);
                if (phoneNum.length === 5) {
                    if (holly.utils.startWith(phoneNum, '1') || holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                        holly.softphonebar._softphonebar_showTranster(phoneNumBak + " ");
                        phoneNum = phoneNumBak;
                    } else {
                        holly.softphonebar._softphonebar_showTranster("工号 " + phoneNum + " ");
                    }
                } else if (phoneNum.length === 4) {
                    if (holly.utils.startWith(phoneNum, '0') || holly.utils.startWith(phoneNum, '9')) {
                        holly.softphonebar._softphonebar_showTranster(phoneNumBak + " ");
                        phoneNum = phoneNumBak;
                    } else {
                        holly.softphonebar._softphonebar_showTranster("工号 " + phoneNum + " ");
                    }
                }
            } else
                holly.softphonebar._softphonebar_showTranster(phoneNum + " ");
        } else if (mode == "skillgroup") {
            holly.softphonebar._softphonebar_showTranster(phoneNum + " ");
        }
        var phoneJson = {
            Command: "Action",
            Action: "Transfer",
            ActionID: "Transfer" + Math.random(),
            Exten: phoneNum,
            Channel: holly.phone.phone_data._otherChannel,
            ExtraChannel: holly.phone.phone_data._curChannel,
            UserID: holly.phone.phone_data.userId,
            Context: holly.phone.phone_data.accountId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (response.Succeed) {
                holly.softphonebar.softphonebar_close();
                holly.utils.showTransferOrConsultSucc("转接成功", 'softphone_transfer');
            } else {
                holly.softphonebar.softphonebar_close();
                var message = "";
                if (response.Message == "310") {
                    message = "未配置外呼线路";
                } else if (response.Message == "311") {
                    message = "转接的用户忙";
                } else if (response.Message == "312") {
                    message = "转接的用户未签入";
                } else if (response.Message == "313") {
                    message = "转接的用户正在通话";
                } else if (response.Message == "314") {
                    message = "转接的用户没有以通话方式登录";
                } else if (response.Message == "315") {
                    message = "无法呼通转接的用户";
                } else if (response.Message == "316") {
                    message = "转接用户不存在";
                } else {
                    message = "";
                }
                if (message == "") {
                    holly.utils.showTransferOrConsultError("转接失败", 'softphone_transfer');
                } else {
                    holly.utils.showTransferOrConsultError("转接失败：" + message, 'softphone_transfer');
                }
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {
            holly.softphonebar.softphonebar_close();
            holly.utils.showTransferOrConsultError("转接失败", 'softphone_transfer');
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },

    phone_cancelTransfer: function() {
        if (holly.phone.phone_data._otherChannel) {
            var phoneJson = {
                Command: "Action",
                Action: "CancelTransfer",
                ActionID: "CancelTransfer" + Math.random(),
                Channel: holly.phone.phone_data._otherChannel,
                PBX: holly.phone.phone_data.pbx_in_ip,
                Account: holly.phone.phone_data.accountId,
                SessionID: holly.phone.phone_data.uniqueId
            };
            var onload = function(response) {
                holly.softphonebar.softphonebar_close();
                if (response.Succeed) {
                    holly.utils.showTransferOrConsultSucc("取消转接成功", 'softphone_transfer');
                } else {
                    holly.utils.showTransferOrConsultError("取消转接失败", 'softphone_transfer');
                    if (response.Expired) {
                        holly.phone._phone_relogin();
                    }
                }
            }
            var error = function() {
                holly.softphonebar.softphonebar_close();
                holly.utils.showTransferOrConsultError("取消转接失败", "softphone_transfer");
            }
            holly.phone._phone_sendAction(phoneJson, onload, error);
        }
    },

    phone_threewaycall: function(phoneNum) {
        var phoneJson = {
            Command: "Action",
            Action: "ThreeWayCall",
            ActionID: "ThreeWayCall" + Math.random(),
            FromExten: holly.phone.phone_data.sipNo,
            Exten: phoneNum,
            Timeout: 60000,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            holly.softphonebar.softphonebar_close();
            if (response.Succeed) {
                holly.utils.showTransferOrConsultSucc("三方通话成功", "softphone_consult");
                holly.phone.phone_publishEvent("toolbarupdate", ["threeWayTalking", ""]);
            } else {
                holly.utils.showTransferOrConsultError("三方通话失败", "softphone_consult");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {
            holly.softphonebar.softphonebar_close();
            holly.utils.showTransferOrConsultError("咨询失败", "softphone_consult");
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_kick: function(userId) {
        var phoneJson = {
            Command: "Action",
            Action: "Kick",
            ActionID: "Kick" + Math.random(),
            Exten: userId,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (response.Succeed) {
                var peer = holly.phone.phone_peers[userId];
                if (peer) {
                    peer.C5Status = "";
                    peer.callNo = "";
                    peer.callStatus = "Idle";
                    var date = new Date();
                    var identity = date.valueOf();
                    peer.timestamp = identity / 1000;
                    peer.channel = "";
                    peer.linkedChannel = "";
                    holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                    holly.phone._phone_updateQueueInfo();
                }
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {}
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_toIVR: function() {
        if (holly.phone._phone_isToIVR)
            return;
        holly.phone._phone_isToIVR = true;
        var phoneJson = {
            Command: "Action",
            Action: "Validate",
            ActionID: "Validate" + Math.random(),
            Exten: 's',
            Channel: holly.phone.phone_data._otherChannel,
            Timeout: 60000,
            UserID: holly.phone.phone_data.userId,
            Context: holly.phone.phone_data.accountId + "-validate",
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (!response.Succeed) {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
            holly.phone._phone_isToIVR = false;
        }
        var error = function() {
            holly.phone._phone_isToIVR = false;
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_kickFromPbx: function(userId, pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        var url = phone_pbx.proxyUrl;
        var phoneJson = {
            Command: "Action",
            Action: "Kick",
            ActionID: "Kick" + Math.random(),
            Exten: userId,
            UserID: holly.phone.phone_data.userId,
            PBX: pbx,
            Account: holly.phone.phone_data.accountId,
            SessionID: phone_pbx.sessionId
        };
        var onload = function(response) {
            if (response.Succeed) {
                var peer = holly.phone.phone_peers[userId];
                if (peer) {
                    peer.C5Status = "";
                    peer.callNo = "";
                    peer.callStatus = "Idle";
                    var date = new Date();
                    var identity = date.valueOf();
                    peer.timestamp = identity / 1000;
                    peer.channel = "";
                    peer.linkedChannel = "";
                    holly.phone.phone_publishEvent("EvtMonitorPeer", [peer]);
                    holly.phone._phone_updateQueueInfo();
                }
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {}
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {
                json: json
            },
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    phone_pick: function(userId) {
        var peer = holly.phone.phone_peers[userId];
        if (peer == null || peer.localNo == null || peer.localNo == "") {
            holly.utils.showError("当前在线座席总数已达最大值，无法再签入", "softphone_transfer");
            return;
        }
        var phoneJson = {
            Command: "Action",
            Action: "SignIn",
            ActionID: "SignIn" + Math.random(),
            User: userId,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (response.Succeed) {
                holly.utils.showSucc("座席签入成功", "softphone_transfer");
            } else {
                holly.utils.showError("当前在线座席总数已达最大值，无法再签入", "softphone_transfer");
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {}
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_hangupChannel: function(channel) {
        var phoneJson = {
            Command: "Action",
            Action: "Hangup",
            ActionID: "ForceHangup" + Math.random(),
            Channel: channel,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {}
        var error = function() {}
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },

    phone_hangupChannelFromPbx: function(channel, pbx) {
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        var url = phone_pbx.proxyUrl;
        var phoneJson = {
            Command: "Action",
            Action: "Hangup",
            ActionID: "ForceHangup" + Math.random(),
            Channel: channel,
            UserID: holly.phone.phone_data.userId,
            PBX: pbx,
            Account: holly.phone.phone_data.accountId,
            SessionID: phone_pbx.sessionId
        };
        var onload = function(response) {}
        var error = function() {}
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {
                json: json
            },
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },

    phone_loot: function(channel) {
        if (holly.phone.phone_data.busyType == "0") {
            holly.utils.showError("请先将电话置为忙碌", "softphone_transfer");
            return;
        }
        var phoneJson = {
            Command: "Action",
            Action: "Transfer",
            ActionID: "Transfer" + Math.random(),
            Exten: holly.phone.phone_data.sipNo,
            Channel: channel,
            CallType: "Loot",
            Context: holly.phone.phone_data.accountId,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (!response.Succeed) {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {}
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },
    phone_pickFromPbx: function(userId, pbx) {
        var peer = holly.phone.phone_peers[userId];
        if (peer == null || peer.localNo == null || peer.localNo == "") {
            holly.utils.showError("不能对没有直线号码的座席做签入操作", "softphone_transfer");
            return;
        }
        var phone_pbx = holly.phone.phone_pbxs[pbx];
        var url = phone_pbx.proxyUrl;
        var phoneJson = {
            Command: "Action",
            Action: "SignIn",
            ActionID: "SignIn" + Math.random(),
            User: userId,
            UserID: holly.phone.phone_data.userId,
            PBX: pbx,
            Account: holly.phone.phone_data.accountId,
            SessionID: phone_pbx.sessionId
        };
        var onload = function(response) {
            if (response.Succeed) {
                holly.utils.showSucc("座席签入成功", "softphone_transfer");
            } else {
                holly.utils.showError("当前在线座席总数已达最大值，无法再签入", "softphone_transfer");
                if (response.Expired) {
                    holly.phone._phone_relogin(true);
                }
            }
        }
        var error = function() {}
        var json = $.toJSON(phoneJson);
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {
                json: json
            },
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    },
    phone_investigate: function() {
        if (holly.phone._phone_isInvestigatting)
            return;
        holly.phone._phone_isInvestigatting = true;
        var phoneJson = {
            Command: "Action",
            Action: "Transfer",
            ActionID: "Transfer" + Math.random(),
            Exten: 's',
            Channel: holly.phone.phone_data._otherChannel,
            Timeout: 60000,
            CallType: 'investigate',
            UserID: holly.phone.phone_data.userId,
            Context: holly.phone.phone_data.accountId + "-investigate",
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (response.Succeed) {

            } else {
                Message.error(response.Message);
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
            holly.phone._phone_isInvestigatting = false;
        }
        var error = function() {
            holly.phone._phone_isInvestigatting = false;
        }
        holly.phone._phone_sendAction(phoneJson, onload, error);
    },

    _phone_exit: function(removeQueue) {
        if (!removeQueue)
            removeQueue = false;
        if (!holly.phone.phone_data.uniqueId) {
            phone_data = {};
            holly.session.logined = false;
            window.location = './softphoneBar.html';
            return;
        }
        var actionName = "Logoff";
        if (hollyglobal.multiLogin) {
            actionName = "MultipleLogoff";
        }
        var phoneJson = {
            Command: "Action",
            Action: "Logoff",
            ActionID: "Logoff" + Math.random(),
            QueueRemove: removeQueue,
            User: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (response.Succeed) {
                holly.utils.kickSoftphonebar();
                holly.session.logined = false;
                holly.phone._phone_isKick = false;
                holly.softphonebar._softphonebar_barupdate('', 'unregister', '');
            }
        }
        holly.phone._phone_sendAction(phoneJson, onload, function() {});
    },
    _phone_dateParse: function(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + (month > 9 ? month : "0" + month) + "-" + (day > 9 ? day : "0" + day) + " " + (hour > 9 ? hour : "0" + hour) + ":" + (minute > 9 ? minute : "0" + minute) + ":" + (second > 9 ? second : "0" + second);
    },

    phone_isAllowDialout: function() {
        return holly.phone._phone_stateDescription[holly.phone._phone_currentState] == "peerstate";
    },
    phone_closeTransfer: function() {
        var bgObj = document.getElementById("hollyc5.bgDiv");
        var msgObj = document.getElementById("hollyc5.msgDiv");
        if (msgObj != null) {
            document.getElementById("TransferEnable1").removeChild(msgObj);
        }
        if (bgObj != null) {
            document.getElementById("TransferEnable1").removeChild(bgObj);
        }
    },
    phone_openTransferOrConsult: function(objectId) {
        $("#softphone-bar-bgdiv").css({
            display: "block",
            height: $(document).height()
        });
        var inputElement = "<input type=\"text\" id=\"" + objectId + "_div_input\" style=\"width:160px;height:20px;color:#938c8c;float:left;padding-right: 10px;\" " +
            "value=\"请输入工号或者手机号\" onfocus=\"if(this.value=='请输入工号或者手机号'){this.value='';this.style.color='#000'}\" " +
            "onblur=\"if(this.value==''){this.value='请输入工号或者手机号';this.style.color='#938c8c'}\" autocomplete='off'/>";
        var bodyHtml = "<div class='modal-body' style='height:30px;padding:9px 0 0 2px;' >" + inputElement;
        if (objectId === 'softphone_transfer') {
            bodyHtml += "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.softphonebar.softphonebar_transfer($('#" + objectId + "_div_input').val())\">转 接</button>";
            //            bodyHtml +="<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"holly.softphonebar._softphonebar_showTranster('913488817474')\">转 接</button>";
            //            bodyHtml +="<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"holly.utils.showTransferOrConsultError('913488817474','softphone_transfer')\">转 接</button>";
        } else
            bodyHtml += "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.softphonebar.softphonebar_consult($('#" + objectId + "_div_input').val())\">咨 询</button>";
        //            bodyHtml +="<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"holly.softphonebar._softphonebar_showConsult('913488817474')\">咨 询</button>";
        bodyHtml += "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.phone.phone_closeDiv();\">关 闭</button></div>";
        $('#' + objectId).empty();
        $('#' + objectId).html(bodyHtml);
        document.documentElement.scrollTop = 0;
        $('#' + objectId).fadeIn('fast');
    },
    phone_listen: function(curChannel) {
        var phoneJson = {
            Command: "Action",
            Action: "Originate",
            ActionID: "Originate" + Math.random(),
            Channel: "SIP/" + holly.phone.phone_data.sipNo,
            Application: "ChanSpy",
            Data: curChannel + "|bq",
            Callerid: holly.phone.phone_data.sipNo,
            UserID: holly.phone.phone_data.userId,
            PBX: holly.phone.phone_data.pbx_in_ip,
            Account: holly.phone.phone_data.accountId,
            SessionID: holly.phone.phone_data.uniqueId
        };
        var onload = function(response) {
            if (response.Succeed) {
                holly.phone.phone_data._otherChannel = curChannel;
            } else {
                if (response.Expired) {
                    holly.phone._phone_relogin();
                }
            }
        }
        var error = function() {}
        holly.phone._phone_sendAction(phoneJson, onload, error);
        return true;
    },
    phone_closeDiv: function() {
        var pagedir = $('#softphone-bar-bgdiv');
        var transferObj = $('#softphone_transfer');
        var consultObj = $('#softphone_consult');
        if (transferObj != null) {
            transferObj.css('display', 'none');
        }
        if (consultObj != null) {
            consultObj.css('display', 'none');
        }
        if (pagedir != null) {
            pagedir.css('display', 'none');
        }
    },
    phone_unregisterEvent: function(eventName) {
        $("#icc_event").unbind(eventName);
    },
    _phone_queryQueueItem: function(evtJson) {
        return holly.phone.phone_queues[evtJson.Queue];
    },
    _phone_monitorQueue: function(evtJson) {
        if (evtJson.Event === "QueueParams") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            var member;
            if (queueItem) {
                if (evtJson.Removed) {
                    queueItem.removed = true;
                }
                queueItem.queueName = evtJson.DisplayName;
                queueItem.idleAgentCount = evtJson.Members - evtJson.BusyMembers;
                queueItem.busyAgentCount = evtJson.BusyMembers;
                queueItem.totalAgentCount = evtJson.Members;
                queueItem.queueWaitCount = evtJson.Calls;
                queueItem.abadonedCalls = evtJson.Abandoned;
                queueItem.totalCalls = evtJson.TotalCalls;
                queueItem.DisplayName = evtJson.DisplayName;
                queueItem.members = [];
                for (var i in evtJson.QueueMember) {
                    member = evtJson.QueueMember[i];
                    queueItem.members[member] = member;
                }
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "needWaitCount"]);
            } else {
                queueItem = {
                    queueName: evtJson.DisplayName,
                    queueId: evtJson.Queue,
                    idleAgentCount: evtJson.Members - evtJson.BusyMembers,
                    busyAgentCount: evtJson.BusyMembers,
                    totalAgentCount: evtJson.Members,
                    queueWaitCount: evtJson.Calls,
                    abadonedCalls: evtJson.Abandoned,
                    DisplayName: evtJson.DisplayName,
                    totalCalls: evtJson.TotalCalls,
                    members: [],
                    removed: false,
                    pbx: evtJson.PBX
                };
                for (var i in evtJson.QueueMember) {
                    member = evtJson.QueueMember[i];
                    queueItem.members[member] = member;
                }
                holly.phone.phone_queues[evtJson.Queue] = queueItem;
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "needWaitCount"]);
            }
        } else if (evtJson.Event === "QueueMemberAdded") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                if (!queueItem.members[evtJson.Exten]) {
                    queueItem.members[evtJson.Exten] = evtJson.Exten; //change
                    queueItem.totalAgentCount++;
                    holly.phone._phone_updateQueueInfo();
                }
            }
        } else if (evtJson.Event === "QueueMemberRemoved") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                if (queueItem.members[evtJson.Exten]) {
                    delete queueItem.members[evtJson.Exten];
                    queueItem.totalAgentCount--;
                    holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "noNeedWaitCount"]);
                }
            }
        } else if (evtJson.Event === "Join") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                queueItem.queueWaitCount++;
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "needWaitCount"]);
            }
        } else if (evtJson.Event === "Leave") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                queueItem.totalCalls++;
                queueItem.queueWaitCount--;
                if (queueItem.queueWaitCount < 0)
                    queueItem.queueWaitCount = 0;
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "needWaitCount"]);
            }
        } else if (evtJson.Event === "QueueCallerAbandon") {
            var queueItem = holly.phone._phone_queryQueueItem(evtJson);
            if (queueItem) {
                queueItem.abadonedCalls++;
                holly.phone.phone_publishEvent("EvtMonitorQueue", [queueItem, "noNeedWaitCount"]);
            }
        }
    },
    dialoutInterface: function() {
        var url = "http://127.0.0.1:7788/app?Action=Dialout&ActionID=Dialout" + Math.random() + "&Account=N000000007121&FromExten=8000&PBX=2.3.1.100&Exten=13488817474";
        var ExternalData = {
            callNum: "131313"
        };
        var json = encodeURI(ExternalData);
        var onload = function(response) {
            console.log(response);
        };
        var onerror = function(error) {
            console.log(error);
        };
        holly.phone._phone_test_sendAction(json, onload, onerror, url);
    },
    _phone_test_sendAction: function(jsonData, onload, onerror, url) {
        jsonData = $.toJSON("{'callNum' = '131313'}");
        var timeout = 15000;
        $.ajax({
            type: "get",
            url: url,
            timeout: timeout,
            cache: false,
            data: {
                ExternalData: jsonData
            },
            dataType: "jsonp",
            jsonp: "callbackName",
            success: onload,
            error: onerror
        });
    }
}

holly.softphonebar = {
    _softphonebar_state: new Array(),
    _softphonebar_desc: new Array(),
    _softphonebar_countTimer: 0,
    _softphonebar_calculagraph: "",
    _softphonebar_otherstateref: "",
    _softphonebar_curstateref: "",
    _softphonebar_timestateref: "",
    _softphonebar_callstateref: "",
    _softphonebar_dialogBoxRemain: 40000,
    _softphonebar_notifyDialogInterval: "",
    softphonebar_count: 0,
    _softphonebar_monitorTimers: [],
    _softphoneBar_replaceAll: new RegExp("\\.", "g"),
    _softphoneBar_replaceAll_bak: new RegExp("\\_", "g"),
    _softphonebar_peer_index: 0,
    _softphonebar_queue_index: 0,
    _softphonebar_serviceNo_index: 0,
    softphonebar_init: function() {
        holly.softphonebar._softphonebar_timestateref = $("#softphone_timer");
        holly.softphonebar._softphonebar_otherstateref = $("#softphone_otherstate");
        holly.softphonebar._softphonebar_curstateref = $("#softphone_curstate");
        holly.softphonebar._softphonebar_callstateref = $("#softphone_phonestate");

        holly.softphonebar._softphonebar_desc["unregister"] = "失效";
        holly.softphonebar._softphonebar_desc["peerstate"] = "空闲";
        holly.softphonebar._softphonebar_desc["dialing"] = "呼叫中";
        holly.softphonebar._softphonebar_desc["innerDialing"] = "呼叫中";
        holly.softphonebar._softphonebar_desc["belling"] = "来电振铃";
        holly.softphonebar._softphonebar_desc["innerBelling"] = "来电振铃";
        holly.softphonebar._softphonebar_desc["listening"] = "监听振铃";
        holly.softphonebar._softphonebar_desc["talking"] = "普通通话";
        holly.softphonebar._softphonebar_desc["threeWayTalking"] = "三方通话";
        holly.softphonebar._softphonebar_desc["innerTalking"] = "内部通话";
        holly.softphonebar._softphonebar_desc["dialTalking"] = "外呼通话";
        holly.softphonebar._softphonebar_desc["listened"] = "监听中";
        holly.softphonebar._softphonebar_desc["hold"] = "保持";
        holly.softphonebar._softphonebar_desc["consultTalking"] = "普通通话";
        holly.softphonebar._softphonebar_desc["dialTransfer"] = "转接通话";
        holly.softphonebar._softphonebar_desc["transfer"] = "转接通话";
        holly.softphonebar._softphonebar_desc["offline"] = "离线接听";
        holly.softphonebar._softphonebar_desc["ready"] = "签出";
        holly.softphonebar._softphonebar_desc["transferBelling"] = "转接振铃";
        holly.softphonebar._softphonebar_desc["transferDialing"] = "转接振铃";

        holly.softphonebar._softphonebar_state["unregister"] = [];
        holly.softphonebar._softphonebar_state["peerstate"] = ["dialout_input", "DialEnable"];
        holly.softphonebar._softphonebar_state["dialing"] = ["dialout_input", "HangupEnable"];
        holly.softphonebar._softphonebar_state["innerDialing"] = ["dialout_input", "HangupEnable"];
        holly.softphonebar._softphonebar_state["belling"] = ["dialout_input"];
        holly.softphonebar._softphonebar_state["innerBelling"] = ["dialout_input"];
        holly.softphonebar._softphonebar_state["transferBelling"] = [];
        holly.softphonebar._softphonebar_state["transferDialing"] = [];
        holly.softphonebar._softphonebar_state["listening"] = ["HangupEnable"];
        holly.softphonebar._softphonebar_state["talking"] = ["HoldEnable", "TransferEnable", "ConsultEnable", "HangupEnable", "InvestigateEnable"];
        holly.softphonebar._softphonebar_state["transfer"] = ["HoldEnable", "TransferEnable", "ConsultEnable", "HangupEnable", "InvestigateEnable"];
        holly.softphonebar._softphonebar_state["dialTransfer"] = ["HoldEnable", "TransferEnable", "ConsultEnable", "HangupEnable", "InvestigateEnable"];
        holly.softphonebar._softphonebar_state["threeWayTalking"] = ["HangupEnable"];
        holly.softphonebar._softphonebar_state["innerTalking"] = ["HangupEnable"];
        holly.softphonebar._softphonebar_state["dialTalking"] = ["HoldEnable", "TransferEnable", "ConsultEnable", "HangupEnable", "InvestigateEnable"];
        holly.softphonebar._softphonebar_state["listened"] = ["TransferDisable", "HangupEnable"];
        holly.softphonebar._softphonebar_state["hold"] = ["HoldGetEnable"];
        holly.softphonebar._softphonebar_state["consultTalking"] = ["ConsultThreeWayCallEnable", "ConsultTransferEnable", "StopConsultEnable", "HangupEnable"];

        holly.phone.phone_registerEvent("toolbarupdate", holly.softphonebar._softphonebar_toolbarupdate);
        holly.phone.phone_registerEvent("barupdate", holly.softphonebar._softphonebar_barupdate);
        holly.phone.phone_registerEvent("transfering", holly.softphonebar._softphonebar_transfering);
        holly.phone.phone_registerEvent("ivrMenuTransfering", holly.softphonebar._softphonebar_ivrMenuTransfering);
        holly.phone.phone_registerEvent("EvtMonitorServiceNo", holly.softphonebar._softphonebar_onServiceNoChanged);
        holly.phone.phone_registerEvent("EvtMonitorQueue", holly.softphonebar._softphonebar_onQueueChanged);
        holly.phone.phone_registerEvent("EvtMonitorPeer", holly.softphonebar._softphonebar_onPeerChanged);
        holly.phone.phone_registerEvent("EvtEndListen", holly.softphonebar._softphonebar_onEndListen);
        holly.phone.phone_registerEvent("EvtAccountCalls", holly.softphonebar._softphonebar_onAccountCalls);
        holly.phone.phone_registerEvent("EvtRing", holly.softphonebar._softphonebar_evtRing);
        //        holly.phone.phone_registerEvent("EvtTalking", holly.softphonebar._softphonebar_evtTalking);
        holly.phone.phone_registerEvent("EvtHangup", holly.softphonebar._softphonebar_evtHangup);
        holly.phone.phone_registerEvent("EvtDialinAgentBusyMessage", holly.softphonebar._softphonebar_ontDialinAgentBusy);

        if (!hollyglobal.isDisplayInvestigate) {
            holly.softphonebar._softphonebar_removeButton("InvestigateEnable");
        }
        if (!hollyglobal.isDisplayConsult) {
            holly.softphonebar._softphonebar_removeButton("ConsultEnable");
        }
        if (!hollyglobal.isDisplayTransfer) {
            holly.softphonebar._softphonebar_removeButton("TransferEnable");
        }
    },
    _softphonebar_removeButton: function(buttonId) {
        var state = holly.softphonebar._softphonebar_state;
        for (var i in state) {
            var softPhoneState = state[i];
            if (Array.indexOf(softPhoneState, buttonId) > -1) {
                for (var index in softPhoneState) {
                    if (softPhoneState[index] === buttonId) {
                        softPhoneState.splice(index, 1);
                        break;
                    }
                }
            }
        }
    },
    _softphonebar_toolbarupdate: function(event, state, timestamp) {
        $("#phone_bar :input").each(function() {
            var id = $(this).attr("id");
            if (holly.softphonebar._softphonebar_state[state]) {
                if (Array.indexOf(holly.softphonebar._softphonebar_state[state], id) < 0) {
                    $(this).css('display', 'none');
                } else {
                    $(this).css('display', 'inline-block');
                    $(this).removeAttr('disabled');
                }
            }
        });
        holly.softphonebar._softphonebar_switchState(state, timestamp);
    },

    _softphonebar_barupdate: function(event, state, timestamp) {
        $("#phone_bar :input").each(function() {
            var id = $(this).attr("id");
            if (holly.softphonebar._softphonebar_state[state]) {
                if (Array.indexOf(holly.softphonebar._softphonebar_state[state], id) < 0) {
                    $(this).css('display', 'none');
                } else {
                    $(this).css('display', 'inline-block');
                    $(this).removeAttr('disabled');
                }
            }
        });
        if (state === "unregister") {
            holly.softphonebar._softphonebar_timestateref.css('display', 'none');
        } else {
            holly.softphonebar._softphonebar_timestateref.css('display', 'inline-block');
        }
        holly.softphonebar._softphonebar_callstateref.css("color", "#B30000");
        if (state === "peerstate") {
            if (holly.phone.phone_data.busyType == "99") {
                holly.softphonebar._softphonebar_systemBusy();
            } else if (holly.phone.phone_data.busyType == "0") {
                holly.softphonebar._softphonebar_callstateref.css("color", "#468847");
            }
            holly.softphonebar._softphonebar_updPeerState();
            $("#softphone-bar .state_dropdown").css('display', 'inline-block');
            $("#softphone-bar .state_line").css('display', 'inline-block');
        } else {
            holly.softphonebar._softphonebar_updCallState(state);
            $("#softphone-bar .state_dropdown").css('display', 'none');
            $("#softphone-bar .state_line").css('display', 'none');
        }
    },

    _softphonebar_switchState: function(state, timestamp) {
        if (state === "unregister") {
            holly.softphonebar._softphonebar_timestateref.css('display', 'none');
        } else {
            holly.softphonebar._softphonebar_timestateref.css('display', 'inline-block');
        }
        holly.softphonebar._softphonebar_callstateref.css("color", "#B30000");
        if (state === "peerstate") {
            if (holly.phone.phone_data.busyType == "99") {
                holly.softphonebar._softphonebar_systemBusy();
            } else if (holly.phone.phone_data.busyType == "0") {
                holly.softphonebar._softphonebar_callstateref.css("color", "#468847");
            }
            holly.softphonebar._softphonebar_updPeerState();
            $("#softphone-bar .state_dropdown").css('visibility', 'visible');
            $("#softphone-bar .state_dropdown").css('display', 'inline-block');
        } else {
            holly.softphonebar._softphonebar_updCallState(state);
            $("#softphone-bar .state_dropdown").css('visibility', 'hidden');
            $("#softphone-bar .state_dropdown").css('display', 'none');
        }
        if ((state === "peerstate" && holly.phone.phone_data.busyType == "99") || timestamp === "continueTime")
            return;
        if (timestamp != "") {
            var date = new Date();
            var identity = date.valueOf();
            var oldTime = ((identity - holly.phone.phone_data.currentServerTime) - parseFloat(timestamp) * 1000) / 1000;
            if (oldTime < 0)
                holly.softphonebar._softphonebar_countTimer = 0;
            else
                holly.softphonebar._softphonebar_countTimer = oldTime;
        } else {
            holly.softphonebar._softphonebar_countTimer = 0;
        }
        if (holly.softphonebar._softphonebar_calculagraph != null)
            window.clearInterval(holly.softphonebar._softphonebar_calculagraph);
        holly.softphonebar._softphonebar_calculagraph = window.setInterval(function() {
            holly.softphonebar._softphonebar_doCallTimer();
        }, 1000);
    },
    _softphonebar_doCallTimer: function() {
        holly.softphonebar._softphonebar_timestateref.html(holly.softphonebar._softphonebar_getTimer(holly.softphonebar._softphonebar_countTimer));
        holly.softphonebar._softphonebar_countTimer++;
    },
    _softphonebar_getTimer: function(countTimer) {
        countTimer = parseInt(countTimer) + 1;
        var hour = parseInt(countTimer / 3600);
        var minute = parseInt((countTimer % 3600) / 60);
        var second = (countTimer % 3600) % 60;

        var mtime = (hour < 10) ? "0" + hour : "" + hour;
        mtime += ":";
        mtime += (minute < 10) ? "0" + minute : "" + minute;
        mtime += ":";
        mtime += (second < 10) ? "0" + second : "" + second;
        return mtime;
    },
    _softphonebar_setStatePadding: function(stateDes) {
        $("#softphone_phonestate").css('padding-left', 16 / (stateDes.length));
    },
    _softphonebar_updPeerState: function() {
        var stateDes = holly.phone.phone_data.phonebarConfig[holly.phone.phone_data.busyType];
        holly.softphonebar._softphonebar_callstateref.html(stateDes);
        holly.softphonebar._softphonebar_setStatePadding(stateDes);
        var html = "";
        holly.softphonebar._softphonebar_otherstateref.find("li").remove();
        for (var i in holly.phone.phone_data.phonebarConfig) {
            if (i != "99" && i != holly.phone.phone_data.busyType) {
                var isBusy = true;
                var color = "#B30000";
                if (i == "0") {
                    isBusy = false;
                    color = "#468847";
                }
                html += "<div class='customer_div' style=\"color:" + color + ";font-weight:bold;\" onclick=\"holly.phone.phone_setBusy(" + isBusy + ", " + i + ")\">" + holly.phone.phone_data.phonebarConfig[i] + "</div><div class='customer_line'></div>";
            }
        }
        holly.softphonebar._softphonebar_otherstateref.html(html);
        //        $('#softphone-bar .customer_db .customer_line').last().remove();
    },
    softphonebar_dialout: function(phoneNum, interfaceData) {
        if (holly.phone.phone_isAllowDialout()) {
            holly.phone.phone_dialout(phoneNum, interfaceData);
        } else {
            holly.utils.showError("您已经在通话中,不能再次进行外呼", 'softphone_transfer');
            return true;
        }
        if (hollyglobal.isHiddenNumber) {
            phoneNum = holly.softphonebar.softphonebar_getHiddenNum(phoneNum);
        }
        $("#dialout_input").val(phoneNum);
    },

    softphonebar_getHiddenNum: function(phoneNum) {
        var mask = '';
        if (phoneNum > 5) {
            mask = '****';
        } else if (phoneNum < 4) {
            mask = '*';
        } else {
            mask = '***';
        }
        return phoneNum.substring(0, phoneNum.length - 6) + mask + phoneNum.substring(phoneNum.length - 2);
    },

    softphonebar_hangup: function() {
        holly.phone.phone_hangup();
    },

    _softphonebar_updCallState: function(state) {
        holly.softphonebar._softphonebar_callstateref.html(holly.softphonebar._softphonebar_desc[state]);
    },

    _softphonebar_systemBusy: function() {
        var autoBusyTime = holly.phone.phone_data.autoBusyTime;
        if (autoBusyTime < 1)
            return;
        holly.softphonebar._softphonebar_callstateref.html(holly.phone.phone_data.phonebarConfig["99"]);
        if (holly.softphonebar._softphonebar_calculagraph != null) {
            window.clearInterval(holly.softphonebar._softphonebar_calculagraph);
        }
        holly.softphonebar._softphonebar_calculagraph = window.setInterval(function() {
            autoBusyTime--;
            holly.softphonebar._softphonebar_autoBusyTime(autoBusyTime);
        }, 1000);
    },

    _softphonebar_autoBusyTime: function(autoBusyTime) {
        var minute = "0";
        var second = "0";
        var hour = "0";
        if (autoBusyTime >= 60 * 60) {
            hour = parseInt(autoBusyTime / (60 * 60));
            minute = parseInt((autoBusyTime - hour * (60 * 60)) / (60));
            second = autoBusyTime - hour * (60 * 60) - minute * (60);
        } else if (autoBusyTime >= 60 && (autoBusyTime < 60 * 60)) {
            hour = "0";
            minute = parseInt(autoBusyTime / 60);
            second = autoBusyTime - minute * 60;
        } else if (0 < autoBusyTime < 60) {
            hour = "0";
            minute = "0";
            second = autoBusyTime;
        } else if (autoBusyTime <= 0) {
            hour = "0";
            minute = "0";
            second = "0";
        }
        if (hour < 0) {
            hour = 0;
        }
        if (minute < 0) {
            minute = 0;
        }
        if (second < 0) {
            second = 0;
        }
        holly.softphonebar._softphonebar_timestateref.html(((hour < 10) ? ("0" + hour) : hour) + ":" + ((minute < 10) ? ("0" + minute) : minute) + ":" + ((second < 10) ? ("0" + second) : second));
    },


    _softphonebar_showConsult: function(destExten) {
        holly.softphonebar._softphonebar_dialogBoxRemain = 40000;
        holly.softphonebar.softphonebar_count = 1;
        var bodyMsg = "<div style='height:20px;overflow:hidden;text-align:center'><img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/loading.gif' style='float:left;' />" +
            "<div id='holly.softphonebar.showMsg.id' style='float:left;color:#666666;padding-left:5px;'></div></div>";
        var bodyHtml = "<div class='modal-body' style='height:20px;padding-top:9px;' ><div style='float: left;position: relative;width: 325px;'>" + bodyMsg + "</div>" +
            "</div>";
        $('#softphone_consult').empty();
        $('#softphone_consult').html(bodyHtml);
        holly.softphonebar._softphonebar_notifyDialogInterval = setInterval(function() {
            holly.softphonebar._softphonebar_checkLoadingHide(destExten, "");
        }, 1000);
    },
    _softphonebar_showTranster: function(destExten) {
        holly.softphonebar._softphonebar_dialogBoxRemain = 40000;
        holly.softphonebar.softphonebar_count = 1;
        var bodyMsg = "<div style='height:20px;overflow:hidden;text-align:center'><img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/loading.gif' style='float:left;' />" +
            "<div id='holly.softphonebar.showMsg.id' style='float:left;color:#666666;padding-left:5px;'></div></div>";
        var bodyHtml = "<div class='modal-body' style='height:20px;padding-top:9px;' >" + bodyMsg + "</div>";
        $('#softphone_transfer').empty();
        $('#softphone_transfer').html(bodyHtml);
        holly.softphonebar._softphonebar_notifyDialogInterval = setInterval(function() {
            var cancelHtml = "<a href=\"javascript:holly.phone.phone_cancelTransfer();\" style='margin-left:5px;cursor:pointer;font-weight:bold;color:red;text-decoration:underline;'>取消</a>";
            holly.softphonebar._softphonebar_checkLoadingHide(destExten, cancelHtml);
        }, 1000);
    },
    _softphonebar_checkLoadingHide: function(destExten, cancelHtml) {
        var count = holly.softphonebar.softphonebar_count++;
        var html = "正在等待<span style='color:#3fb23f;font-weight:bold'>" + destExten + "</span>接听，" + "请稍后<span style='font-weight:bold'>(00:" + (count < 10 ? ("0" + count) : count) + ")</span>" + cancelHtml;
        if (document.getElementById("holly.softphonebar.showMsg.id")) {
            document.getElementById("holly.softphonebar.showMsg.id").innerHTML = html;
        }
        if (holly.softphonebar._softphonebar_dialogBoxRemain <= 0) {
            holly.softphonebar.softphonebar_close();
        }
        holly.softphonebar._softphonebar_dialogBoxRemain -= 1000;
    },


    _softphonebar_showToMenu: function(displayname) {
        holly.softphonebar._softphonebar_dialogBoxRemain = 40000;
        holly.softphonebar.softphonebar_count = 1;
        var bodyMsg = "<div style='height:20px;overflow:hidden;text-align:center'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/loading.gif' style='float:left;margin-top:5px;' />" +
            "<div id='holly.softphonebar.showMsg.id' style='float:left;color:#666666;padding-left:5px;'></div>" +
            "<div style='clear:both;height:1px;overflow:hidden'>&nbsp;</div></div>";
        holly.utils.showBox(310, 40, bodyMsg);
        holly.softphonebar._softphonebar_notifyDialogInterval = setInterval(function() {
            holly.softphonebar._softphonebar_checkMenuLoadingHide(displayname, "");
        }, 1000);
    },

    _softphonebar_checkMenuLoadingHide: function(destExten, cancelHtml) {
        var count = holly.softphonebar.softphonebar_count++;
        var html = "正在等待转<span style='color:#3fb23f;font-weight:bold'>" + destExten + "</span>，" + "请稍后<span style='font-weight:bold'>(00:" + (count < 10 ? ("0" + count) : count) + ")</span>" + cancelHtml;
        document.getElementById("holly.softphonebar.showMsg.id").innerHTML = html;
        if (holly.softphonebar._softphonebar_dialogBoxRemain <= 0) {
            holly.softphonebar.softphonebar_close();
        }
        holly.softphonebar._softphonebar_dialogBoxRemain -= 1000;
    },

    softphonebar_close: function() {
        if (holly.softphonebar._softphonebar_notifyDialogInterval)
            clearInterval(holly.softphonebar._softphonebar_notifyDialogInterval);
    },

    softphonebar_consult: function(phoneNum) {
        if (/^\d+$/.test(phoneNum)) {
            holly.phone.phone_consult("9" + phoneNum, "number");
        } else {
            alert('请输入工号或者手机号');
        }
    },
    softphonebar_closeModel: function() {
        if ($('#softphone_consult'))
            $('#softphone_consult').modal('hide');
        if ($('#softphone_transfer'))
            $('#softphone_transfer').modal('hide');
        if ($('#softphone_ivrMenu'))
            $('#softphone_ivrMenu').modal('hide');
    },

    softphonebar_transfer: function(phoneNum) {
        if (/^\d+$/.test(phoneNum)) {
            holly.phone.phone_transfer("9" + phoneNum, "number");
        } else {
            alert('请输入工号或者手机号');
        }
    },
    _softphonebar_transfering: function(event, json) {
        if (json.Event === "TransferSuccess") {
            holly.softphonebar.softphonebar_close();
            if (json.Type === "Investigate") {
                holly.utils.showSucc("转调查成功", "softphone_transfer");
            } else {
                if (json.Loot) {
                    holly.utils.showTransferOrConsultSucc("抢接成功", "softphone_transfer");
                } else {
                    holly.phone._phone_currentState = holly.phone._phone_peerstate;
                    holly.phone.phone_publishEvent("toolbarupdate", [holly.phone._phone_stateDescription[holly.phone._phone_peerstate], ""]);
                    holly.utils.showTransferOrConsultSucc("转接成功", "softphone_transfer");
                }
            }
        } else if (json.Event === "TransferFailed") {
            holly.softphonebar.softphonebar_close();
            if (json.Type === "Investigate") {
                holly.utils.showTransferOrConsultError("转调查失败", "softphone_transfer");
            } else {
                if (json.Loot) {
                    holly.utils.showTransferOrConsultError("抢接失败", "softphone_transfer");
                } else {
                    holly.utils.showTransferOrConsultError("转接失败", "softphone_transfer");
                }
            }
        }
    },

    _softphonebar_ivrMenuTransfering: function(event, json) {
        if (json.Event === "IvrMenuEnd") {
            holly.softphonebar.softphonebar_close();
            if (json.VAL_OF_IVR_MENU) {
                var outIvrRefused = json.VAL_OF_IVR_MENU;
                if (outIvrRefused === "DTSF") {
                    outIvrRefused = "转第三方系统失败！";
                    holly.utils.showError(outIvrRefused, 'softphone_transfer');
                } else {}
            }
        }
    },
    _softphonebar_onServiceNoChanged: function(event, monitorServiceNo) {
        if (!holly.phone.phone_data.monitor || !monitorServiceNo || !monitorServiceNo.serviceNo)
            return;
        var curRow = $("#monitor_serviceNo_" + monitorServiceNo.serviceNo);
        if (curRow.html() == null) {
            holly.softphonebar._softphonebar_createRow(monitorServiceNo, 'serviceNo');
        } else {
            holly.softphonebar._softphonebar_updateRow(monitorServiceNo, curRow, 'serviceNo')
        }
        holly.softphonebar._softphonebar_monitoringOnServiceNoChanged(monitorServiceNo);
    },
    _softphonebar_onQueueChanged: function(event, monitorQueue, type) {
        if (!monitorQueue || !monitorQueue.queueId)
            return;
        var curRow = $("#monitor_queue_" + monitorQueue.queueId);
        if (curRow.html() == null) {
            holly.softphonebar._softphonebar_createRow(monitorQueue, 'queueId');
        } else {
            holly.softphonebar._softphonebar_updateRow(monitorQueue, curRow, 'queueId')
        }
        //        if(type == "needWaitCount") {
        //            if(holly.phone.phone_queues) {
        //                var totalQueueWait = 0;
        //                var pbx;
        //                for(var j in holly.phone.phone_queues) {
        //                    var item = holly.phone.phone_queues[j];
        //                    totalQueueWait = totalQueueWait + item.queueWaitCount;
        //                    pbx = item.pbx;
        //                }
        //                $("#monitor_waitCountTotal_" + pbx.replace(holly.softphonebar._softphoneBar_replaceAll, "_")).html(totalQueueWait);
        //            }
        //        }
        holly.softphonebar._softphonebar_queue(monitorQueue);
    },
    _softphonebar_onPeerChanged: function(event, monitorPeer) {
        if (!monitorPeer || !monitorPeer.userId)
            return;
        if (monitorPeer.user.indexOf("admin") != -1)
            return;
        if (!holly.phone.phone_data.monitor) {
            if (monitorPeer.userId != holly.session.user._id) {
                if (jQuery.inArray(monitorPeer.userId, holly.session.user.childs) == -1) {
                    return;
                }
            }
        }
        var curRow = $("#monitor_peer_" + monitorPeer.userId);
        if (curRow.html() == null) {
            holly.softphonebar._softphonebar_createRow(monitorPeer, 'userId');
        } else {
            holly.softphonebar._softphonebar_updateRow(monitorPeer, curRow, 'userId')
        }
        //        holly.softphonebar._softphonebar_info(monitorPeer);
    },
    _softphonebar_isCalling: function(userId) {
        var peer = holly.phone.phone_peers[userId];
        if (peer) {
            if (peer.callStatus == 'Ring' || peer.callStatus == 'Ringing' || peer.callStatus == 'inner' || peer.callStatus == 'normal' || peer.callStatus == 'dialout' || peer.callStatus == 'dialTransfer' || peer.callStatus == 'transfer' || peer.callStatus == 'listen') {
                return true;
            }
        }
        return false;
    },
    _softphonebar_info: function(obj) {
        //        var userId = obj.userId;
        //        if(userId != holly.session.user._id)
        //            return;
        //        var status = obj.status;
        //        var inComplete = obj.InComplete;
        //        var inCalls = obj.InCalls;
        //        var outComplete = obj.OutComplete;
        //var TransferComplete = obj.TransferComplete
        //        var outCalls = obj.OutCalls;
        //        var dialoutTimeLength = holly.softphonebar._softphonebar_getDialoutTime(obj.DialoutTimeLength);

    },
    _softphonebar_getDialoutTime: function(dialoutLength) {
        var time = Math.ceil(dialoutLength / 1000);
        return holly.softphonebar._softphonebar_getTimer(time - 1);
    },
    _softphonebar_onEndListen: function(event) {
        for (var id in holly.phone.phone_peers) {
            if (holly.softphonebar._softphonebar_isCalling(id)) {
                $("#" + id + "_listen_disable").css("display", "none");
                $("#" + id + "_listen").css("display", "");
                $("#" + id + "_loot_disable").css("display", "none");
                $("#" + id + "_loot").css("display", "");
            } else {
                $("#" + id + "_listen_disable").css("display", "");
                $("#" + id + "_listen").css("display", "none");
                $("#" + id + "_loot_disable").css("display", "");
                $("#" + id + "_loot").css("display", "none");
            }
            $("#" + id + "_endlisten").css("display", "none");
        }
    },
    _softphonebar_monitoringInit: function() {
        for (var i in holly.phone.phone_pbxs) {
            var pbxid = i.replace(holly.softphonebar._softphoneBar_replaceAll, "_");
            holly.softphonebar._softphonebar_initInCallChart(pbxid);
            holly.softphonebar._softphonebar_initOutCallChart(pbxid);
        }
        if (holly.phone.phone_accountCalls) {
            for (var i in holly.phone.phone_accountCalls) {
                var accountCall = holly.phone.phone_accountCalls[i];
                if (accountCall) {
                    var curPbxId = i.replace(holly.softphonebar._softphoneBar_replaceAll, "_");
                    holly.softphonebar._softphonebar_toDrawingTodayPandectChart(accountCall.inCalls, accountCall.inComplete, accountCall.outCalls, accountCall.outComplete, curPbxId);
                    holly.softphonebar._softphonebar_toDrawingInCallChart(accountCall.inCalls, accountCall.inCallsPerHour, accountCall.inCompletePerHour, curPbxId);
                    holly.softphonebar._softphonebar_toShowInCallChart(curPbxId);
                    holly.softphonebar._softphonebar_toDrawingOutCallChart(accountCall.outCalls, accountCall.outCallsPerHour, accountCall.outCompletePerHour, curPbxId);
                    holly.softphonebar._softphonebar_toShowOutCallChart(curPbxId);
                }
            }
        }
        if (holly.phone.phone_serviceNos) {
            for (var i in holly.phone.phone_serviceNos) {
                var monitorServiceNo = holly.phone.phone_serviceNos[i];
                holly.softphonebar._softphonebar_toDrawingServiceNumberChart(monitorServiceNo.serviceNo, monitorServiceNo.inCalls, monitorServiceNo.inLost, monitorServiceNo.inComplete, (monitorServiceNo.pbx).replace(_softphoneBar_replaceAll, "_"));
            }
        }
    },
    _softphonebar_initOutCallChart: function(curPbx) {
        var ic = $("#" + curPbx + "_TwentyFourHourOutChart");
        var icArea = $("#" + curPbx + "_TwentyFourHourOutCallChartArea");
        for (var i = 0; i < 25; i++) {
            if (i === 24) {
                var timerow = document.createElement("div");
                timerow.id = curPbx + "_outCalltimerow_" + i;
                timerow.setAttribute("class", "callnum");
                timerow.style.left = (26 * i) + "px";
                timerow.style.width = "50px";
                timerow.style.position = "absolute";
                timerow.style.top = "205px";
                timerow.innerHTML = "时间/时";
                ic.append(timerow);
            } else {
                var sumrow = document.createElement("div");
                sumrow.id = curPbx + "_outCallsumrow_" + i;
                sumrow.setAttribute("class", "call");
                sumrow.setAttribute("call", 0);
                sumrow.setAttribute("showTip", true);
                sumrow.style.left = 26 * i + "px";
                sumrow.style.height = 0 + "px";
                sumrow.style.width = "10px";
                sumrow.style.border = "solid 0px #1280ef";
                sumrow.style.position = "absolute";
                sumrow.style.overflow = "hidden";
                sumrow.style.background = "none repeat scroll 0 0 #1280ef";
                sumrow.style.display = "block";
                sumrow.style.top = 200 + "px";
                sumrow.style.zIndex = "1";
                icArea.append(sumrow);

                var timerow = document.createElement("div");
                timerow.id = curPbx + "_outCalltimerow_" + i;
                timerow.setAttribute("class", "callnum");
                timerow.style.left = (26 * i) + 3 + "px";
                timerow.style.width = "10px";
                timerow.style.position = "absolute";
                timerow.style.top = "205px";
                timerow.style.textAlign = "center";
                timerow.innerHTML = i;
                ic.append(timerow);

                var cptrow = document.createElement("div");
                cptrow.id = curPbx + "_outCallcptrow_" + i;
                cptrow.setAttribute("class", "outcallchartcptrow");
                cptrow.setAttribute("call", 0);
                cptrow.setAttribute("showTip", true);
                cptrow.style.width = "10px";
                cptrow.style.height = 0 + "px";
                cptrow.style.border = "solid 0px #f8c713";
                cptrow.style.position = "absolute";
                cptrow.style.overflow = "hidden";
                cptrow.style.background = "none repeat scroll 0 0 #f8c713";
                cptrow.style.left = 10 + 26 * i + "px";
                cptrow.style.display = "block";
                cptrow.style.top = 200 + "px";
                cptrow.style.zIndex = "1";
                icArea.append(cptrow);
            }
        }

        for (var i = 0; i < 6; i++) {
            if (i === 0) {
                var tity = document.createElement("div");
                tity.id = curPbx + "_outCalltity_" + i;
                tity.setAttribute("class", "tity");
                tity.style.width = "50px";
                tity.style.position = "absolute";
                tity.style.top = (36 * i) - 5 + "px";
                tity.style.left = "-40px";
                tity.innerHTML = "数量/个";
                ic.append(tity);
            } else {
                var tity = document.createElement("div");
                tity.id = curPbx + "_outCalltity_" + i;
                tity.setAttribute("class", "tity");
                tity.style.width = "35px";
                tity.style.position = "absolute";
                tity.style.top = (36 * i) - 21 + "px";
                tity.style.left = "-18px";
                tity.innerHTML = 6 - i;
                ic.append(tity);

                var liney = document.createElement("div");
                liney.id = curPbx + "_outCallliney_" + i;
                liney.setAttribute("class", "liney");
                liney.style.width = "620px";
                liney.style.position = "absolute";
                liney.style.borderTop = "1px dotted #B9B9B9";
                liney.style.height = "1px";
                liney.style.overflow = "hidden";
                liney.style.top = (36 * i) - 16 + "px";
                liney.style.left = "0px";
                icArea.append(liney);
            }
        }
    },
    _softphonebar_initInCallChart: function(curPbx) {
        var ic = $("#" + curPbx + "_TwentyFourHourInChart");
        var icArea = $("#" + curPbx + "_TwentyFourHourInCallChartArea");
        for (var i = 0; i < 25; i++) {
            if (i === 24) {
                var timerow = document.createElement("div");
                timerow.id = curPbx + "_inCalltimerow_" + i;
                timerow.setAttribute("class", "callnum");
                timerow.style.left = (26 * i) + "px";
                timerow.style.width = "50px";
                timerow.style.position = "absolute";
                timerow.style.top = "205px";
                timerow.innerHTML = "时间/时";
                ic.append(timerow);
            } else {
                var sumrow = document.createElement("div");
                sumrow.id = curPbx + "_inCallsumrow_" + i;
                sumrow.setAttribute("class", "incallchartsumrow");
                sumrow.setAttribute("call", 0);
                sumrow.setAttribute("showTip", true);
                sumrow.style.left = (26 * i) + "px";
                sumrow.style.height = 0 + "px";
                sumrow.style.width = "10px";
                sumrow.style.border = "solid 0px #1280ef";
                sumrow.style.position = "absolute";
                sumrow.style.overflow = "hidden";
                sumrow.style.background = "none repeat scroll 0 0 #1280ef";
                sumrow.style.display = "block";
                sumrow.style.top = 200 + "px";
                sumrow.style.zIndex = "1";
                icArea.append(sumrow);

                var timerow = document.createElement("div");
                timerow.id = curPbx + "_inCalltimerow_" + i;
                timerow.setAttribute("class", "callnum");
                timerow.style.left = (26 * i) + 3 + "px";
                timerow.style.width = "10px";
                timerow.style.textAlign = "center";
                timerow.style.position = "absolute";
                timerow.style.top = "205px";
                timerow.innerHTML = i;
                ic.append(timerow);

                var cptrow = document.createElement("div");
                cptrow.id = curPbx + "_inCallcptrow_" + i;
                cptrow.setAttribute("class", "incallchartcptrow");
                cptrow.setAttribute("call", 0);
                cptrow.setAttribute("showTip", true);
                cptrow.style.width = "10px";
                cptrow.style.height = 0 + "px";
                cptrow.style.border = "solid 0px #92be0f";
                cptrow.style.position = "absolute";
                cptrow.style.overflow = "hidden";
                cptrow.style.background = "none repeat scroll 0 0 #92be0f";
                cptrow.style.left = (26 * i) + 10 + "px";
                cptrow.style.display = "block";
                cptrow.style.top = 200 + "px";
                cptrow.style.zIndex = "1";
                icArea.append(cptrow);
            }
        }

        for (var i = 0; i < 6; i++) {
            if (i === 0) {
                var tity = document.createElement("div");
                tity.id = curPbx + "_inCalltity_" + i;
                tity.setAttribute("class", "tity");
                tity.style.width = "50px";
                tity.style.position = "absolute";
                tity.style.top = (36 * i) - 5 + "px";
                tity.style.left = "-40px";
                tity.innerHTML = "数量/个";
                ic.append(tity);
            } else {
                var tity = document.createElement("div");
                tity.id = curPbx + "_inCalltity_" + i;
                tity.setAttribute("class", "tity");
                tity.style.width = "35px";
                tity.style.position = "absolute";
                tity.style.top = (36 * i) - 21 + "px";
                tity.style.left = "-18px";
                tity.style.right = "30px";
                tity.innerHTML = 6 - i;
                ic.append(tity);

                var liney = document.createElement("div");
                liney.id = curPbx + "_inCallliney_" + i;
                liney.style.width = "620px";
                liney.style.position = "absolute";
                liney.style.borderTop = "1px dotted #B9B9B9";
                liney.style.height = "1px";
                liney.style.overflow = "hidden";
                liney.style.top = (36 * i) - 16 + "px";
                liney.style.left = "0px";
                icArea.append(liney);
            }
        }
    },
    _softphonebar_toDrawingTodayPandectChart: function(inCalls, inComplete, outCalls, outComplete, curPbx) {
        $("#" + curPbx + "_today_call_sum").html("今日呼叫总量：" + (inCalls + outCalls));
        $("#" + curPbx + "_today_call_in_sum").html("呼入总量：" + inCalls);
        $("#" + curPbx + "_today_call_out_sum").html("呼出总量：" + outCalls);
        if (inCalls == 0) {
            $("#" + curPbx + "_todayChartInCallBox").html('<div class="callNullStyle" >呼入数据为空</div>');
        } else {
            var sinCallCpt, sinCallLst, inCallCpt, inCallLst;
            var perInComplete = Math.round((inComplete / inCalls) * 100);
            if (perInComplete < 15) {
                sinCallCpt = 15;
                sinCallLst = 85;
            } else if (perInComplete > 85) {
                sinCallCpt = 85;
                sinCallLst = 15;
            } else {
                sinCallCpt = perInComplete;
                sinCallLst = 100 - perInComplete;
            }
            inCallCpt = perInComplete.toString();
            inCallLst = (100 - perInComplete).toString();
            $("#" + curPbx + "_todayChartInCallBox").html('<div id="' + curPbx + '_today_call_in_success" class="todayCallInSuccess" style="width:' + sinCallCpt + '%;" >' + inComplete + '(' + inCallCpt + '%)' + '</div><div id="' + curPbx + '_today_call_in_failure" style="width:' + sinCallLst + '%;" class="todayCallInFailure" >' + (inCalls - inComplete) + '(' + inCallLst + '%)' + '</div>');
        }
        if (outCalls == 0) {
            $("#" + curPbx + "_todayChartOutCallBox").html('<div class="callNullStyle" >呼出数据为空</div>');
        } else {
            var soutCallCpt, soutCallLst, outCallCpt, outCallLst;
            var perOutComplete = Math.round((outComplete / outCalls) * 100);
            if (perOutComplete < 15) {
                soutCallCpt = 15;
                soutCallLst = 85;
            } else if (perOutComplete > 85) {
                soutCallCpt = 85;
                soutCallLst = 15;
            } else {
                soutCallCpt = perOutComplete;
                soutCallLst = 100 - perOutComplete;
            }
            outCallCpt = perOutComplete.toString();
            outCallLst = (100 - perOutComplete).toString();
            $("#" + curPbx + "_todayChartOutCallBox").html('<div id="' + curPbx + '_today_call_out_success" class="todayCallOutSuccess" style="width:' + soutCallCpt + '%;" >' + outComplete + '(' + outCallCpt + '%)' + '</div><div id="' + curPbx + '_today_call_out_failure" style="width:' + soutCallLst + '%;" class="todayCallOutFailure">' + (outCalls - outComplete) + '(' + outCallLst + '%)' + '</div>');
        }
    },

    _softphonebar_onAccountCalls: function(event, accountCall) {
        var curPbxId = (accountCall.pbx).replace(holly.softphonebar._softphoneBar_replaceAll, "_");
        holly.softphonebar._softphonebar_toDrawingTodayPandectChart(accountCall.inCalls, accountCall.inComplete, accountCall.outCalls, accountCall.outComplete, curPbxId);
        if ($("#" + curPbxId + "_TwentyFourHourInChart").html() == null) {
            return;
        }
        holly.softphonebar._softphonebar_toDrawingInCallChart(accountCall.inCalls, accountCall.inCallsPerHour, accountCall.inCompletePerHour, curPbxId);
        holly.softphonebar._softphonebar_toShowInCallChart(curPbxId);
        if ($("#" + curPbxId + "_TwentyFourHourOutChart").html() == null) {
            return;
        }
        holly.softphonebar._softphonebar_toDrawingOutCallChart(accountCall.outCalls, accountCall.outCallsPerHour, accountCall.outCompletePerHour, curPbxId);
        holly.softphonebar._softphonebar_toShowOutCallChart(curPbxId);
    },

    _softphonebar_toDrawingServiceNumberChart: function(serviceNo, inCalls, inLost, inComplete, curPbx) {
        var sn = $("#" + curPbx + "_ServiceNumberChart");
        if (serviceNo != undefined) {
            var snChart = document.createElement("div");
            if (inCalls == 0) {
                snChart.id = curPbx + "_snChart" + serviceNo;
                snChart.setAttribute("class", "snChartItem");
                snChart.style.background = "none repeat scroll 0 0 #ffffff";
                snChart.innerHTML = '<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" style="text-align:center; border:dashed 1px #ccc; background-color:#f2f6fb;" > 呼入数量为空  </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>';
                sn.append(snChart);
            } else if (inCalls == inComplete) {
                snChart.id = curPbx + "_snChart" + serviceNo;
                snChart.setAttribute("class", "snChartItem");
                snChart.style.background = "none repeat scroll 0 0 #ffffff";
                snChart.innerHTML = '<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" > <div style="width:100%; "  class="snChartComplete">' + inComplete + " (100%)" + '</div> <div style="display:none; " class="snChartLost"></div> </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>';
                sn.append(snChart);
            } else if (inCalls == inLost) {
                snChart.id = curPbx + "_snChart" + serviceNo;
                snChart.setAttribute("class", "snChartItem");
                snChart.style.background = "none repeat scroll 0 0 #ffffff";
                snChart.innerHTML = '<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" > <div style=" display:none;"  class="snChartComplete"></div> <div style="width:100%; " class="snChartLost">' + inLost + " (100%)" + '</div> </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>';
                sn.append(snChart);
            } else {
                var sinCallCpt, sinCallLst, inCallCpt, inCallLst;
                var perInComplete = Math.round((inComplete / inCalls) * 100);
                if (perInComplete < 15) {
                    sinCallCpt = 15;
                    sinCallLst = 85;
                } else if (perInComplete > 85) {
                    sinCallCpt = 85;
                    sinCallLst = 15;
                } else {
                    sinCallCpt = perInComplete;
                    sinCallLst = 100 - perInComplete;
                }
                inCallCpt = perInComplete.toString();
                inCallLst = (100 - perInComplete).toString();

                snChart.id = curPbx + "_snChart" + serviceNo;
                snChart.setAttribute("class", "snChartItem");
                snChart.style.background = "none repeat scroll 0 0 #ffffff";
                snChart.innerHTML = '<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" > <div style="width:' + sinCallCpt + '%; "  class="snChartComplete">' + inComplete + " (" + inCallCpt + "%)" + '</div> <div style="width:' + sinCallLst + '%; " class="snChartLost">' + inLost + " (" + inCallLst + "%)" + '</div> </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>';
                sn.append(snChart);
            }
        }
    },

    _softphonebar_monitoringOnServiceNoChanged: function(serviceNos) {
        var serviceNo = serviceNos.serviceNo;
        var inCalls = serviceNos.inCalls;
        var inComplete = serviceNos.inComplete;
        var inLost = serviceNos.inLost;
        var outCalls = serviceNos.outCalls;
        var outComplete = serviceNos.outComplete;

        var pbxId = (serviceNos.pbx).replace(holly.softphonebar._softphoneBar_replaceAll, "_");
        var updateBox = $("#" + pbxId + "_snChart" + serviceNo);
        if (updateBox.html() == null) {
            holly.softphonebar._softphonebar_toDrawingServiceNumberChart(serviceNo, inCalls, inLost, inComplete, pbxId);
            return;
        }
        if (inCalls == 0) {
            updateBox.css("background", "none repeat scroll 0 0 #ffffff");
            updateBox.html('<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" style="text-align:center; border:dashed 1px #ccc; background-color:#f2f6fb;" > 呼入数量为空  </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>');
        } else {
            var sinCallCpt, sinCallLst, inCallCpt, inCallLst;
            var perInComplete = Math.round((inComplete / inCalls) * 100);
            if (perInComplete < 15) {
                sinCallCpt = 15;
                sinCallLst = 85;
            } else if (perInComplete > 85) {
                sinCallCpt = 85;
                sinCallLst = 15;
            } else {
                sinCallCpt = perInComplete;
                sinCallLst = 100 - perInComplete;
            }
            inCallCpt = perInComplete.toString();
            inCallLst = (100 - perInComplete).toString();
            updateBox.html('<div class="snChartNumber">服务号：' + serviceNo + '</div> <div class="snChartDiagram" > <div style="width:' + sinCallCpt + '%; "  class="snChartComplete">' + inComplete + " (" + inCallCpt + "%)" + '</div> <div style="width:' + sinCallLst + '%; " class="snChartLost">' + inLost + " (" + inCallLst + "%)" + '</div> </div> <div class="snChartSum"> 总计：' + inCalls + '</div> <div class="clear"></div>');
        }
    },

    _softphonebar_toDrawingInCallChart: function(inCalls, inCallsPerHour, inCompletePerHour, curPbx) {
        if (inCalls != 0) {
            var inCallSumArray, inCallCptArray = [];
            inCallSumArray = inCallsPerHour.split(",");
            inCallCptArray = inCompletePerHour.split(",");
            var inCallMax = 0;
            for (var i = 0; i < 24; i++) {
                inCallMax = Math.max(inCallMax, inCallSumArray[i]);
            }
            var b = inCallMax % 5;
            var mainLength = inCallMax - b + 5;
            var offsetCall = mainLength / 5;
            var topOffsetPercent = 180 / mainLength;
            for (var i = 0; i < 24; i++) {
                var sumrow = document.getElementById(curPbx + "_inCallsumrow_" + i);
                sumrow.setAttribute("call", inCallSumArray[i]);
                sumrow.style.height = Math.round(topOffsetPercent * inCallSumArray[i]) + "px";
                sumrow.style.top = 200 - Math.round(topOffsetPercent * inCallSumArray[i]) + "px";

                var cptrow = document.getElementById(curPbx + "_inCallcptrow_" + i);
                cptrow.setAttribute("call", inCallCptArray[i]);
                cptrow.style.height = Math.round(topOffsetPercent * inCallCptArray[i]) + "px";
                cptrow.style.top = 200 - Math.round(topOffsetPercent * inCallCptArray[i]) + "px";
            }
            for (var i = 1; i < 6; i++) {
                var tity = document.getElementById(curPbx + "_inCalltity_" + i);
                var temp = offsetCall * (6 - i);
                tity.innerHTML = temp;
            }
        }
    },

    _softphonebar_toShowInCallChart: function(curPbx) {
        var incalls = $("#" + curPbx + "_TwentyFourHourInCallChartArea div");
        incalls.each(function(i, incall) {
            if (!incall.getAttribute("showTip"))
                return;

            incall.onmouseover = function() {
                var temp = this.id.split("_");
                var hour = temp[temp.length - 1];
                var type = temp[temp.length - 2];
                var pbx = this.id.substr(0, this.id.indexOf(type) - 1);

                var times = this.getAttribute("call");
                var tipMessage = "";
                if (type == "inCallsumrow") {
                    tipMessage = "今日" + hour + "时呼入" + times;
                } else if (type == "inCallcptrow") {
                    tipMessage = "今日" + hour + "时已接" + times;
                }
                var liney = document.getElementById(pbx + "_inCallMouseTip");
                if (!liney) {
                    liney = document.createElement("div");
                    liney.id = pbx + "_inCallMouseTip";

                    liney.style.position = "absolute";
                    liney.style.border = "1px dotted #FFFF99";

                    liney.style.padding = "3px";

                    liney.style.overflow = "hidden";
                    liney.style.background = "none repeat scroll 0 0 #f8c713";
                    liney.style.textAlign = "center";
                    liney.style.zIndex = "2";
                    var area = $("#" + pbx + "_TwentyFourHourInChart");
                    area.append(liney);
                }
                liney.innerHTML = tipMessage;
                liney.style.top = $(this).position().top + "px";
                liney.style.left = $(this).position().left + 5 + "px";
                liney.style.visibility = "visible";

                var timeText = document.getElementById(pbx + "_inCalltimerow_" + hour);
                if (timeText) {
                    timeText.style.background = "none repeat scroll 0 0 #f8c713";
                }
            };
            incall.onmouseout = function() {
                var temp = this.id.split("_");
                var type = temp[temp.length - 2];
                var hour = temp[temp.length - 1];
                var pbx = this.id.substr(0, this.id.indexOf(type) - 1);
                var liney = document.getElementById(pbx + "_inCallMouseTip");
                if (liney) {
                    liney.style.visibility = "hidden";
                }
                var timeText = document.getElementById(pbx + "_inCalltimerow_" + hour);
                if (timeText) {
                    timeText.style.background = "";
                }
            };
        });
    },

    _softphonebar_toDrawingOutCallChart: function(outCalls, outCallsPerHour, outCompletePerHour, curPbx) {
        if (outCalls != 0) {
            var outCallSumArray, outCallCptArray = [];
            outCallSumArray = outCallsPerHour.split(",");
            outCallCptArray = outCompletePerHour.split(",");
            var outCallMax = 0;
            for (var i = 0; i < 24; i++) {
                outCallMax = Math.max(outCallMax, outCallSumArray[i]);
            }
            var b = outCallMax % 5;
            var mainLength = outCallMax - b + 5;
            var offsetCall = mainLength / 5;
            var topOffsetPercent = 180 / mainLength;

            for (var i = 0; i < 24; i++) {
                var sumrow = document.getElementById(curPbx + "_outCallsumrow_" + i);
                sumrow.setAttribute("call", outCallSumArray[i]);
                sumrow.style.height = Math.round(topOffsetPercent * outCallSumArray[i]) + "px";
                sumrow.style.top = 200 - Math.round(topOffsetPercent * outCallSumArray[i]) + "px";

                var cptrow = document.getElementById(curPbx + "_outCallcptrow_" + i);
                cptrow.setAttribute("call", outCallCptArray[i]);
                cptrow.style.height = Math.round(topOffsetPercent * outCallCptArray[i]) + "px";
                cptrow.style.top = 200 - Math.round(topOffsetPercent * outCallCptArray[i]) + "px";
            }
            for (var i = 1; i < 6; i++) {
                var tity = document.getElementById(curPbx + "_outCalltity_" + i);
                var temp = offsetCall * (6 - i);
                tity.innerHTML = temp;
            }
        }
    },

    _softphonebar_toShowOutCallChart: function(curPbx) {
        var outcalls = $("#" + curPbx + "_TwentyFourHourOutCallChartArea div");
        outcalls.each(function(i, outcall) {
            if (!outcall.getAttribute("showTip"))
                return;
            outcall.onmouseover = function() {
                var temp = this.id.split("_");
                var hour = temp[temp.length - 1];
                var type = temp[temp.length - 2];
                var pbx = this.id.substr(0, this.id.indexOf(type) - 1);

                var times = this.getAttribute("call");
                var tipMessage = "";

                if (type === "outCallsumrow") {
                    tipMessage = "今日" + hour + "时呼出" + times;

                } else if (type === "outCallcptrow") {
                    tipMessage = "今日" + hour + "时呼通" + times;
                }

                var liney = document.getElementById(pbx + "_outCallMouseTip");
                if (!liney) {
                    liney = document.createElement("div");
                    liney.id = curPbx + "_outCallMouseTip";
                    liney.style.position = "absolute";
                    liney.style.border = "1px dotted #FFFF99";
                    //liney.style.height = "18px";
                    liney.style.padding = "3px";
                    liney.style.overflow = "hidden";
                    liney.style.background = "none repeat scroll 0 0 #f8c713";
                    liney.style.textAlign = "center";
                    liney.style.zIndex = "2";
                    var area = $("#" + pbx + "_TwentyFourHourOutChart");
                    area.append(liney);
                }
                liney.innerHTML = tipMessage;
                liney.style.top = $(this).position().top - 18 + "px";
                liney.style.left = $(this).position().left + 5 + "px";
                liney.style.visibility = "visible";

                var timeText = document.getElementById(pbx + "_outCalltimerow_" + hour);
                if (timeText) {
                    timeText.style.background = "none repeat scroll 0 0 #f8c713";
                }
            };
            outcall.onmouseout = function() {
                var temp = this.id.split("_");
                var type = temp[temp.length - 2];
                var hour = temp[temp.length - 1];
                var pbx = this.id.substr(0, this.id.indexOf(type) - 1);
                var liney = document.getElementById(pbx + "_outCallMouseTip");
                if (liney) {
                    liney.style.visibility = "hidden";
                }
                var timeText = document.getElementById(pbx + "_outCalltimerow_" + hour);
                if (timeText) {
                    timeText.style.background = "";
                }
            };
        });
    },
    softphonebar_getpbxid: function(pbx) {
        if (!pbx) {
            pbx = holly.session.user.sipConfigId;
        }
        return pbx.replace(holly.softphonebar._softphoneBar_replaceAll, "_");
    },
    _softphonebar_queue: function(queue) {
        if (queue.members[holly.phone.phone_data.sipNo] == undefined)
            return;
        var queueName = $("#icc_statistics_queue_" + queue.queueId);
        if (queueName.length > 0) {
            if ($("#icc_statistics_name_" + queue.queueId))
                $("#icc_statistics_name_" + queue.queueId).html(queue.queueName);
            if ($("#icc_statistics_idle_" + queue.queueId))
                $("#icc_statistics_idle_" + queue.queueId).html(queue.idleAgentCount);
            if ($("#icc_statistics_wait_" + queue.queueId))
                $("#icc_statistics_wait_" + queue.queueId).html(queue.queueWaitCount);
        } else {
            var htmls = [];
            htmls.push("<div>技能组名:<span id=\"icc_statistics_name_" + queue.queueId + "\">" + queue.queueName + "</span></div>");
            htmls.push("<div>空闲座席数:<span id=\"icc_statistics_idle_" + queue.queueId + "\">" + queue.idleAgentCount + "</span></div>");
            htmls.push("<div>排队数:<span id=\"icc_statistics_wait_" + queue.queueId + "\">" + queue.queueWaitCount + "</span></div>");
            htmls.push("<div class=\"clear5\"></div>")
            var elementDiv = document.createElement("div");
            elementDiv.id = "icc_statistics_queue_" + queue.queueId;
            elementDiv.innerHTML = htmls.join("");
            $("#user_queue").append(elementDiv);
        }
    },
    monitor_agent: function() {
        var ul = "<ul class=\"nav nav-tabs\" id=\"monitor_ul\">";
        var curpbxid = holly.softphonebar.softphonebar_getpbxid(holly.phone.phone_data.pbx_in_ip);
        ul += "<li class=\"active\"><a href=\"#monitor_" + curpbxid + "\">" + holly.phone.phone_pbxs[holly.phone.phone_data.pbx_in_ip].pbxNick + "</a></li>";
        for (var pbx in holly.phone.phone_pbxs) {
            if (pbx != holly.phone.phone_data.pbx_in_ip) {
                var pbxid = holly.softphonebar.softphonebar_getpbxid(pbx);
                ul += "<li><a href=\"#monitor_" + pbxid + "\" >" + holly.phone.phone_pbxs[pbx].pbxNick + "</a></li>";
            }
        }
        ul += "</ul>";
        var content = "";
        content += "<div class=\"tab-content\">";
        for (var pbx in holly.phone.phone_pbxs) {
            var agentItem = $("#monitor_allpbx").html();
            var pbxid = holly.softphonebar.softphonebar_getpbxid(pbx);
            agentItem = agentItem.replace("monitor_serviceNo", "monitor_serviceNo" + "_" + pbxid);
            agentItem = agentItem.replace("monitor_queue", "monitor_queue" + "_" + pbxid);
            agentItem = agentItem.replace(/monitor_peer/g, "monitor_peer" + "_" + pbxid);
            agentItem = agentItem.replace("monitor_waitCountTotal", "monitor_waitCountTotal" + "_" + pbxid);
            agentItem = agentItem.replace("monitor_countAll", "monitor_countAll" + "_" + pbxid);
            agentItem = agentItem.replace(/__pbxid/g, pbxid);
            agentItem = agentItem.replace("monitor_onlineCount", "monitor_onlineCount" + "_" + pbxid);
            agentItem = agentItem.replace("monitor_idleCount", "monitor_idleCount" + "_" + pbxid);
            if (pbx == holly.phone.phone_data.pbx_in_ip) {
                content += "<div class=\"tab-pane active\" id=\"monitor_" + pbxid + "\">";
            } else {
                content += "<div class=\"tab-pane\" id=\"monitor_" + pbxid + "\">";
            }
            content += agentItem;
            content += "</div>";
        }
        content += "</div>";
        $("#monitor_allpbx").html(ul + content);
        $('#monitor_ul a').click(function(e) {
            e.preventDefault();
            $(this).tab('show');
        })
        $('#monitor_ul a').on('shown', function(e) {
            var value = e.target + "";
            var pbxid = value.substr(value.indexOf("#monitor_") + 9, value.length);
            var pbx = holly.softphonebar._softphonebar_getpbx(pbxid);
            holly.phone.phone_pbxMonitor(pbx);
        })
        holly.softphonebar._softphonebar_monitorInit();
    },
    _softphonebar_getpbx: function(pbxid) {
        return pbxid.replace(holly.softphonebar._softphoneBar_replaceAll_bak, ".");
    },
    _softphonebar_monitorInit: function() {
        holly.softphonebar._softphonebar_peer_index = 0;
        holly.softphonebar._softphonebar_queue_index = 0;
        holly.softphonebar._softphonebar_serviceNo_index = 0;
        if (holly.phone.phone_data.monitor) {
            if (holly.phone.phone_serviceNos) {
                for (var i in holly.phone.phone_serviceNos) {
                    var item = holly.phone.phone_serviceNos[i];
                    if (!item || !item.serviceNo)
                        continue;
                    var curRow = $("#monitor_serviceNo_" + item.serviceNo);
                    if (curRow.html() == null) {
                        holly.softphonebar._softphonebar_createRow(item, 'serviceNo');
                    } else {
                        holly.softphonebar._softphonebar_updateRow(item, curRow, 'serviceNo')
                    }
                }
            }

            if (holly.phone.phone_queues) {
                for (var i in holly.phone.phone_queues) {
                    var item = holly.phone.phone_queues[i];
                    if (!item || !item.queueId)
                        continue;
                    var curRow = $("#monitor_queue_" + item.queueId);
                    if (curRow.html() == null) {
                        holly.softphonebar._softphonebar_createRow(item, 'queueId');
                    } else {
                        holly.softphonebar._softphonebar_updateRow(item, curRow, 'queueId')
                    }
                }
            }

            if (holly.phone.phone_peers) {
                for (var i in holly.phone.phone_peers) {
                    var item = holly.phone.phone_peers[i];
                    if (!item || !item.userId)
                        continue;
                    if (item.user.indexOf("admin") != -1)
                        continue;
                    var curRow = $("#monitor_peer_" + item.userId);
                    if (curRow.html() == null) {
                        holly.softphonebar._softphonebar_createRow(item, 'userId');
                    } else {
                        holly.softphonebar._softphonebar_updateRow(item, curRow, 'userId')
                    }
                }
            }
            holly.softphonebar._softphonebar_setInterval();
            $(".monitor_department").css("display", "block");
            holly.softphonebar._softphonebar_initDept();
        } else {
            if (holly.phone.phone_peers) {
                for (var i in holly.phone.phone_peers) {
                    var item = holly.phone.phone_peers[i];
                    if (!item || !item.userId)
                        continue;
                    if (item.user.indexOf("admin") != -1)
                        continue;
                    if (item.userId != holly.session.user._id) {
                        if (jQuery.inArray(item.userId, holly.session.user.childs) == -1) {
                            continue;
                        }
                    }
                    var curRow = $("#monitor_peer_" + item.userId);
                    if (curRow.html() == null) {
                        holly.softphonebar._softphonebar_createRow(item, 'userId');
                    } else {
                        holly.softphonebar._softphonebar_updateRow(item, curRow, 'userId')
                    }
                }
            }
            holly.softphonebar._softphonebar_setInterval();
            $(".monitor_department").css("display", "none");
            $(".monitor_list_serviceNo").css("display", "none");
            $(".monitor_list_queue").css("display", "none");
        }
        holly.softphonebar._softphonebar_updatePeerNum(holly.phone.phone_data.pbx_in_ip);
    },
    _softphonebar_setInterval: function() {
        if (holly.softphonebar._softphonebar_monitorTimersHandle) {
            window.clearInterval(holly.softphonebar._softphonebar_monitorTimersHandle);
        }
        holly.softphonebar._softphonebar_monitorTimersHandle = window.setInterval("holly.softphonebar._softphonebar_monitorDoCallTimer()", 1000);
    },
    _softphonebar_initDept: function() {
        for (var i in holly.phone.phone_pbxs) {
            var obj = document.getElementById('monitor_department_options' + '_' + holly.softphonebar.softphonebar_getpbxid(i));
            if (obj) {
                obj.options.length = 0;
                obj.options.add(new Option("全部", ""));
                for (var i = 0; i < holly.phone.phone_data.depts.length; i++) {
                    obj.options.add(new Option(holly.phone.phone_data.depts[i].Name, holly.phone.phone_data.depts[i].ID));
                }
            }
        }
    },
    _softphonebar_monitorDoCallTimer: function() {
        if (holly.softphonebar._softphonebar_monitorTimers) {
            for (var i in holly.softphonebar._softphonebar_monitorTimers) {
                var timerTd = $("#" + i + "_timer");
                if (timerTd != null) {
                    timerTd.text(holly.softphonebar._softphonebar_getTimer(holly.softphonebar._softphonebar_monitorTimers[i].count));
                    holly.softphonebar._softphonebar_monitorTimers[i].count++;
                }
            }
        }
    },
    _softphonebar_deptChange: function(pbxId) {
        var obj = document.getElementById('monitor_department_options_' + pbxId);
        if (obj) {
            var index = obj.selectedIndex;
            var deptId = obj[index].value;

            var trs = $("table[id=monitor_peer_" + pbxId + "] > tbody").children("tr");
            for (var i = 0; i < trs.length; i++) {
                var tr = trs[i];
                if (deptId == "") {
                    $(tr).css("display", "");
                } else {
                    var userid = trs[i].id.replace("monitor_peer_", "");
                    var peer = holly.phone.phone_peers[userid];
                    if (peer && peer.department && peer.department == deptId) {
                        $(tr).css("display", "");
                    } else {
                        $(tr).css("display", "none");
                    }
                }
            }
            holly.softphonebar._softphonebar_updatePeerNum(holly.softphonebar._softphonebar_getpbx(pbxId));
        }
    },
    _softphonebar_displayStatus: function(peer) {
        var displayName = '';
        if (peer.login && peer.extenType != 'none') {
            if ((peer.extenType === 'sip' || peer.extenType === 'gateway') && peer.register == false) {
                displayName = holly.softphonebar._softphonebar_desc["unregister"];
            } else if (peer.callStatus === 'Idle') {
                if (peer.busyType === "0")
                    displayName = holly.softphonebar._softphonebar_getColor(holly.phone.phone_data.phonebarConfig[peer.busyType], "0");
                else
                    displayName = holly.softphonebar._softphonebar_getColor(holly.phone.phone_data.phonebarConfig[peer.busyType], "1");
            } else if (peer.callStatus === 'Ring') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialing"], "2");
            } else if (peer.callStatus === 'Ringing') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["belling"], "2");
            } else if (peer.callStatus === 'inner') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["innerTalking"], "2");
            } else if (peer.callStatus === 'normal') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["talking"], "2");
            } else if (peer.callStatus === 'dialout') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialTalking"], "2");
            } else if (peer.callStatus === 'dialTransfer') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialTransfer"], "2");
            } else if (peer.callStatus === 'transfer') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["transfer"], "2");
            } else if (peer.callStatus === 'listen') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["listened"], "2");
            }
        } else if (peer.login && peer.extenType == 'none') {
            displayName = '';
        } else {
            if (peer.callStatus === 'Ring') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialing"], "2");
            } else if (peer.callStatus === 'Ringing') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["belling"], "2");
            } else if (peer.callStatus === 'inner') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["innerTalking"], "2");
            } else if (peer.callStatus === 'normal') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["talking"], "2");
            } else if (peer.callStatus === 'dialout') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialTalking"], "2");
            } else if (peer.callStatus === 'dialTransfer') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["dialTransfer"], "2");
            } else if (peer.callStatus === 'transfer') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["transfer"], "2");
            } else if (peer.callStatus == '=listen') {
                displayName = holly.softphonebar._softphonebar_getColor(holly.softphonebar._softphonebar_desc["listened"], "2");
            } else {
                if (!peer.login && (peer.extenType === 'gateway' || peer.extenType === 'Local')) {
                    displayName = holly.softphonebar._softphonebar_desc["offline"];
                } else {
                    displayName = holly.softphonebar._softphonebar_desc["ready"];
                }
            }
        }
        return displayName;
    },
    _softphonebar_getColor: function(content, type) {
        if (type == "0") {
            return "<span style=\"color: green\">" + content + "</span>";
        } else if (type == "1") {
            return "<span style=\"color: red\">" + content + "</span>";
        } else if (type == "2") {
            return "<span style=\"color: #FF33FF\">" + content + "</span>";
        } else {
            return content;
        }
    },
    _softphonebar_updatePeerNum: function(pbx) {
        var idleNum = 0;
        var totalNum = 0;
        var onlineNum = 0;
        var deptOptions = document.getElementById('monitor_department_options_' + holly.softphonebar.softphonebar_getpbxid(pbx));
        var deptId = "";
        if (deptOptions && deptOptions.selectedIndex && deptOptions.selectedIndex != -1) {
            if (deptOptions[deptOptions.selectedIndex]) {
                deptId = deptOptions[deptOptions.selectedIndex].value;
            }
        }
        for (var i in holly.phone.phone_peers) {
            var item = holly.phone.phone_peers[i];
            if (item.pbx != pbx)
                continue;
            var peerState = holly.softphonebar._softphonebar_displayStatus(item);
            if (item.user != null) {
                if (item.user.indexOf('admin') != -1) {
                    continue;
                }
            }
            if (holly.phone.phone_data.monitor) {
                if (deptId == "" || item.department == deptId) {
                    totalNum++;
                    if (peerState != holly.softphonebar._softphonebar_desc["offline"] && peerState != holly.softphonebar._softphonebar_desc["unregister"] && peerState != holly.softphonebar._softphonebar_desc["ready"]) {
                        onlineNum++;
                        if (peerState.indexOf(holly.softphonebar._softphonebar_desc["peerstate"]) > 0) {
                            idleNum++;
                        }
                    }
                }
            } else {
                if (item.userId != holly.session.user._id) {
                    if (jQuery.inArray(item.userId, holly.session.user.childs) == -1) {
                        continue;
                    }
                }
                totalNum++;
                if (peerState != holly.softphonebar._softphonebar_desc["offline"] && peerState != holly.softphonebar._softphonebar_desc["unregister"] && peerState != holly.softphonebar._softphonebar_desc["ready"]) {
                    onlineNum++;
                    if (peerState.indexOf(holly.softphonebar._softphonebar_desc["peerstate"]) > 0) {
                        idleNum++;
                    }
                }
            }
        }
        $("#monitor_countAll_" + holly.softphonebar.softphonebar_getpbxid(pbx)).html(totalNum);
        $("#monitor_onlineCount_" + holly.softphonebar.softphonebar_getpbxid(pbx)).html(onlineNum);
        $("#monitor_idleCount_" + holly.softphonebar.softphonebar_getpbxid(pbx)).html(idleNum);
    },
    _softphonebar_createRow: function(item, key) {
        if (key === 'serviceNo') {
            var tdHtml = "";
            if ((holly.softphonebar._softphonebar_serviceNo_index++) % 2 == 0) {
                tdHtml = "<tr id=\"monitor_serviceNo_" + item.serviceNo + "\">";
            } else {
                tdHtml = "<tr id=\"monitor_serviceNo_" + item.serviceNo + "\" class=\"odd\">";
            }
            tdHtml += "<td>" + item.serviceNo + "</td><td>" + item.inCalls + "</td><td>" + item.inLost + "</td><td>" + item.inComplete + "</td><tr>";
            $('#monitor_serviceNo_' + holly.softphonebar.softphonebar_getpbxid(item.pbx) + ' > tbody:last').append(tdHtml);
        } else if (key == 'queueId') {
            var tdHtml = "";
            if ((holly.softphonebar._softphonebar_queue_index++) % 2 == 0) {
                tdHtml = "<tr id=\"monitor_queue_" + item.queueId + "\">";
            } else {
                tdHtml = "<tr id=\"monitor_queue_" + item.queueId + "\" class=\"odd\">";
            }
            var waitCountTd = "";
            if (item.queueWaitCount > 0) {
                waitCountTd = "<td style='color:red;'>" + item.queueWaitCount + "</td>";
            } else {
                waitCountTd = "<td>" + item.queueWaitCount + "</td>";
            }
            tdHtml += "<td class=\"ellipsis\" title=\"" + item.queueName + "\">" + item.queueName + "</td><td>" + item.idleAgentCount + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_getQueuePeer(item) + "\">" + item.totalAgentCount + holly.softphonebar._softphonebar_getQueuePeer(item) + "</td>" +
                waitCountTd + "<td>" + (item.totalCalls - item.abadonedCalls) + "</td><tr>";
            $('#monitor_queue_' + holly.softphonebar.softphonebar_getpbxid(item.pbx) + ' > tbody:last').append(tdHtml);
        } else if (key == 'userId') {
            var tdHtml = "";
            if ((holly.softphonebar._softphonebar_peer_index++) % 2 == 0) {
                tdHtml = "<tr id=\"monitor_peer_" + item.userId + "\">";
            } else {
                tdHtml = "<tr id=\"monitor_peer_" + item.userId + "\" class=\"odd\">";
            }
            tdHtml += "<td class=\"ellipsis\" title='" + item.DisplayName + "' style=\"height:20px;overflow: hidden\">" + item.DisplayName + "</td><td>" + item.exten + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_getInComCount(item) + "\">" + (item.InComplete + item.TransferComplete) + "(" + holly.softphonebar._softphonebar_getInComCount(item) + ")</td>" +
                "<td>" + item.OutComplete + "</td><td>" + item.callNo + "</td><td>" + holly.softphonebar._softphonebar_displayExtenType(item) + "</td>" +
                "<td>" + holly.softphonebar._softphonebar_displayStatus(item) + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_displayQueueName(item.queueName) + "\">" + holly.softphonebar._softphonebar_displayQueueName(item.queueName) + "</td><td id=\"" + item.userId + "_timer\"></td>" +
                "<td>" + holly.softphonebar._softphonebar_getDialoutTime(item.DialoutTimeLength) + "</td><td>" + holly.softphonebar._softphonebar_getStatus(item) + "</td>" +
                "<td><button id=\"" + item.userId + "_listen_disable\" class=\"btn btn-mini disabled\" >监听</button>" +
                "<button id=\"" + item.userId + "_listen\" class=\"btn btn-mini btn-warning\" style=\"display:none;\" onclick=\"holly.softphonebar._softphonebar_listen('" + item.channel + "', '" + item.userId + "')\">监听</button>" +
                "<button id=\"" + item.userId + "_endlisten\" class=\"btn btn-mini btn-warning\" style=\"display:none;\" onclick=\"holly.softphonebar._softphonebar_endListen()\">结束监听</button>" +
                "<button id=\"" + item.userId + "_forceHangup_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">强拆</button>" +
                "<button id=\"" + item.userId + "_forceHangup\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_forceHangup('" + item.channel + "', '" + item.pbx + "')\">强拆</button>" +
                "<button id=\"" + item.userId + "_loot_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">抢接</button>" +
                "<button id=\"" + item.userId + "_loot\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_loot('" + item.linkedChannel + "')\">抢接</button>" +
                "<button id=\"" + item.userId + "_kick_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">签出</button>" +
                "<button id=\"" + item.userId + "_kick\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_kick('" + item.userId + "', '" + item.pbx + "')\">签出</button>" +
                "<button id=\"" + item.userId + "_pick_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">签入</button>" +
                "<button id=\"" + item.userId + "_pick\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_pick('" + item.userId + "', '" + item.pbx + "')\">签入</button>" +
                "</td></tr>";
            var currentPbxId = holly.softphonebar.softphonebar_getpbxid(item.pbx);
            var currentTbody = $('#monitor_peer_' + currentPbxId + ' > tbody:last');
            currentTbody.append(tdHtml);

            if (item.login && item.timestamp) {
                var date = new Date();
                var identity = date.valueOf();
                var oldTime = ((identity - holly.phone.phone_data.currentServerTime) - parseFloat(item.timestamp) * 1000) / 1000;
                if (oldTime < 0) {
                    oldTime = 0;
                }
                var countTimer = {
                    count: oldTime
                };
                holly.softphonebar._softphonebar_monitorTimers[item.userId] = countTimer;
            }

            holly.softphonebar._softphonebar_controlMonitor(item);
            holly.softphonebar._softphonebar_updatePeerNum(item.pbx);
        }
    },
    _softphonebar_getStatus: function(peer) {
        if (!peer.login && !(peer.extenType == 'gateway' || peer.extenType == 'Local')) {
            return "";
        } else {
            return peer.status;
        }
    },
    _softphonebar_controlMonitor: function(peer) {
        if (peer.userId == holly.phone.phone_data.userId || (!peer.login && peer.extenType != 'Local' && peer.extenType != 'gateway')) {
            $("#" + peer.userId + "_kick_disable").css("display", "");
            $("#" + peer.userId + "_kick").css("display", "none");
        } else {
            $("#" + peer.userId + "_kick_disable").css("display", "none");
            $("#" + peer.userId + "_kick").css("display", "");
        }
        if (peer.userId == holly.phone.phone_data.userId || peer.login || (!peer.login && peer.extenType == "Local") || (!peer.login && peer.extenType == "gateway")) {
            $("#" + peer.userId + "_pick_disable").css("display", "");
            $("#" + peer.userId + "_pick").css("display", "none");
        } else {
            $("#" + peer.userId + "_pick_disable").css("display", "none");
            $("#" + peer.userId + "_pick").css("display", "");
        }
        if (peer.callStatus != "listen" && peer.callStatus != "Idle") {
            $("#" + peer.userId + "_forceHangup_disable").css("display", "none");
            $("#" + peer.userId + "_forceHangup").css("display", "");
        } else {
            $("#" + peer.userId + "_forceHangup_disable").css("display", "");
            $("#" + peer.userId + "_forceHangup").css("display", "none");
        }
        if (holly.phone.phone_data.extenType == "none" || peer.userId == holly.phone.phone_data.userId || holly.softphonebar._softphonebar_isCalling(holly.phone.phone_data.userId) || !holly.softphonebar._softphonebar_isCalling(peer.userId)) {
            $("#" + peer.userId + "_loot_disable").css("display", "");
            $("#" + peer.userId + "_loot").css("display", "none");
        } else {
            $("#" + peer.userId + "_loot_disable").css("display", "none");
            $("#" + peer.userId + "_loot").css("display", "");
        }
        if (holly.phone.phone_data.extenType != "none" && peer.userId != holly.phone.phone_data.userId && !holly.softphonebar._softphonebar_isCalling(holly.phone.phone_data.userId) && (peer.callStatus == "webcall" || peer.callStatus == "inner" || peer.callStatus == "normal" || peer.callStatus == "dialout" || peer.callStatus == "dialTransfer" || peer.callStatus == "transfer")) {
            $("#" + peer.userId + "_listen_disable").css("display", "none");
            $("#" + peer.userId + "_listen").css("display", "");
        } else {
            $("#" + peer.userId + "_listen_disable").css("display", "");
            $("#" + peer.userId + "_listen").css("display", "none");
        }
        if (peer.pbx != holly.phone.phone_data.pbx_in_ip) {
            $("#" + peer.userId + "_loot_disable").css("display", "none");
            $("#" + peer.userId + "_loot").css("display", "none");
            $("#" + peer.userId + "_listen_disable").css("display", "none");
            $("#" + peer.userId + "_listen").css("display", "none");
        }
    },
    _softphonebar_displayExtenType: function(peer) {
        var displayExtenType = "";
        if (peer.extenType === 'sip') {
            displayExtenType = "云通信客户端";
        } else if (peer.extenType === 'gateway') {
            displayExtenType = "SIP话机/网关";
        } else if (peer.extenType === 'Local') {
            displayExtenType = peer.localNo;
        } else if (peer.extenType === 'none') {
            displayExtenType = "无电话接入";
        }
        return displayExtenType;
    },

    _softphonebar_updateRow: function(item, curRow, key) {
        if (key == 'serviceNo') {
            var tdHtml = "<td>" + item.serviceNo + "</td><td>" + item.inCalls + "</td><td>" + item.inLost + "</td><td>" + item.inComplete + "</td>";
            curRow.html(tdHtml);
        } else if (key === 'queueId') {
            var waitCountTd = "";
            if (item.queueWaitCount > 0) {
                waitCountTd = "<td style='color:red;'>" + item.queueWaitCount + "</td>";
            } else {
                waitCountTd = "<td>" + item.queueWaitCount + "</td>";
            }
            var tdHtml = "<td class=\"ellipsis\" title=\"" + item.queueName + "\">" + item.queueName + "</td><td>" + item.idleAgentCount + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_getQueuePeer(item) + "\">" + item.totalAgentCount + holly.softphonebar._softphonebar_getQueuePeer(item) + "</td>" + waitCountTd + "<td>" + (item.totalCalls - item.abadonedCalls) + "</td>";
            curRow.html(tdHtml);
        } else if (key === 'userId') {
            var tdHtml = "<td class=\"ellipsis\" title='" + item.DisplayName + "' style=\"height:20px;overflow: hidden\">" + item.DisplayName + "</td><td>" + item.exten + "</td><td class=\"ellipsis\"  title=\"" + holly.softphonebar._softphonebar_getInComCount(item) + "\">" + (item.InComplete + item.TransferComplete) + "(" + holly.softphonebar._softphonebar_getInComCount(item) + ")</td><td>" + item.OutComplete + "</td><td>" + item.callNo + "</td>" +
                "<td>" + holly.softphonebar._softphonebar_displayExtenType(item) + "</td><td>" + holly.softphonebar._softphonebar_displayStatus(item) + "</td><td class=\"ellipsis\" title=\"" + holly.softphonebar._softphonebar_displayQueueName(item.queueName) + "\">" + holly.softphonebar._softphonebar_displayQueueName(item.queueName) + "</td>" +
                "<td id=\"" + item.userId + "_timer\"></td><td>" + holly.softphonebar._softphonebar_getDialoutTime(item.DialoutTimeLength) + "</td><td>" + holly.softphonebar._softphonebar_getStatus(item) + "</td>" +
                "<td><button id=\"" + item.userId + "_listen_disable\" class=\"btn btn-mini disabled\" >监听</button>" +
                "<button id=\"" + item.userId + "_listen\" class=\"btn btn-mini btn-warning\" style=\"display:none;\" onclick=\"holly.softphonebar._softphonebar_listen('" + item.channel + "', '" + item.userId + "')\">监听</button>" +
                "<button id=\"" + item.userId + "_endlisten\" class=\"btn btn-mini btn-warning\" style=\"display:none;\" onclick=\"holly.softphonebar._softphonebar_endListen('" + item.channel + "')\">结束监听</button>" +
                "<button id=\"" + item.userId + "_forceHangup_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">强拆</button>" +
                "<button id=\"" + item.userId + "_forceHangup\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_forceHangup('" + item.channel + "', '" + item.pbx + "')\">强拆</button>" +
                "<button id=\"" + item.userId + "_loot_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">抢接</button>" +
                "<button id=\"" + item.userId + "_loot\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_loot('" + item.linkedChannel + "')\">抢接</button>" +
                "<button id=\"" + item.userId + "_kick_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">签出</button>" +
                "<button id=\"" + item.userId + "_kick\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_kick('" + item.userId + "', '" + item.pbx + "')\">签出</button>" +
                "<button id=\"" + item.userId + "_pick_disable\" class=\"btn btn-mini disabled\" style=\"margin-left: 2px;\">签入</button>" +
                "<button id=\"" + item.userId + "_pick\" class=\"btn btn-mini btn-warning\" style=\"margin-left: 2px;display:none;\" onclick=\"holly.softphonebar._softphonebar_pick('" + item.userId + "', '" + item.pbx + "')\">签入</button>" +
                "</td>";
            curRow.html(tdHtml);

            if (item.login && item.timestamp) {
                var date = new Date();
                var identity = date.valueOf();
                var oldTime = ((identity - holly.phone.phone_data.currentServerTime) - parseFloat(item.timestamp) * 1000) / 1000;
                if (oldTime < 0) {
                    oldTime = 0;
                }
                var countTimer = {
                    count: oldTime
                }
                holly.softphonebar._softphonebar_monitorTimers[item.userId] = countTimer;
            } else {
                delete holly.softphonebar._softphonebar_monitorTimers[item.userId];
                $("#" + item.userId + "_timer").text("");
            }
            holly.softphonebar._softphonebar_controlMonitor(item);
            holly.softphonebar._softphonebar_updatePeerNum(item.pbx);
        }
    },
    _softphonebar_listen: function(curChannel, userId) {
        var peer = holly.phone.phone_peers[userId];
        if (peer == null) {
            holly.utils.showError("监听失败!", "softphone_transfer");
            return;
        }
        if (holly.phone.phone_data.busyType == "0") {
            holly.utils.showError("请先将电话置为忙碌", "softphone_transfer");
            return;
        }
        if (holly.phone.phone_data.extenType == "none") {
            holly.utils.showError("执行该操作必须以电话方式登录", "softphone_transfer");
            return;
        }
        if (peer.userId == holly.phone.phone_data.userId) {
            holly.utils.showError("不允许对自身进行操作", "softphone_transfer");
            return;
        }
        if (peer.callStatus != "webcall" && peer.callStatus != "inner" && peer.callStatus != "normal" && peer.callStatus != "dialout" && peer.callStatus != "dialTransfer" && peer.callStatus != "transfer") {
            holly.utils.showError("该状态不允许监听", "softphone_transfer");
            return;
        }
        var listen = holly.phone.phone_listen(curChannel);
        if (listen) {
            $("#" + userId + "_listen").css("display", "none");
            $("#" + userId + "_endlisten").css("display", "");
        }
    },
    _softphonebar_getQueuePeer: function(item) {
        var queue = holly.phone.phone_queues[item.queueId];
        var members;
        var curPeer;
        var tipTitle = "";
        if (queue) {
            members = queue.members;
            for (var j in members) {
                curPeer = holly.phone.phone_peers_sip[j];
                if (curPeer)
                    tipTitle += (curPeer.DisplayName + ",");
            }
            if (tipTitle != "") {
                tipTitle = "(" + tipTitle.substring(0, tipTitle.lastIndexOf(",")) + ")";
            }
        }
        return tipTitle;
    },
    _softphonebar_getInComCount: function(item) {
        return "普通来电数:" + item.InComplete + "\r\n" + "转接来电数:" + item.TransferComplete;
    },
    _softphonebar_endListen: function() {
        holly.phone.phone_hangup();
    },

    _softphonebar_forceHangup: function(curChannel, pbx) {
        if (pbx === holly.phone.phone_data.pbx_in_ip)
            holly.phone.phone_hangupChannel(curChannel);
        else
            holly.phone.phone_hangupChannelFromPbx(curChannel, pbx);
    },
    _softphonebar_loot: function(linkedChannel) {
        holly.phone.phone_loot(linkedChannel);
    },
    _softphonebar_kick: function(userId, pbx) {
        if (pbx === holly.phone.phone_data.pbx_in_ip)
            holly.phone.phone_kick(userId);
        else
            holly.phone.phone_kickFromPbx(userId, pbx);
    },
    _softphonebar_pick: function(userId, pbx) {
        if (pbx === holly.phone.phone_data.pbx_in_ip)
            holly.phone.phone_pick(userId);
        else
            holly.phone.phone_pickFromPbx(userId, pbx);
    },
    _softphonebar_evtRing: function(event, callObject) {
        var dialoutInput = $("#dialout_input");
        if (dialoutInput) {
            var phoneNum = '';
            if (callObject) {
                if (callObject.ChannelType === 'dialout') {
                    phoneNum = callObject.FromDid;
                } else if (callObject.ChannelType === 'normal') {
                    phoneNum = callObject.FromCid;
                }
                if (hollyglobal.isHiddenNumber) {
                    phoneNum = holly.softphonebar.softphonebar_getHiddenNum(phoneNum);
                }
            }
            $("#dialout_input").val(phoneNum);
        }
        if (!hollyglobal.isMonitorPage && hollyglobal.ringEvent && typeof hollyglobal.ringEvent == 'function') {
            hollyglobal.ringEvent(callObject);
        }
    },
    _softphonebar_evtTalking: function(callObject) {
        if (!hollyglobal.isMonitorPage && hollyglobal.talkingEvent && typeof hollyglobal.talkingEvent == 'function') {
            hollyglobal.talkingEvent(callObject);
        }
    },
    _softphonebar_evtHangup: function(event, callObject) {
        if (!hollyglobal.isMonitorPage && hollyglobal.hangupEvent && typeof hollyglobal.hangupEvent == 'function') {
            hollyglobal.hangupEvent(callObject);
        }
    },
    _softphonebar_displayQueueName: function(queueName) {
        if (!queueName)
            queueName = "";
        return queueName;
    },
    _softphonebar_ontDialinAgentBusy: function(event, callObject) {
        //        Account: "N000000007121"
        //        Command: "Event"
        //        Event: "DialinAgentBusyMessage"
        //        FromCid: "0105004"
        //        PBX: "2.3.1.100"
        //        UserID: "82dc2510-bef4-11e3-9327-9b83bd1d8356"
        holly.utils.showError("您有新来电，来电号码:" + callObject.FromCid, "softphone_transfer");
    }
}

holly.utils = {
    showBoxbgDom: null,
    showBoxMsgDom: null,
    notifyDialogRemain: 500,
    notifyDialogInterval: null,
    serachInputNoresult: "serachInputNoresult",
    pickSoftphonebar: function () {
        $("#softphoneBarPick").css("display", "none");
        $("#softphoneBarKick").css("display", "block");
    },
    kickSoftphonebar: function () {
        $("#softphoneBarPick").css("display", "block");
        $("#softphoneBarKick").css("display", "none");
    },
    unRegisterSoftphonebar: function () {
        $("#softphoneBarPick").css("display", "none");
        $("#softphoneBarKick").css("display", "none");
        holly.softphonebar._softphonebar_barupdate('', 'unregister', '');
    },
    hideSoftphonebar: function () {
        $("#softphoneBarPick").css("display", "none");
        $("#softphoneBarKick").css("display", "none");
    },
    showBox: function (width, height, msg) {
        var bodyWidth = document.body.offsetWidth;
        var bodyHeight = screen.height;
        if (!holly.utils.showBoxbgDom) {
            holly.utils.showBoxbgDom = document.createElement("div");
            holly.utils.showBoxbgDom.setAttribute("id", "icc.holly.utils.bgDiv");
            holly.utils.showBoxbgDom.style.position = "absolute";
            holly.utils.showBoxbgDom.style.top = "0";
            holly.utils.showBoxbgDom.style.background = "#f2f2f2";
            holly.utils.showBoxbgDom.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
            holly.utils.showBoxbgDom.style.opacity = "0.6";
            holly.utils.showBoxbgDom.style.left = "0";
            holly.utils.showBoxbgDom.style.zIndex = "10000";
        }
        holly.utils.showBoxbgDom.style.width = bodyWidth + "px";
        holly.utils.showBoxbgDom.style.height = bodyWidth + "px";
        document.body.appendChild(holly.utils.showBoxbgDom);

        if (!holly.utils.showBoxMsgDom) {
            holly.utils.showBoxMsgDom = document.createElement("div");
            holly.utils.showBoxMsgDom.setAttribute("id", "icc.holly.utils.msgDiv");
            holly.utils.showBoxMsgDom.setAttribute("align", "center");
            holly.utils.showBoxMsgDom.style.background = "white";
            holly.utils.showBoxMsgDom.style.border = "1px solid #c6c6c6";
            holly.utils.showBoxMsgDom.style.position = "absolute";
            holly.utils.showBoxMsgDom.style.left = (bodyWidth - width) / 2 + "px";
            holly.utils.showBoxMsgDom.style.top = 135 + document.documentElement.scrollTop + "px";
            holly.utils.showBoxMsgDom.style.textAlign = "left";
            holly.utils.showBoxMsgDom.style.lineHeight = "25px";
            holly.utils.showBoxMsgDom.style.zIndex = "10001";
            holly.utils.showBoxMsgDom.style.paddingTop = "11px";
            holly.utils.showBoxMsgDom.style.paddingLeft = "10px";
            holly.utils.showBoxMsgDom.style.paddingRight = "10px";
        }

        holly.utils.showBoxMsgDom.style.width = width + "px";
        holly.utils.showBoxMsgDom.style.height = height + "px";

        holly.utils.showBoxMsgDom.innerHTML = msg;
        document.body.appendChild(holly.utils.showBoxMsgDom);
    },
    closeBox: function () {
        if (holly.utils.showBoxMsgDom) {
            document.body.removeChild(holly.utils.showBoxMsgDom);
            holly.utils.showBoxMsgDom = null;
        }
        if (holly.utils.showBoxbgDom) {
            document.body.removeChild(holly.utils.showBoxbgDom);
            holly.utils.showBoxbgDom = null;
        }
    },
    sortTable: function (tableID, iCol, dataType, object) {
        var docFrag = document.createDocumentFragment();
        var sortArr = holly.utils._getSortTRs(tableID, iCol, dataType, $(object).attr("state"));
        if (!sortArr)
            return;
        holly.utils._change_sortState(tableID, object);
        for (var i = 0; i < sortArr.length; i++) {
            docFrag.appendChild(sortArr[i]);
        }
        var oTable = document.getElementById(tableID);
        oTable.tBodies[0].appendChild(docFrag);
    },
    _getSortTRs: function (tableID, iCol, dataType, state) {
        var trArr = new Array;
        var oTable = document.getElementById(tableID);
        var rows = oTable.tBodies[0].rows;
        var sortExcludeRow = [];
        for (var i = 0; i < rows.length; i++) {
            if ($(rows[i].cells[0]).attr('sort_exclude')) {
                sortExcludeRow.push(rows[i]);
            } else {
                trArr[trArr.length] = rows[i];
            }
        }
        var html = holly.utils._compareTRs(iCol, dataType, state);
        if (!html)
            return;
        trArr.sort(html);
        if (sortExcludeRow.length > 0) {
            for (var j = 0, jLen = sortExcludeRow.length; j < jLen; j++) {
                trArr.push(sortExcludeRow[j]);
            }
        }
        return trArr;
    },
    _compareTRs: function (iCol, dataType, state) {
        return function compare(tr1, tr2) {
            var cell1 = tr1.cells[iCol];
            var cell2 = tr2.cells[iCol];
            if (!cell1 || !cell2)
                return null;
            var value1 = holly.utils._convert(cell1.innerText, dataType);
            var value2 = holly.utils._convert(cell2.innerText, dataType);
            if (state == "init" || state == "down") {
                return holly.utils._asc(value1, value2);
            } else if (state == "up") {
                return holly.utils._desc(value1, value2);
            }
        };
    },
    _convert: function (value, dataType) {
        switch (dataType) {
            case "int":
                return parseInt(value);
            case "float":
                return parseFloat(value);
            case "date":
                return new Date(Date.parse(value));
            case "intAndString":
            {
                return parseInt(value.substring(0, value.indexOf("(")));
            }
            default:
                return value.toString();
        }
    },
    _desc: function (x, y) {
        if (x > y) {
            return -1;
        } else if (x < y) {
            return 1;
        } else {
            return 0;
        }
    },
    _asc: function (x, y) {
        if (x > y) {
            return 1;
        } else if (x < y) {
            return -1;
        } else {
            return 0;
        }
    },
    _change_sortState: function (tableID, object) {
        var tableIDSort = $("#" + tableID + " .sort");
        tableIDSort.removeClass("monitor_sort_up");
        tableIDSort.removeClass("monitor_sort_down");
        tableIDSort.addClass("monitor_sort");
        var objectObj = $(object);
        var state = objectObj.attr("state");
        if (state == "init") {
            objectObj.attr("state", "up");
            objectObj.find("span").removeClass("monitor_sort");
            objectObj.find("span").addClass("monitor_sort_up");
        } else if (state == "up") {
            objectObj.attr("state", "down");
            objectObj.find("span").removeClass("monitor_sort_up");
            objectObj.find("span").addClass("monitor_sort_down");
        } else if (state == "down") {
            objectObj.attr("state", "up");
            objectObj.find("span").removeClass("monitor_sort_down");
            objectObj.find("span").addClass("monitor_sort_up");
        }
    },
    _available: function (str, object, index) {
        var isAvailable = false;
        if (object.searchField == undefined
            || object.data == undefined) {
            return isAvailable;
        }
        var searchs = object.searchField;
        var pinyinFields = object.pinyinField;
        var data = object.data;
        for (var i = 0; i < searchs.length; i++) {
            var pinyin = false;
            if (holly.utils.contains(pinyinFields, searchs[i])) {
                pinyin = true;
            }
            var searchValue = eval("data[index]." + searchs[i]);
            if (pinyin && data[index].pinyin && (data[index].pinyin).match("^" + str)) {
                isAvailable = true;
                return isAvailable;
            }
            if (searchValue && searchValue.match("^" + str)) {
                isAvailable = true;
                return isAvailable;
            }
        }
        return isAvailable;
    },
    _searchClick: function (object, index) {
        var obj = $("#" + object.id + "_ul li:eq(" + index + ")");
        var userId = obj.attr("userId");
        holly.utils._setValue(object.id, userId, object);
    },
    _searchOnKeyChange: function (object, index) {
        var obj = $("#" + object.id + "_ul li:eq(" + index + ")");
        var userId = obj.attr("userId");
        var user = holly.utils._getObjectInfo(object, userId);
        var callback = object.callbackFuc;
        if (callback)
            eval("callback(user)");
    },
    _setValue: function (id, userId, object) {
        var user = holly.utils._getObjectInfo(object, userId);
        if (object.showField && object.showField != "") {
            var field = object.showField;
            $("#" + id + "_input").val(eval("user." + field));
            $("#" + id + "_input").css("color", "#000");
        }
        $("#" + id + "_div").css("display", "none");
        var callback = object.callbackFuc;
        if (callback)
            eval("callback(user)");
    },
    _getObjectInfo: function (object, userId) {
        if (object.arrayDataType || object.data.length == 0) {
            return object.data[userId];
        } else {
            if (object.cacheData) {
                return getCache(object.cacheData, userId);
            }
            return getCache("agents", userId);
        }
    },
    closeBox: function () {
        holly.phone.phone_closeDiv();
    },
    checkHide: function () {
        if (holly.utils.notifyDialogRemain <= 0) {
            holly.utils.hideNotify();
        }
        holly.utils.notifyDialogRemain -= 500;
    },
    hideNotify: function () {
        if (holly.utils.notifyDialogInterval != null) {
            clearInterval(holly.utils.notifyDialogInterval);
            holly.utils.notifyDialogInterval = null;
            holly.phone.phone_closeDiv();
        }
    },
    showError: function (msg, objectId) {
        $("#softphone-bar-bgdiv").css({display: "block", height: $(document).height()});
        var msgHtml = "<div style='height:34px;overflow:hidden;text-align:center;'><div style='overflow:hidden;padding-top:8px'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/tip_error.png' style='float:left;margin-left:10px;'/>" +
            "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:4px;'>" + msg + "</div>" +
            "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.phone.phone_closeDiv();\">关 闭</button></div>";
        $('#' + objectId).empty();
        $('#' + objectId).html(msgHtml);
        document.documentElement.scrollTop = 0;
        $('#' + objectId).fadeIn('fast');
    },

    showSucc: function (msg, objectId) {
        $("#softphone-bar-bgdiv").css({display: "block", height: $(document).height()});
//         $('#'+objectId).css("top","5px");
//         var msgHtml = "" +
//                 "<div style='height:30px;overflow:hidden;padding-left:20px;'><img src='./img/tip_succ.png' style='float:left;'/>" +
//                 "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:2px'>"+msg+"</div></div>";
        var msgHtml = "<div style='height:34px;overflow:hidden;text-align:center;'><div style='overflow:hidden;padding-top:8px'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/tip_succ.png' style='float:left;margin-left:10px;'/>" +
            "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:4px;'>" + msg + "</div></div>";
        $('#' + objectId).empty();
        $('#' + objectId).html(msgHtml);
        document.documentElement.scrollTop = 0;
        $('#' + objectId).fadeIn('fast');
        holly.utils.notifyDialogInterval = setInterval("holly.utils.checkHide()", 600);
    },

    showTransferOrConsultError: function (msg, id) {
        var msgHtml = "<div style='height:34px;overflow:hidden;text-align:center;'><div style='overflow:hidden;padding-top:8px'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/tip_error.png' style='float:left;margin-left:20px;'/>" +
            "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:2px;'>" + msg + "</div>" +
            "<button class='btn btn-small btn-primary' type='button' style='float:left;margin-left:5px;' onclick=\"javascript:holly.phone.phone_closeDiv();\">关 闭</button></div>";
        $('#' + id).html(msgHtml);
    },
    showTransferOrConsultSucc: function (msg, id) {
        holly.utils.notifyDialogRemain = 500;
        holly.utils.hideNotify();
        var msgHtml = "<div style='height:34px;overflow:hidden;text-align:center'><div style='overflow:hidden;padding-top:8px'>" +
            "<img src='" + (hollyglobal.imgDir ? hollyglobal.imgDir : '.') + "/img/tip_succ.png' style='float:left;margin-left:20px;' />" +
            "<div style='float:left;color:#666666;padding-left:5px;font-size:15px;padding-top:5px'>" + msg + "</div>" +
            "</div></div>";
        $('#' + id).html(msgHtml);
        holly.utils.notifyDialogInterval = setInterval("holly.utils.checkHide()", 600);
    },
    contains: function (elems, value) {
        for (var i = 0; i < elems.length; i++) {
            if (elems[i] == value) {
                return true;
            }
        }
        return false;
    },
    _hidden: function (className) {
        $("." + className).css("display", "none");
    },
    _stopEvent: function (event) {
        event.preventDefault();
    },
    startWith: function (str, prefix) {
        return str.indexOf(prefix) == 0;
    },
    json_encode: function (mixed_val) {
        var json = window.JSON;
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            return json.stringify(mixed_val);
        }
        var value = mixed_val;
        var quote = function (string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = {    // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ?
                '"' + string.replace(escapable, function (a) {
                    var c = meta[a];
                    return typeof c === 'string' ? c :
                        '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
        };

        var str = function (key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0;          // The loop counter.
            var k = '';          // The member key.
            var v = '';          // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':
                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                case 'object':
                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' :
                            gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                                '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // Iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' :
                        gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });
    }
}

let hollyglobal = {
    hangupEvent: function (peer) {
//        console.dir(peer);
        return ;
    },
    ringEvent: function (peer) {
//        console.dir(peer);
    },
    talkingEvent: function (peer) {
//        console.dir(peer);
    },
    loginSuccessCallback: null,

    loginFailureCallback: function (peer) {
       console.log(peer);
    },
    pbxs: [
        {
            PBX: '1.1.2.108',
            pbxNick: '101',
            NickName: '101',
            proxyUrl: "http://211.151.35.103"
        }
    ],
    accountId: 'N000000007284',
    sipConfigId: '2.3.1.101',
    monitorPassword: '7pu3refwds98172e',
    monitorUserID: '2387rufhinjvcx73rfws',
    loginBusyType: "0",
    loginExtenType: "sip",
    loginPassword: "111111",
    loginUser: "8013@hzfbj",
    loginProxyUrl: "http://211.151.35.104",
    isDisplayInvestigate: true,
    isDisplayConsult: false,
    isHiddenNumber: false,
    isMonitorPage: false,
    isDisplayTransfer: false
};

let cnToSpell = {
    spell: [
        ['A', '阿吖嗄腌锕啊'],
        ['Ai', '埃挨哎唉哀皑癌蔼矮艾碍爱隘捱嗳嗌嫒瑷暧砹锿霭'],
        ['An', '鞍氨安俺按暗岸胺案谙埯揞庵桉铵鹌黯'],
        ['Ang', '肮昂盎'],
        ['Ao', '凹敖熬翱袄傲奥懊澳坳嗷岙廒遨媪骜獒聱螯鏊鳌鏖'],
        ['Ba', '芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸茇菝岜灞钯粑鲅魃'],
        ['Bai', '白柏百摆佰败拜稗捭掰'],
        ['Ban', '斑班搬扳般颁板版扮拌伴瓣半办绊阪坂钣瘢癍舨'],
        ['Bang', '邦帮梆榜膀绑棒磅镑傍谤蒡浜'],
        ['Beng', '蚌崩绷甭泵蹦迸嘣甏'],
        ['Bao', '苞胞包褒薄雹保堡饱宝抱报暴豹鲍爆曝勹葆孢煲鸨褓趵龅'],
        ['Bo', '剥玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳亳啵饽檗擘礴钹鹁簸跛踣'],
        ['Bei', '杯碑悲卑北辈背贝钡倍狈备惫焙被孛陂邶蓓呗悖碚鹎褙鐾鞴'],
        ['Ben', '奔苯本笨畚坌锛'],
        ['Bi', '逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必壁臂避陛匕俾荜荸萆薜吡哔狴庳愎滗濞弼妣婢嬖璧贲睥畀铋秕裨筚箅篦舭襞跸髀'],
        ['Pi', '辟坯砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬丕仳陴邳郫圮埤鼙芘擗噼庀淠媲纰枇甓罴铍癖疋蚍蜱貔'],
        ['Bian', '鞭边编贬扁便变卞辨辩辫遍匾弁苄忭汴缏煸砭碥窆褊蝙笾鳊'],
        ['Biao', '标彪膘表婊骠飑飙飚镖镳瘭裱鳔'],
        ['Bie', '鳖憋别瘪蹩'],
        ['Bin', '彬斌濒滨宾摈傧豳缤玢槟殡膑镔髌鬓'],
        ['Bing', '兵冰柄丙秉饼炳病并禀邴摒'],
        ['Bu', '捕卜哺补埠不布步簿部怖卟逋瓿晡钚钸醭'],
        ['Ca', '擦嚓礤'],
        ['Cai', '猜裁材才财睬踩采彩菜蔡'],
        ['Can', '餐参蚕残惭惨灿骖璨粲黪'],
        ['Cang', '苍舱仓沧藏伧'],
        ['Cao', '操糙槽曹草嘈漕螬艚'],
        ['Ce', '厕策侧册测恻'],
        ['Ceng', '层蹭曾噌'],
        ['Cha', '插叉茬茶查碴搽察岔诧猹馇汊姹杈槎檫锸镲衩'],
        ['Chai', '差拆柴豺侪钗瘥虿'],
        ['Chan', '搀掺蝉馋谗缠铲产阐颤冁谄蒇廛忏潺澶孱羼婵骣觇禅蟾躔'],
        ['Chang', '昌猖场尝常长偿肠厂敞畅唱倡伥鬯苌菖徜怅惝阊娼嫦昶氅鲳'],
        ['Chao', '超抄钞朝嘲潮巢吵炒怊晁焯耖'],
        ['Che', '车扯撤掣彻澈坼砗'],
        ['Chen', '郴臣辰尘晨忱沉陈趁衬谌谶抻嗔宸琛榇碜龀'],
        ['Cheng', '撑称城橙成呈乘程惩澄诚承逞骋秤丞埕枨柽塍瞠铖铛裎蛏酲'],
        ['Chi', '吃痴持池迟弛驰耻齿侈尺赤翅斥炽傺墀茌叱哧啻嗤彳饬媸敕眵鸱瘛褫蚩螭笞篪豉踟魑'],
        ['Shi', '匙师失狮施湿诗尸虱十石拾时食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试谥埘莳蓍弑轼贳炻礻铈舐筮豕鲥鲺'],
        ['Chong', '充冲虫崇宠重茺忡憧铳舂艟'],
        ['Chou', '抽酬畴踌稠愁筹仇绸瞅丑臭俦帱惆瘳雠'],
        ['Chu', '初出橱厨躇锄雏滁除楚础储矗搐触处亍刍怵憷绌杵楮樗褚蜍蹰黜'],
        ['Chuai', '揣搋嘬膪踹'],
        ['Chuan', '川穿椽传船喘串舛遄氚钏舡'],
        ['Chuang', '疮窗床闯创怆'],
        ['Zhuang', '幢桩庄装妆撞壮状僮'],
        ['Chui', '吹炊捶锤垂陲棰槌'],
        ['Chun', '春椿醇唇淳纯蠢莼鹑蝽'],
        ['Chuo', '戳绰啜辍踔龊'],
        ['Ci', '疵茨磁雌辞慈瓷词此刺赐次茈祠鹚糍'],
        ['Cong', '聪葱囱匆从丛苁淙骢琮璁枞'],
        ['Cou', '凑楱辏腠'],
        ['Cu', '粗醋簇促卒蔟徂猝殂酢蹙蹴'],
        ['Cuan', '蹿篡窜汆撺爨镩'],
        ['Cui', '摧崔催脆瘁粹淬翠萃啐悴璀榱毳'],
        ['Cun', '村存寸忖皴'],
        ['Cuo', '磋撮搓措挫错厝嵯脞锉矬痤鹾蹉'],
        ['Da', '搭达答瘩打大耷哒怛妲褡笪靼鞑'],
        ['Dai', '呆歹傣戴带殆代贷袋待逮怠埭甙呔岱迨绐玳黛'],
        ['Dan', '耽担丹单郸掸胆旦氮但惮淡诞蛋儋凼萏菪啖澹宕殚赕眈疸瘅聃箪'],
        ['Tan', '弹坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭郯昙忐钽锬覃'],
        ['Dang', '当挡党荡档谠砀裆'],
        ['Dao', '刀捣蹈倒岛祷导到稻悼道盗叨氘焘纛'],
        ['De', '德得的锝'],
        ['Deng', '蹬灯登等瞪凳邓噔嶝戥磴镫簦'],
        ['Di', '堤低滴迪敌笛狄涤嫡抵底地蒂第帝弟递缔氐籴诋谛邸坻荻嘀娣柢棣觌祗砥碲睇镝羝骶締'],
        ['Zhai', '翟摘斋宅窄债寨砦瘵'],
        ['Dian', '颠掂滇碘点典靛垫电佃甸店惦奠淀殿丶阽坫巅玷钿癜癫簟踮'],
        ['Diao', '碉叼雕凋刁掉吊钓铞貂鲷'],
        ['Tiao', '调挑条迢眺跳佻苕祧窕蜩笤粜龆鲦髫'],
        ['Die', '跌爹碟蝶迭谍叠垤堞喋牒瓞耋鲽'],
        ['Ding', '丁盯叮钉顶鼎锭定订仃啶玎腚碇町疔耵酊'],
        ['Diu', '丢铥'],
        ['Dong', '东冬董懂动栋侗恫冻洞垌咚岽峒氡胨胴硐鸫'],
        ['Dou', '兜抖斗陡豆逗痘蔸钭窦蚪篼'],
        ['Du', '都督毒犊独读堵睹赌杜镀肚度渡妒芏嘟渎椟牍蠹笃髑黩'],
        ['Duan', '端短锻段断缎椴煅簖'],
        ['Dui', '堆兑队对怼憝碓镦'],
        ['Dun', '墩吨蹲敦顿钝盾遁沌炖砘礅盹趸'],
        ['Tun', '囤吞屯臀氽饨暾豚'],
        ['Duo', '掇哆多夺垛躲朵跺舵剁惰堕咄哚沲缍铎裰踱'],
        ['E', '蛾峨鹅俄额讹娥恶厄扼遏鄂饿噩谔垩苊莪萼呃愕屙婀轭腭锇锷鹗颚鳄'],
        ['En', '恩蒽摁嗯'],
        ['Er', '而儿耳尔饵洱二贰迩珥铒鸸鲕'],
        ['Fa', '发罚筏伐乏阀法珐垡砝'],
        ['Fan', '藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛蕃蘩幡夂梵燔畈蹯'],
        ['Fang', '坊芳方肪房防妨仿访纺放邡枋钫舫鲂'],
        ['Fei', '菲非啡飞肥匪诽吠肺废沸费狒悱淝妃绯榧腓斐扉砩镄痱蜚篚翡霏鲱'],
        ['Fen', '芬酚吩氛分纷坟焚汾粉奋份忿愤粪偾瀵棼鲼鼢'],
        ['Feng', '丰封枫蜂峰锋风疯烽逢冯缝讽奉凤俸酆葑唪沣砜豐'],
        ['Fo', '佛'],
        ['Fou', '否缶'],
        ['Fu', '夫敷肤孵扶拂辐幅氟符伏俘服浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐匐凫郛芙芾苻茯莩菔拊呋呒幞怫滏艴孚驸绂绋桴赙祓黻黼罘稃馥蚨蜉蝠蝮麸趺跗鲋鳆'],
        ['Ga', '噶嘎垓尬尕尜旮钆'],
        ['Gai', '该改概钙盖溉丐陔戤赅'],
        ['Gan', '干甘杆柑竿肝赶感秆敢赣坩苷尴擀泔淦澉绀橄旰矸疳酐'],
        ['Gang', '冈刚钢缸肛纲岗港杠戆罡筻'],
        ['Gao', '篙皋高膏羔糕搞镐稿告睾诰郜藁缟槔槁杲锆'],
        ['Ge', '哥歌搁戈鸽胳疙割革葛格阁隔铬个各鬲仡哿圪塥嗝纥搿膈硌镉袼虼舸骼'],
        ['Ha', '蛤哈铪'],
        ['Gei', '给'],
        ['Gen', '根跟亘茛哏艮'],
        ['Geng', '耕更庚羹埂耿梗哽赓绠鲠'],
        ['Gong', '工攻功恭龚供躬公宫弓巩汞拱贡共珙肱蚣觥'],
        ['Gou', '钩勾沟苟狗垢构购够佝诟岣遘媾缑枸觏彀笱篝鞲'],
        ['Gu', '辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇嘏诂菰崮汩梏轱牯牿臌毂瞽罟钴锢鸪痼蛄酤觚鲴'],
        ['Gua', '刮瓜剐寡挂褂卦诖呱栝胍鸹'],
        ['Guai', '乖拐怪掴'],
        ['Guan', '棺关官冠观管馆罐惯灌贯倌莞掼涫盥鹳鳏'],
        ['Guang', '光广逛咣犷桄胱'],
        ['Gui', '瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽匦刿庋宄妫桧炅晷皈簋鲑鳜'],
        ['Gun', '辊滚棍衮绲磙鲧'],
        ['Guo', '锅郭国果裹过馘埚呙帼崞猓椁虢聒蜾蝈'],
        ['Hai', '骸孩海氦亥害骇嗨胲醢'],
        ['Han', '酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉邗菡撖犴瀚晗焓顸颔蚶鼾'],
        ['Hang', '夯杭航行沆绗颃'],
        ['Hao', '壕嚎豪毫郝好耗号浩貉蒿薅嗥嚆濠灏昊皓颢蚝'],
        ['He', '呵喝荷菏核禾和何合盒阂河涸赫褐鹤贺诃劾壑嗬阖曷盍颌蚵翮'],
        ['Hei', '嘿黑'],
        ['Hen', '痕很狠恨'],
        ['Heng', '哼亨横衡恒蘅珩桁'],
        ['Hong', '轰哄烘虹鸿洪宏弘红黉訇讧荭蕻薨闳泓'],
        ['Hou', '喉侯猴吼厚候后堠後逅瘊篌糇鲎骺'],
        ['Hu', '呼乎忽瑚壶葫胡蝴狐糊湖弧虎唬护互沪户冱唿囫岵猢怙惚浒滹琥槲轷觳烀煳戽扈祜瓠鹄鹕鹱笏醐斛鹘'],
        ['Hua', '花哗华猾滑画划化话骅桦砉铧'],
        ['Huai', '槐徊怀淮坏踝'],
        ['Huan', '欢环桓还缓换患唤痪豢焕涣宦幻奂擐圜獾洹浣漶寰逭缳锾鲩鬟'],
        ['Huang', '荒慌黄磺蝗簧皇凰惶煌晃幌恍谎隍徨湟潢遑璜肓癀蟥篁鳇'],
        ['Hui', '灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘诙茴荟蕙咴喙隳洄彗缋珲晖恚虺蟪麾'],
        ['Hun', '荤昏婚魂浑混诨馄阍溷'],
        ['Huo', '豁活伙火获或惑霍货祸劐藿攉嚯夥钬锪镬耠蠖'],
        ['Ji', '計機击圾基机畸稽积箕肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪藉亟乩剞佶偈墼芨芰荠蒺蕺掎叽咭哜唧岌嵴洎屐骥畿玑楫殛戟戢赍觊犄齑矶羁嵇稷瘠虮笈笄暨跻跽霁鲚鲫髻'],
        ['Jia', '嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁伽郏葭岬浃迦珈戛胛恝铗镓痂瘕蛱笳袈跏'],
        ['Jian', '歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件健舰剑饯渐溅涧建僭谏谫菅蒹搛湔蹇謇缣枧楗戋戬牮犍毽腱睑锏鹣裥笕翦踺鲣鞯'],
        ['Jiang', '僵姜将浆江疆蒋桨奖讲匠酱降茳洚绛缰犟礓耩糨豇'],
        ['Jiao', '蕉椒礁焦胶交郊浇骄娇搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖佼僬艽茭挢噍峤徼姣敫皎鹪蛟醮跤鲛'],
        ['Jue', '嚼撅攫抉掘倔爵觉决诀绝厥劂谲矍蕨噘崛獗孓珏桷橛爝镢蹶觖'],
        ['Jie', '揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒芥界借介疥诫届讦诘拮喈嗟婕孑桀碣疖颉蚧羯鲒骱'],
        ['Jin', '巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸尽劲卺荩堇噤馑廑妗缙瑾槿赆觐衿矜'],
        ['Jing', '荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净刭儆阱菁獍憬泾迳弪婧肼胫腈旌箐'],
        ['Jiong', '炯窘迥扃'],
        ['Jiu', '揪究纠玖韭久灸九酒厩救旧臼舅咎就疚僦啾阄柩桕鸠鹫赳鬏'],
        ['Ju', '鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧倨讵苣苴莒掬遽屦琚椐榘榉橘犋飓钜锔窭裾醵踽龃雎鞫'],
        ['Juan', '捐鹃娟倦眷卷绢鄄狷涓桊蠲锩镌隽'],
        ['Jun', '均菌钧军君峻俊竣浚郡骏捃皲筠麇'],
        ['Ka', '喀咖卡佧咔胩'],
        ['Luo', '咯萝螺罗逻锣箩骡裸落洛骆络倮蠃荦摞猡泺漯珞椤脶镙瘰雒'],
        ['Kai', '开揩楷凯慨剀垲蒈忾恺铠锎锴'],
        ['Kan', '刊堪勘坎砍看侃莰阚戡龛瞰'],
        ['Kang', '康慷糠扛抗亢炕伉闶钪'],
        ['Kao', '考拷烤靠尻栲犒铐'],
        ['Ke', '坷苛柯棵磕颗科壳咳可渴克刻客课嗑岢恪溘骒缂珂轲氪瞌钶锞稞疴窠颏蝌髁'],
        ['Ken', '肯啃垦恳裉'],
        ['Keng', '坑吭铿'],
        ['Kong', '空恐孔控倥崆箜'],
        ['Kou', '抠口扣寇芤蔻叩囗眍筘'],
        ['Ku', '枯哭窟苦酷库裤刳堀喾绔骷'],
        ['Kua', '夸垮挎跨胯侉'],
        ['Kuai', '块筷侩快蒯郐哙狯浍脍'],
        ['Kuan', '宽款髋'],
        ['Kuang', '匡筐狂框矿眶旷况诓诳邝圹夼哐纩贶'],
        ['Kui', '亏盔岿窥葵奎魁傀馈愧溃馗匮夔隗蒉揆喹喟悝愦逵暌睽聩蝰篑跬'],
        ['Kun', '坤昆捆困悃阃琨锟醌鲲髡'],
        ['Kuo', '括扩廓阔蛞'],
        ['La', '垃拉喇蜡腊辣啦剌邋旯砬瘌'],
        ['Lai', '莱来赖崃徕涞濑赉睐铼癞籁'],
        ['Lan', '蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥岚漤榄斓罱镧褴'],
        ['Lang', '琅榔狼廊郎朗浪蒗啷阆稂螂'],
        ['Lao', '捞劳牢老佬姥酪烙涝唠崂忉栳铑铹痨耢醪'],
        ['Le', '勒了仂叻泐鳓'],
        ['Yue', '乐曰约越跃岳粤月悦阅龠哕瀹樾刖钺'],
        ['Lei', '雷镭蕾磊累儡垒擂肋类泪羸诔嘞嫘缧檑耒酹'],
        ['Leng', '棱楞冷塄愣'],
        ['Li', '厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐痢立粒沥隶力璃哩俪俚郦坜苈莅蓠藜呖唳喱猁溧澧逦娌嫠骊缡枥栎轹膦戾砺詈罹锂鹂疠疬蛎蜊蠡笠篥粝醴跞雳鲡鳢黧'],
        ['Lia', '俩'],
        ['Lian', '联莲连镰廉怜涟帘敛脸链恋炼练蔹奁潋濂琏楝殓臁裢裣蠊鲢'],
        ['Liang', '粮凉梁粱良两辆量晾亮谅墚莨椋锒踉靓魉'],
        ['Liao', '撩聊僚疗燎寥辽潦撂镣廖料蓼尥嘹獠寮缭钌鹩'],
        ['Lie', '列裂烈劣猎冽埒捩咧洌趔躐鬣'],
        ['Lin', '琳林磷霖临邻鳞淋凛赁吝拎蔺啉嶙廪懔遴檩辚瞵粼躏麟'],
        ['Ling', '玲菱零龄铃伶羚凌灵陵岭领另令酃苓呤囹泠绫柃棂瓴聆蛉翎鲮'],
        ['Liu', '溜琉榴硫馏留刘瘤流柳六浏遛骝绺旒熘锍镏鹨鎏'],
        ['Long', '龙聋咙笼窿隆垄拢陇垅茏珑栊胧砻癃'],
        ['Lou', '楼娄搂篓漏陋偻蒌喽嵝镂瘘耧蝼髅'],
        ['Lu', '芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮垆撸噜泸渌漉逯璐栌橹轳辂辘氇胪镥鸬鹭簏舻鲈'],
        ['Lv', '驴吕铝侣旅履屡缕虑氯律率滤绿捋闾榈膂稆褛'],
        ['Luan', '峦挛孪滦卵乱脔娈栾鸾銮'],
        ['Lue', '掠略锊'],
        ['Lun', '抡轮伦仑沦纶论囵'],
        ['Ma', '妈麻玛码蚂马骂嘛吗唛犸杩蟆'],
        ['Mai', '埋买麦卖迈脉劢荬霾'],
        ['Man', '瞒馒蛮满蔓曼慢漫谩墁幔缦熳镘颟螨鳗鞔'],
        ['Mang', '芒茫盲氓忙莽邙漭硭蟒'],
        ['Mao', '猫茅锚毛矛铆卯茂冒帽貌贸袤茆峁泖瑁昴牦耄旄懋瞀蝥蟊髦'],
        ['Me', '么麽'],
        ['Mei', '玫枚梅酶霉煤眉媒镁每美昧寐妹媚莓嵋猸浼湄楣镅鹛袂魅'],
        ['Mo', '没摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谟茉蓦馍嫫嬷殁镆秣瘼耱貊貘'],
        ['Men', '门闷们扪焖懑钔'],
        ['Meng', '萌蒙檬盟锰猛梦孟勐甍瞢懵朦礞虻蜢蠓艋艨'],
        ['Mi', '眯醚靡糜迷谜弥米秘觅泌蜜密幂芈谧咪嘧猕汨宓弭脒祢敉縻麋'],
        ['Mian', '棉眠绵冕免勉娩缅面沔渑湎腼眄'],
        ['Miao', '苗描瞄藐秒渺庙妙喵邈缈杪淼眇鹋'],
        ['Mie', '蔑灭乜咩蠛篾'],
        ['Min', '民抿皿敏悯闽苠岷闵泯缗玟珉愍黾鳘'],
        ['Ming', '明螟鸣铭名命冥茗溟暝瞑酩'],
        ['Miu', '谬缪'],
        ['Mou', '谋牟某侔哞眸蛑鍪'],
        ['Mu', '拇牡亩姆母墓暮幕募慕木目睦牧穆仫坶苜沐毪钼'],
        ['Na', '拿哪呐钠那娜纳讷捺肭镎衲'],
        ['Nai', '氖乃奶耐奈鼐佴艿萘柰'],
        ['Nan', '南男难喃囝囡楠腩蝻赧'],
        ['Nang', '囊攮囔馕曩'],
        ['Nao', '挠脑恼闹淖孬垴呶猱瑙硇铙蛲'],
        ['Ne', '呢'],
        ['Nei', '馁内'],
        ['Nen', '嫩恁'],
        ['Neng', '能'],
        ['Ni', '妮霓倪泥尼拟你匿腻逆溺伲坭蘼猊怩昵旎睨铌鲵'],
        ['Nian', '蔫拈年碾撵捻念廿埝辇黏鲇鲶'],
        ['Niang', '娘酿'],
        ['Niao', '鸟尿茑嬲脲袅'],
        ['Nie', '捏聂孽啮镊镍涅陧蘖嗫颞臬蹑'],
        ['Nin', '您'],
        ['Ning', '柠狞凝宁拧泞佞咛甯聍'],
        ['Niu', '牛扭钮纽拗狃忸妞'],
        ['Nong', '脓浓农弄侬哝'],
        ['Nu', '奴努怒弩胬孥驽'],
        ['Nv', '女恧钕衄'],
        ['Nuan', '暖'],
        ['Nue', '虐疟挪'],
        ['Nuo', '懦糯诺傩搦喏锘'],
        ['O', '哦噢'],
        ['Ou', '欧鸥殴藕呕偶沤讴怄瓯耦'],
        ['Pa', '啪趴爬帕怕琶葩杷筢'],
        ['Pai', '拍排牌徘湃派俳蒎哌'],
        ['Pan', '攀潘盘磐盼畔判叛拚爿泮袢襻蟠蹒'],
        ['Pang', '乓庞旁耪胖彷滂逄螃'],
        ['Pao', '抛咆刨炮袍跑泡匏狍庖脬疱'],
        ['Pei', '呸胚培裴赔陪配佩沛辔帔旆锫醅霈'],
        ['Pen', '喷盆湓'],
        ['Peng', '砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰堋嘭怦蟛'],
        ['Pian', '篇偏片骗谝骈犏胼翩蹁'],
        ['Piao', '飘漂瓢票剽嘌嫖缥殍瞟螵'],
        ['Pie', '撇瞥丿苤氕'],
        ['Pin', '拼频贫品聘姘嫔榀牝颦'],
        ['Ping', '乒坪苹萍平凭瓶评屏俜娉枰鲆'],
        ['Po', '坡泼颇婆破魄迫粕叵鄱珀钋钷皤笸'],
        ['Pou', '剖裒掊'],
        ['Pu', '扑铺仆莆葡菩蒲埔朴圃普浦谱瀑匍噗溥濮璞氆镤镨蹼'],
        ['Qi', '期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫亓圻芑芪萁萋葺蕲嘁屺岐汔淇骐绮琪琦杞桤槭耆祺憩碛颀蛴蜞綦鳍麒'],
        ['Qia', '掐恰洽葜袷髂'],
        ['Qian', '牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉倩佥阡芊芡茜掮岍悭慊骞搴褰缱椠肷愆钤虔箝'],
        ['Qiang', '枪呛腔羌墙蔷强抢戕嫱樯戗炝锖锵镪襁蜣羟跄'],
        ['Qiao', '橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍劁诮谯荞愀憔缲樵硗跷鞒'],
        ['Qie', '切茄且怯窃郄惬妾挈锲箧趄'],
        ['Qin', '钦侵亲秦琴勤芹擒禽寝沁芩揿吣嗪噙溱檎锓螓衾'],
        ['Qing', '青轻氢倾卿清擎晴氰情顷请庆苘圊檠磬蜻罄綮謦鲭黥'],
        ['Qiong', '琼穷邛茕穹蛩筇跫銎'],
        ['Qiu', '秋丘邱球求囚酋泅俅巯犰湫逑遒楸赇虬蚯蝤裘糗鳅鼽'],
        ['Qu', '趋区蛆曲躯屈驱渠取娶龋趣去诎劬蕖蘧岖衢阒璩觑氍朐祛磲鸲癯蛐蠼麴瞿黢'],
        ['Quan', '圈颧权醛泉全痊拳犬券劝诠荃犭悛绻辁畎铨蜷筌鬈'],
        ['Que', '缺炔瘸却鹊榷确雀阕阙悫'],
        ['Qun', '裙群逡'],
        ['Ran', '然燃冉染苒蚺髯'],
        ['Rang', '瓤壤攘嚷让禳穰'],
        ['Rao', '饶扰绕荛娆桡'],
        ['Re', '惹热'],
        ['Ren', '壬仁人忍韧任认刃妊纫仞荏饪轫稔衽'],
        ['Reng', '扔仍'],
        ['Ri', '日'],
        ['Rong', '戎茸蓉荣融熔溶容绒冗嵘狨榕肜蝾'],
        ['Rou', '揉柔肉糅蹂鞣'],
        ['Ru', '茹蠕儒孺如辱乳汝入褥蓐薷嚅洳溽濡缛铷襦颥'],
        ['Ruan', '软阮朊'],
        ['Rui', '蕊瑞锐芮蕤枘睿蚋'],
        ['Run', '闰润'],
        ['Ruo', '若弱偌箬'],
        ['Sa', '撒洒萨卅脎飒'],
        ['Sai', '腮鳃塞赛噻'],
        ['San', '三叁伞散仨彡馓毵'],
        ['Sang', '桑嗓丧搡磉颡'],
        ['Sao', '搔骚扫嫂埽缫臊瘙鳋'],
        ['Se', '瑟色涩啬铯穑'],
        ['Sen', '森'],
        ['Seng', '僧'],
        ['Sha', '莎砂杀刹沙纱傻啥煞唼歃铩痧裟霎鲨'],
        ['Shai', '筛晒酾'],
        ['Shan', '珊苫杉山删煽衫闪陕擅赡膳善汕扇缮讪鄯芟潸姗嬗骟膻钐疝蟮舢跚鳝'],
        ['Shang', '墒伤商赏晌上尚裳垧泷绱殇熵觞'],
        ['Shao', '梢捎稍烧芍勺韶少哨邵绍劭潲杓筲艄'],
        ['She', '奢赊蛇舌舍赦摄射慑涉社设厍佘揲猞滠麝'],
        ['Shen', '砷申呻伸身深娠绅神沈审婶甚肾慎渗什诜谂莘葚哂渖椹胂矧蜃糁'],
        ['Sheng', '声生甥牲升绳省盛剩胜圣嵊晟眚笙'],
        ['Shou', '收手首守寿授售受瘦兽狩绶艏'],
        ['Shu', '蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱恕丨倏塾菽摅沭澍姝纾毹腧殳秫'],
        ['Shua', '刷耍唰'],
        ['Shuai', '摔衰甩帅蟀'],
        ['Shuan', '栓拴闩涮'],
        ['Shuang', '霜双爽孀'],
        ['Shui', '谁水睡税'],
        ['Shun', '吮瞬顺舜'],
        ['Shuo', '说硕朔烁蒴搠妁槊铄'],
        ['Si', '斯撕嘶思私司丝死肆寺嗣四伺似饲巳厮俟兕厶咝汜泗澌姒驷缌祀锶鸶耜蛳笥'],
        ['Song', '松耸怂颂送宋讼诵凇菘崧嵩忪悚淞竦'],
        ['Sou', '搜艘擞嗽叟薮嗖嗾馊溲飕瞍锼螋'],
        ['Su', '苏酥俗素速粟僳塑溯宿诉肃夙谡蔌嗉愫涑簌觫稣術'],
        ['Suan', '酸蒜算狻'],
        ['Sui', '虽隋随绥髓碎岁穗遂隧祟谇荽濉邃燧眭睢'],
        ['Sun', '孙损笋荪狲飧榫隼'],
        ['Suo', '蓑梭唆缩琐索锁所唢嗦嗍娑桫挲睃羧'],
        ['Ta', '塌他它她塔獭挞蹋踏嗒闼溻遢榻沓铊趿鳎'],
        ['Tai', '胎苔抬台泰酞太态汰邰薹骀肽炱钛跆鲐'],
        ['Tang', '汤塘搪堂棠膛唐糖倘躺淌趟烫傥帑溏瑭樘铴镗耥螗螳羰醣'],
        ['Tao', '掏涛滔绦萄桃逃淘陶讨套鼗啕洮韬饕'],
        ['Te', '特忑慝铽'],
        ['Teng', '藤腾疼誊滕'],
        ['Ti', '梯剔踢锑提题蹄啼体替嚏惕涕剃屉倜悌逖绨缇鹈裼醍'],
        ['Tian', '天添填田甜恬舔腆掭忝阗殄畋'],
        ['Tie', '贴铁帖萜餮'],
        ['Ting', '厅听烃汀廷停亭庭挺艇莛葶婷梃铤蜓霆'],
        ['Tong', '通桐酮瞳同铜彤童桶捅筒统痛佟仝茼嗵恸潼砼'],
        ['Tou', '偷投头透骰'],
        ['Tu', '凸秃突图徒途涂屠土吐兔堍荼菟钍酴塗'],
        ['Tuan', '湍团抟彖疃'],
        ['Tui', '推颓腿蜕褪退忒煺'],
        ['Tuo', '拖托脱鸵陀驮驼椭妥拓唾佗坨庹沱柝柁橐砣箨酡跎鼍'],
        ['Wa', '挖哇蛙洼娃瓦袜佤娲腽'],
        ['Wai', '歪外崴'],
        ['Wan', '豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕剜芄菀纨绾琬脘畹蜿'],
        ['Wang', '汪王亡枉网往旺望忘妄罔惘辋魍'],
        ['Wei', '威巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫偎诿隈葳薇帏帷嵬猥猬闱沩洧涠逶娓玮韪軎炜煨痿艉鲔為'],
        ['Wen', '瘟温蚊文闻纹吻稳紊问刎阌汶璺攵雯'],
        ['Weng', '嗡翁瓮蓊蕹'],
        ['Wo', '挝蜗涡窝我斡卧握沃倭莴喔幄渥肟硪龌'],
        ['Wu', '巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误兀仵阢邬圬芴唔庑怃忤寤迕妩婺骛杌牾焐鹉鹜痦蜈鋈鼯'],
        ['Xi', '昔熙析西硒矽晰嘻吸锡牺稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细僖兮隰郗菥葸蓰奚唏徙饩阋浠淅屣嬉玺樨曦觋欷歙熹禊禧皙穸蜥螅蟋舄舾羲粞翕醯蹊鼷'],
        ['Xia', '瞎虾匣霞辖暇峡侠狭下厦夏吓呷狎遐瑕柙硖罅黠'],
        ['Xian', '掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线冼苋莶藓岘猃暹娴氙燹祆鹇痫蚬筅籼酰跣跹霰縣'],
        ['Xiang', '相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象芗葙饷庠骧缃蟓鲞飨'],
        ['Xiao', '萧硝霄削哮嚣销消宵淆晓小孝校肖啸笑效哓崤潇逍骁绡枭枵蛸筱箫魈'],
        ['Xie', '楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑偕亵勰燮薤撷獬廨渫瀣邂绁缬榭榍蹀躞'],
        ['Xin', '薪芯锌欣辛新忻心信衅囟馨昕歆镡鑫'],
        ['Xing', '星腥猩惺兴刑型形邢醒幸杏性姓陉荇荥擤饧悻硎'],
        ['Xiong', '兄凶胸匈汹雄熊芎'],
        ['Xiu', '休修羞朽嗅锈秀袖绣咻岫馐庥溴鸺貅髹'],
        ['Xu', '墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续诩勖圩蓿洫溆顼栩煦盱胥糈醑'],
        ['Xuan', '轩喧宣悬旋玄选癣眩绚儇谖萱揎泫渲漩璇楦暄炫煊碹铉镟痃'],
        ['Xue', '靴薛学穴雪血谑噱泶踅鳕'],
        ['Xun', '勋熏循旬询寻驯巡殉汛训讯逊迅巽郇埙荀荨蕈薰峋徇獯恂洵浔曛醺鲟'],
        ['Ya', '压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶伢垭揠岈迓娅琊桠氩砑睚痖'],
        ['Yan', '焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验厣赝剡俨偃兖谳郾鄢埏菸崦恹闫阏湮滟妍嫣琰檐晏胭焱罨筵酽趼魇餍鼹'],
        ['Yang', '殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾徉怏泱炀烊恙蛘鞅'],
        ['Yao', '邀腰妖瑶摇尧遥窑谣姚咬舀药要耀钥夭爻吆崾徭幺珧杳轺曜肴铫鹞窈鳐'],
        ['Ye', '椰噎耶爷野冶也页掖业叶曳腋夜液靥谒邺揶晔烨铘'],
        ['Yi', '一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎刈劓佚佾诒圯埸懿苡荑薏弈奕挹弋呓咦咿噫峄嶷猗饴怿怡悒漪迤驿缢殪轶贻欹旖熠眙钇镒镱痍瘗癔翊蜴舣羿'],
        ['Yin', '茵荫因殷音阴姻吟银淫寅饮尹引隐印胤鄞垠堙茚吲喑狺夤洇氤铟瘾窨蚓霪龈'],
        ['Ying', '英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映嬴郢茔莺萦蓥撄嘤膺滢潆瀛瑛璎楹媵鹦瘿颍罂'],
        ['Yo', '哟唷'],
        ['Yong', '拥佣臃痈庸雍踊蛹咏泳涌永恿勇用俑壅墉喁慵邕镛甬鳙饔'],
        ['You', '幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼卣攸侑莠莜莸尢呦囿宥柚猷牖铕疣蚰蚴蝣繇鱿黝鼬'],
        ['Yu', '迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉浴寓裕预豫驭禺毓伛俣谀谕萸蓣揄圄圉嵛狳饫馀庾阈鬻妪妤纡瑜昱觎腴欤於煜燠聿畲钰鹆鹬瘐瘀窬窳蜮蝓竽臾舁雩龉'],
        ['Yuan', '鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院垸塬芫掾沅媛瑗橼爰眢鸢螈箢鼋'],
        ['Yun', '耘云郧匀陨允运蕴酝晕韵孕郓芸狁恽愠纭韫殒昀氲熨'],
        ['Za', '匝砸杂咋拶咂'],
        ['Zai', '栽哉灾宰载再在崽甾'],
        ['Zan', '咱攒暂赞瓒昝簪糌趱錾'],
        ['Zang', '赃脏葬奘驵臧'],
        ['Zao', '遭糟凿藻枣早澡蚤躁噪造皂灶燥唣'],
        ['Ze', '责择则泽仄赜啧帻迮昃箦舴'],
        ['Zei', '贼'],
        ['Zen', '怎谮'],
        ['Zeng', '增憎赠缯甑罾锃'],
        ['Zha', '扎喳渣札轧铡闸眨栅榨乍炸诈柞揸吒咤哳楂砟痄蚱齄'],
        ['Zhan', '瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽谵搌旃'],
        ['Zhang', '樟章彰漳张掌涨杖丈帐账仗胀瘴障仉鄣幛嶂獐嫜璋蟑'],
        ['Zhao', '招昭找沼赵照罩兆肇召着诏棹钊笊'],
        ['Zhe', '遮折哲蛰辙者锗蔗这浙乇谪摺柘辄磔鹧褶蜇螫赭喆'],
        ['Zhen', '珍斟真甄砧臻贞针侦枕疹诊震振镇阵帧圳蓁浈缜桢榛轸赈胗朕祯畛稹鸩箴'],
        ['Zheng', '蒸挣睁征狰争怔整拯正政症郑证诤峥徵钲铮筝'],
        ['Zhi', '芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒卮陟郅埴芷摭帙忮彘咫骘栉枳栀桎轵轾贽胝膣祉黹雉鸷痣蛭絷酯跖踬踯豸觯'],
        ['Zhong', '中盅忠钟衷终种肿仲众冢锺螽舯踵'],
        ['Zhou', '舟周州洲诌粥轴肘帚咒皱宙昼骤荮啁妯纣绉胄碡籀酎'],
        ['Zhu', '珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑住注祝驻伫侏邾苎茱洙渚潴杼槠橥炷铢疰瘃竺箸舳翥躅麈'],
        ['Zhua', '抓爪'],
        ['Zhuai', '拽'],
        ['Zhuan', '专砖转撰赚篆啭馔颛'],
        ['Zhui', '椎锥追赘坠缀萑惴骓缒隹'],
        ['Zhun', '谆准肫窀'],
        ['Zhuo', '捉拙卓桌琢茁酌啄灼浊倬诼擢浞涿濯禚斫镯'],
        ['Zi', '兹咨资姿滋淄孜紫仔籽滓子自渍字谘呲嵫姊孳缁梓辎赀恣眦锱秭耔笫粢趑訾龇鲻髭'],
        ['Zong', '鬃棕踪宗综总纵偬腙粽'],
        ['Zou', '邹走奏揍诹陬鄹驺鲰'],
        ['Zu', '租足族祖诅阻组俎菹镞'],
        ['Zuan', '钻纂攥缵躜'],
        ['Zui', '嘴醉最罪蕞觜'],
        ['Zun', '尊遵撙樽鳟'],
        ['Zuo', '昨左佐做作坐座阼唑怍胙祚笮'],
        ['Ei', '诶'],
        ['Dia', '嗲'],
        ['Cen', '岑涔'],
        ['Nou', '耨']
    ],
    getSpellByChar: function(chars) {
        var tx = chars;
        if (!chars.charCodeAt(0) || chars.charCodeAt(0) < 1328) {
            return tx;
        } else {
            for (var i = 0; i < cnToSpell.spell.length; i++) {
                if (cnToSpell.spell[i][1].indexOf(chars) > -1) {
                    tx = cnToSpell.spell[i][0].toLowerCase();
                    break;
                }
            }
        }
        return tx;
    },
    getSpell: function(str) {
        var pStr = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i) == "\r") { //解决回车输入的Bug！！
                pStr += "\r";
                i++;
            } else {
                pStr += cnToSpell.getSpellByChar(str.charAt(i));
            }
        }
        return pStr;
    }
}

export default holly
