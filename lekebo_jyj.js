/**
 * 
 * 项目类型：微信小程序
 * 项目名称：劲友家
 * 项目抓包：抓mall.gacmotor.com下的Authorization：XXXXXX填入变量
 * 项目变量：lekebo_jyj_Cookie
 * 项目定时：一天运行一次自行设置
 * cron: 0 40 0 * * *
 * github仓库：https://github.com/qq274023/lekebo
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug
 */
const $ = new Env('劲友家');
const notify = $.isNode() ? require('./sendNotify') : '';
//===============脚本版本=================//
let scriptVersion = "1.0.1";
let update_data = "完成签到，浏览视频，二手市场，校园头条任务";
//=======================================//
const axios = require('axios');
let request = require("request");
request = request.defaults({jar: true});
const {log} = console;
const Notify = 1; //0为关闭通知，1为打开通知,默认为1
const debug = 0; //0为关闭调试，1为打开调试,默认为0
let UserCookie = ($.isNode() ? process.env.lekebo_jyj_Cookie : $.getdata("lekebo_jyj_Cookie")) || ""
let UserCookieArr = [];
let times = timestampS(13);
var hours = new Date().getMonth() + 1;
let data = '';
let msg = '';
//=======================================//
!(async () => {
    if (typeof $request !== "undefined") {
        await GetRewrite();
    } else {
        if (!(await Envs())){
            return;
        } else {
            DoubleLog(`\n 交流Q群：104062430 作者:乐客播 欢迎前来提交bug`)
            await getVersion();
            DoubleLog(`\n================ 共找到 ${UserCookieArr.length} 个账号 ================ \n 脚本执行✌北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000).toLocaleString()} \n================ 版本对比检查更新 ================`);          
            if (scriptVersionLatest != scriptVersion) {
                DoubleLog(`\n 当前版本：${scriptVersion}`)
                DoubleLog(`\n 最新版本：${scriptVersionLatest}`)
                DoubleLog(`\n 更新信息：${update_data}`)
            } else {
                DoubleLog(`\n 版本信息：${scriptVersion} ，已是最新版本无需更新开始执行脚本`)
            }
            for (let index = 0; index < UserCookieArr.length; index++) {
                let num = index + 1
                DoubleLog(`\n================ 开始第 ${num} 个账号 ================`)
                ck = UserCookieArr[index].split("&");
                await start();
                //await getSignMonth();
            }
            await SendMsg(msg);
        }
    }
})()
    .catch((e) => log(e))
    .finally(() => $.done())


/**
 * 获取基础信息
 * @returns {Promise<boolean>}
 */
async function start() {
    await getMemberInfo(2 * 1000);
    await $.wait(2000);
    await getMemberScore();
    await getSignMonth();
    await tasklist();
    await exciteMoment();
    await extractTurntableGoods();
    await springScene();
    return true;
}
/**
 * 查询会员信息
 * @param timeout
 * @returns {Promise<unknown>}
 */
function getMemberInfo(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://jjw.jingjiu.com/app-jingyoujia/app/jingyoujia/customer/detail`,
            headers: {
                'Host': 'jjw.jingjiu.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': getUA(),
                'appId': 'wx10bc773e0851aedd',
                'Authorization': ck[0],
                'Content-Type': 'application/json',
                'Referer': 'https://servicewechat.com/wx10bc773e0851aedd/446/page-frame.html',
                'Accept-Language':' en-us,en',
                'Accept-Encoding': 'gzip, deflate',
            },
        }
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.code == "200") {
                    mobile = result.data.mobile
                    userCname = result.data.nickName
                    if (mobile > 0) {
                        DoubleLog(`\n 登录成功: ✅ ，获取【${mobile}】会员信息成功`)
                    } else {
                        DoubleLog(`\n 登录成功: ✅ ，获取【${userCname}】会员信息成功`)
                    }
                } else {
                    DoubleLog(`\n 登录失败: ❌ ，原因是：${data}`)
                }
            } catch (e) {
                DoubleLog(`查询会员信息异常：${data}，原因：${e}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 获取会员积分
 * @returns {Promise<unknown>}
 */
async function getMemberScore(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://jjw.jingjiu.com/app-jingyoujia/app/jingyoujia/customer/queryCustIntegral`,
            headers: {
                'Host': 'jjw.jingjiu.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': getUA(),
                'appId': 'wx10bc773e0851aedd',
                'Authorization': ck[0],
                'Content-Type': 'application/json',
                'Referer': 'https://servicewechat.com/wx10bc773e0851aedd/446/page-frame.html',
                'Accept-Language':' en-us,en',
                'Accept-Encoding': 'gzip, deflate',
            },
        }
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.code == "200") {
                    DoubleLog(`\n 当前积分：${result.data}`)
                } else {
                    DoubleLog(`\n 登录失败: ❌ ，原因是：${data}`)
                }
            } catch (e) {
                DoubleLog(`查询会员信息异常：${data}，原因：${e}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 获取签到天数
 * @returns {Promise<unknown>}
 */
async function getSignMonth(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://jjw.jingjiu.com/app-jingyoujia/app/jingyoujia/noBasic/dateSignMonthResult?month=${hours}`,
            headers: {
                'Host': 'jjw.jingjiu.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': getUA(),
                'appId': 'wx10bc773e0851aedd',
                'Authorization': ck[0],
                'Content-Type': 'application/json',
                'Referer': 'https://servicewechat.com/wx10bc773e0851aedd/446/page-frame.html',
                'Accept-Language':' en-us,en',
                'Accept-Encoding': 'gzip, deflate',
            },
        }
        //console.log(url)
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                if (result.code == "200") {
                    DoubleLog(`\n 连续签到：${result.data.punchDay} 天`)
                } else {
                    DoubleLog(`\n 登录失败: ❌ ，原因是：${data}`)
                }
            } catch (e) {
                DoubleLog(`查询会员信息异常：${data}，原因：${e}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
async function tasklist(timeout = 0) {
    return new Promise((resolve) => {
        var url = {
            url: 'https://jjw.jingjiu.com/app-jingyoujia/app/jingyoujia/task/queryUserTaskList',
            headers: {
                'Host': 'jjw.jingjiu.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': getUA(),
                'appId': 'wx10bc773e0851aedd',
                'Authorization': ck[0],
                'Content-Type': 'application/json',
                'Referer': 'https://servicewechat.com/wx10bc773e0851aedd/446/page-frame.html',
                'Accept-Language':' en-us,en',
                'Accept-Encoding': 'gzip, deflate',
            },
        };
        $.get(url, async (err, resp, data) => {
            try {
                //console.log(data)
                result = JSON.parse(data);
                if (result.code == "200") {
                    for (let task of result['data']['basicList']) {
                        if (task['taskTitle'] == "签到奖励" && task["id"] < 100) {
                            await signIn(5);
                        } else if (task['taskTitle'] == "健康打卡" && task["id"] < 100) {
                            //await exciteMoment();
                        }
                    }
                } else if (result.code == "500") {
                    DoubleLog(`\n 签到失败: ❌ ，服务器错误。`)
                } else {
                    DoubleLog(`\n 签到失败: ❌ ，${result.msg}`)
                }
            } catch (e) {
            } finally {
                resolve()//这里处理正确返回
            }
        }, timeout)
    })
}

async function signIn(taskId ,timeout = 0) {
    return new Promise((resolve) => {
        var options = {
            method: 'POST',
            url: 'https://jjw.jingjiu.com/app-jingyoujia/app/jingyoujia/taskContinuousRecord',
            headers: {
                'Host': 'jjw.jingjiu.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': getUA(),
                'appId': 'wx10bc773e0851aedd',
                'Authorization': ck[0],
                'Content-Type': 'application/json',
                'Referer': 'https://servicewechat.com/wx10bc773e0851aedd/419/page-frame.html',
                'Accept-Language':' en-us,en',
                'Accept-Encoding': 'gzip, deflate',
            },
            data: {"taskId":taskId}
        };
        axios.request(options).then(async function(response) {
            try {
                result = response.data;
                if (result.code == "200") {
                    console.log(`\n 签到成功: ✅ ，获得 ${result['data']['integral']} 金币`);
                } else if (result.code == "500") {
                    DoubleLog(`\n 签到失败: ❌ ，${result.msg}`)
                } else {
                    DoubleLog(`\n 签到失败: ❌ ，${result.msg}`)
                }
            } catch (e) {
                DoubleLog(`\n 签到失败: ❌ ，${data}，原因：${e}`)
            } finally {
                resolve()//这里处理正确返回
            }
        }, timeout)
    })
}


async function exciteMoment(timeout = 0) {
    return new Promise((resolve) => {
        var options = {
            method: 'POST',
            url: 'https://jjw.jingjiu.com/app-jingyoujia/app/jingyoujia/ugc/exciteMoment',
            headers: {
                'Host': 'jjw.jingjiu.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json, text/plain, */*',
                'xweb_xhr': 1,
                'User-Agent': getUA(),
                'appId': 'wx10bc773e0851aedd',
                'Authorization': ck[0],
                'Content-Type': 'application/json',
                'Referer': 'https://servicewechat.com/wx10bc773e0851aedd/419/page-frame.html',
                'Accept-Language':' en-us,en',
                'Accept-Encoding': 'gzip, deflate',
            },
            data: {"content":"劲酒好喝 我爱喝 好喝 好喝 好喝","imgList":["https://jjw-oss.jingjiu.com/jingyoujia/2023/01/29/1674978128059113.png"]}
        };
        axios.request(options).then(async function(response) {
            try {
                result = response.data;
                if (result.code == "200") {
                    console.log(`\n 发贴成功: ✅ ，获得 ${result['rows']['integral']} 金币`);
                } else if (result.code == "500") {
                    DoubleLog(`\n 发贴失败: ❌ ，${result.msg}`)
                } else {
                    DoubleLog(`\n 发贴失败: ❌ ，${result.msg}`)
                }
            } catch (e) {
                DoubleLog(`\n 发贴失败: ❌ ，${data}，原因：${e}`)
            } finally {
                resolve()//这里处理正确返回
            }
        }, timeout)
    })
}

async function extractTurntableGoods(timeout = 0) {
    return new Promise((resolve) => {
        var options = {
            method: 'POST',
            url: 'https://jjw.jingjiu.com/app-jingyoujia/app/jingyoujia/taskHallTurntable/extractTurntableGoods',
            headers: {
                'Host': 'jjw.jingjiu.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json, text/plain, */*',
                'xweb_xhr': 1,
                'User-Agent': getUA(),
                'appId': 'wx10bc773e0851aedd',
                'Authorization': ck[0],
                'Content-Type': 'application/json',
                'Referer': 'https://servicewechat.com/wx10bc773e0851aedd/419/page-frame.html',
                'Accept-Language':' en-us,en',
                'Accept-Encoding': 'gzip, deflate',
            },
            data: {"activityId":3}
        };
        axios.request(options).then(async function(response) {
            try {
                //console.log(response)
                result = response.data;
                if (result.code == "200") {
                    console.log(`\n 任务信息: ✅ ，获得 ${result['rows']['integral']} 金币`);
                } else if (result.code == "500") {
                    DoubleLog(`\n 任务信息: ❌ ，${result.msg}`)
                } else {
                    DoubleLog(`\n 任务信息: ❌ ，${result.msg}`)
                }
            } catch (e) {
                DoubleLog(`\n 任务信息: ❌ ，${data.message}，原因：${e}`)
            } finally {
                resolve()//这里处理正确返回
            }
        }, timeout)
    })
}

async function springScene(timeout = 0) {
    return new Promise((resolve) => {
        var options = {
            method: 'POST',
            url: 'https://jjw.jingjiu.com/app-jingyoujia/business/springPunch/springScene',
            headers: {
                'Host': 'jjw.jingjiu.com',
                'Connection': 'keep-alive',
                'Accept': 'application/json, text/plain, */*',
                'xweb_xhr': 1,
                'User-Agent': getUA(),
                'appId': 'wx10bc773e0851aedd',
                'Authorization': ck[0],
                'Content-Type': 'application/json',
                'Referer': 'https://servicewechat.com/wx10bc773e0851aedd/446/page-frame.html',
                'Accept-Language':' en-us,en',
                'Accept-Encoding': 'gzip, deflate',
            },
            data: {"templeFairType":"22","image":"https://jjxcx.oss-cn-shanghai.aliyuncs.com/jingyoujia/images/pages/activity/spring-ascend/out/new-poster2.jpg","activityType":"NEW_SPRING","latitude":21.93854,"longitude":108.6569}
        };
        axios.request(options).then(async function(response) {
            try {
                result = response.data;
                if (result.code == "200") {
                    if (result.data.recordValue > 0) {
                        console.log(`\n 劲补能量: ✅ ，获得 ${result['data']['recordValue']} 能量`);
                    } else {
                        DoubleLog(`\n 劲补能量: ❌ ，该任务已经完成。`)
                    }
                } else if (result.code == "500") {
                    DoubleLog(`\n 劲补能量: ❌ ，今天已经发布过了`)
                } else {
                    DoubleLog(`\n 劲补能量: ❌ ，${result.msg}`)
                }
            } catch (e) {
                DoubleLog(`\n 劲补能量: ❌ ，${data.message}，原因：${e}`)
            } finally {
                resolve()//这里处理正确返回
            }
        }, timeout)
    })
}


// ============================================重写============================================ \\
async function GetRewrite() {
    if ($request.url.indexOf("member/api/info/?userKeys=v1.0&pageName=member-info-index-search&formName=searchForm&kwwMember.memberId") > -1) {
        let ck = '';
        let theRequest = new Object();
        if ($request.url.indexOf("?") != -1) {
            let info = $request.url.split('?');
            let strs = info[1].split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
            ck = theRequest.memberId;
        }
        if (kwwUid) {
            if (memberId.indexOf(ck) == -1) {
                memberId = memberId + "@" + ck;
                $.setdata(memberId, "kwwUid");
                List = memberId.split("@");
                $.msg(`【${$.name}】` + ` 获取第${memberId.length}个 ck 成功: ${ck} ,不用请自行关闭重写!`);
            }
        } else {
            $.setdata(ck, "memberId");
            $.msg(`【${$.name}】` + ` 获取第1个 ck 成功: ${ck} ,不用请自行关闭重写!`);
        }
    }
}
// ============================================变量检查============================================ \\
async function Envs() {
    if (UserCookie) {
        if (UserCookie.indexOf("@") != -1) {
            UserCookie.split("@").forEach((item) => {
                UserCookieArr.push(item);
            });
        } else if (UserCookie.indexOf("\n") != -1) {
            UserCookie.split("\n").forEach((item) => {
                UserCookieArr.push(item);
            });
        } else {
            UserCookieArr.push(UserCookie);
        }
    } else {
        console.log(`\n 乐客播提示：系统变量未填写 lekebo_jyj_Cookie`)
        return;
    }
    return true;
}
// ============================================发送消息============================================ \\
async function SendMsg(message) {
    if (!message)
        return;

    if (Notify > 0) {
        if ($.isNode()) {
            var notify = require('./sendNotify');
            await notify.sendNotify($.name, message);
        } else {
            $.msg(message);
        }
    } else {
        log(message);
    }
}
/**
 * 添加消息
 * @param str
 * @param is_log
 */
function addNotifyStr(str, is_log = true) {
    if (is_log) {
        log(`${str}\n`)
    }
    msg += `${str}\n`
}
/**
 * 双平台log输出
 */
function DoubleLog(data) {
	if ($.isNode()) {
		if (data) {
			console.log(`${data}`);
			msg += `${data}`;
		}
	} else {
		console.log(`${data}`);
		msg += `${data}`;
	}
}
function randomNum(min, max) {
	if (arguments.length === 0) return Math.random()
	if (!max) max = 10 ** (Math.log(min) * Math.LOG10E + 1 | 0) - 1
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function DealScriptStr(str) {
    str = str.replace(/\/\*.*?\*\//g, ' ');
    str = str.replace(/\b0(\d+)/g, '0o$1');
    return str;
}
/**
 * 随机UA
 * @param inputString
 * @returns {*}
 */
function getUA() {
	$.UUID = randomString(40)
	const buildMap = {
		"167814": `10.1.4`,
		"167841": `10.1.6`,
		"167853": `10.2.0`
	}
	$.osVersion = `${randomNum(13, 14)}.${randomNum(3, 6)}.${randomNum(1, 3)}`
	let network = `network/${['4g', '5g', 'wifi'][randomNum(0, 2)]}`
	$.mobile = `iPhone${randomNum(9, 13)},${randomNum(1, 3)}`
	$.build = ["167814", "167841", "167853"][randomNum(0, 2)]
	$.appVersion = buildMap[$.build]
	return `jdapp;iPhone;${$.appVersion};${$.osVersion};${$.UUID};M/5.0;${network};ADID/;model/${$.mobile};addressid/;appBuild/${$.build};jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS ${$.osVersion.replace(/\./g, "_")} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
}

/**
 * 获取当前小时数
 */
function local_hours() {
    let myDate = new Date();
    let h = myDate.getHours();
    return h;
}

/**
 * 获取当前分钟数
 */
function local_minutes() {
    let myDate = new Date();
    let m = myDate.getMinutes();
    return m;
}

/**
 * 随机数生成
 */
function randomString(e) {
    e = e || 32;
    var t = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

/**
 * 随机整数生成
 */
function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

/**
 * 获取毫秒时间戳
 */
function timestampMs(){
    return new Date().getTime();
}

/**
 *
 * 获取秒时间戳
 */
function timestampS(times){
    if (times == 10) {
        let getTimes = Math["round"](new Date()["getTime"]() / 1000)['toString']();
        return getTimes;
    } else {
        let getTime = new Date()["getTime"]();
        return getTime;
    }
}


/**
 * 修改配置文件
 */
function modify() {
    fs.readFile('/ql/data/config/config.sh','utf8',function(err,dataStr){
        if(err){
            return log('读取文件失败！'+err)
        }
        else {
            var result = dataStr.replace(/regular/g,string);
            fs.writeFile('/ql/data/config/config.sh', result, 'utf8', function (err) {
                if (err) {return log(err);}
            });
        }
    })
}

/**
 * 获取远程版本
 */
function getVersion(timeout = 3 * 1000) {
    return new Promise((resolve) => {
        let url = {
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_jyj.js`,
        }
        $.get(url, async (err, resp, data) => {
            try {
                scriptVersionLatest = data.match(/scriptVersion = "([\d\.]+)"/)[1]
                update_data = data.match(/update_data = "(.*?)"/)[1]
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve()
            }
        }, timeout)
    })
}

/**
 * time 输出格式：1970-01-01 00:00:00
 */
function t() {
    var date = new Date();
    // 获取当前月份
    var nowMonth = date.getMonth() + 1;
    // 获取当前是几号
    var strDate = date.getDate();
    //获取当前小时（0-23）
    var nowhour = date.getHours()
    //获取当前分钟（0-59）
    var nowMinute = date.getMinutes()
    //获取当前秒数(0-59)
    var nowSecond = date.getSeconds();
    // 添加分隔符“-”
    var seperator = "-";
    // 添加分隔符“:”
    var seperator1 = ":";
    // 对月份进行处理，1-9月在前面添加一个“0”
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
    }
    // 对月份进行处理，1-9号在前面添加一个“0”
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    // 对小时进行处理，0-9号在前面添加一个“0”
    if (nowhour >= 0 && nowhour <= 9) {
        nowhour = "0" + nowhour;
    }
    // 对分钟进行处理，0-9号在前面添加一个“0”
    if (nowMinute >= 0 && nowMinute <= 9) {
        nowMinute = "0" + nowMinute;
    }
    // 对秒数进行处理，0-9号在前面添加一个“0”
    if (nowSecond >= 0 && nowSecond <= 9) {
        nowSecond = "0" + nowSecond;
    }

    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate + ` ` + nowhour + seperator1 + nowMinute + seperator1 + nowSecond
    return nowDate
}


// md5
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
