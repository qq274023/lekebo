/**
 * 
 * 项目类型：APP
 * 项目名称：浩阅免费小说
 * 项目抓包：打开我的 个人信息 账号id
 * 项目变量：lekebo_hyxs_Cookie
 * 项目定时：每40分钟运行一次
 * cron: 0 0,7 * * *
 * github仓库：https://github.com/
 * 
 * 交流Q群：104062430 作者:乐客播 欢迎前来提交bug   邀请码:TNESO
 */


//===============脚本版本=================//
let scriptVersion = "1.0.1";
let update_data = "完成签到，开宝箱，阅读等任务，提现未完成";
//=======================================//
const $ = new Env('浩阅免费小说');
const notify = $.isNode() ? require('./sendNotify') : '';
const Notify = 1 		//0为关闭通知,1为打开通知,默认为1
const {log} = console;
let scriptVersionLatest = "";
let UserCookie = ($.isNode() ? process.env.lekebo_hyxs_Cookie : $.getdata('lekebo_hyxs_Cookie')) || '';
let UserCookieArr = [];
let data = '';
let msg =``;
let isSign = false;
var timestamp = Math.round(new Date().getTime()).toString();
let host = 'ah2.zhangyue.com';
let hostname = 'https://' + host;
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
    await signin(2 * 1000);
    await $.wait(2000);
    await treasure(2 * 1000);
    await $.wait(2000);
    await taskList(2 * 1000);
    await $.wait(2000);
    await taskread(2 * 1000);
    await $.wait(2000);
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
            url: `${hostname}/zyapi/bookstore/user/mytab?zysid=eb8d2ccd7acc594be8531c67ef79d64a&usr=${ck[0]}&rgt=&p1=ZFtLE6LTYP0DAOkE14GMi5EA&pc=10&p2=319004&p3=17811671&p4=501671&p5=19&p6=&p7=__224a396f2fd550db&p9=3&p12=&p16=Redmi+Note+7+Pro&p21=31303&p22=10&p25=78116&p26=29&p28=662a978f6fd550db&p29=zyd70f8a&p30=__&p31=__8435aa57958f9749&p33=com.chaozh.cata.bkyd&currentPluginVersion=735`,
            headers: {
                Host: host,
                'User-Agent': getUA(),
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': '252',
            },
            body: `pluginVersion=37&usr=${ck[0]}&sign=cNqV51%2BTqSyQlGoHPeEx%2FJ%2BWzlmQTcSsWEUk8KrjZVJ4eqMnFR9Ii8tHs0dRriy6QUr8STib%2F9flSv%2FTaTRH0VcRJ%2Fi51N9v4yz440YqAoGODwBP1wQHUOm1kKJyAqM%2BGWA1R0zncu294LfEqhrXu60ZQrcbVn9GF%2F6YLXcJH1g%3D&timestamp=${timestamp}`,
        }
        //console.log(url)
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                //console.log(result)
                if (result.code == 0) {
                    DoubleLog(`\n 会员信息: ✅ ，${result.body.userInfo.nick} 余额：${result.body.goldCoinInfo.virtualCash}，今天收益：${result.body.goldCoinInfo.amountToday} 金币`)
                } else {
                    DoubleLog(`\n 会员信息: ❌ ，原因是：${result.msg}`)
                }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 签到
 * @param timeout
 * @returns {Promise<unknown>}
 */
function signin(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/zycl/sign/yushufang/sign?usr=${ck[0]}&p1=ZFtLE6LTYP0DAOkE14GMi5EA&p2=319004&p3=17811671&p4=501671&p5=19&p7=__224a396f2fd550db&p9=3&p16=Redmi+Note+7+Pro&p21=31303&p22=10&p25=78116&p26=29&p28=662a978f6fd550db&p29=zyd70f8a&p30=__&p31=__8435aa57958f9749&p33=com.chaozh.cata.bkyd&zysid=eb8d2ccd7acc594be8531c67ef79d64a&actId=qJN71nzjxE&date=0&signType=month`,
            headers: {
                Host: host,
                'accept': 'application/json',
                'User-Agent': getUA(),
                'content-type': 'application/x-www-form-urlencoded',
                'referer': `https://ah2.zhangyue.com/zycl/sign/index?zysid=eb8d2ccd7acc594be8531c67ef79d64a&usr=${ck[0]}&rgt=&p1=ZFtLE6LTYP0DAOkE14GMi5EA&pc=10&p2=319004&p3=17811671&p4=501671&p5=19&p6=&p7=__224a396f2fd550db&p9=3&p12=&p16=Redmi+Note+7+Pro&p21=31303&p22=10&p25=78116&p26=29&p28=662a978f6fd550db&p29=zyd70f8a&p30=__&p31=__8435aa57958f9749&p33=com.chaozh.cata.bkyd`,
            },
            //body: `pluginVersion=37&usr=${ck[0]}&sign=cNqV51%2BTqSyQlGoHPeEx%2FJ%2BWzlmQTcSsWEUk8KrjZVJ4eqMnFR9Ii8tHs0dRriy6QUr8STib%2F9flSv%2FTaTRH0VcRJ%2Fi51N9v4yz440YqAoGODwBP1wQHUOm1kKJyAqM%2BGWA1R0zncu294LfEqhrXu60ZQrcbVn9GF%2F6YLXcJH1g%3D&timestamp=${timestamp}`,
        }
        //console.log(url)
        $.post(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                //console.log(result)
                if (result.code == 0) {
                    //DoubleLog(`\n 会员信息: ✅ ，${result.body.userInfo.nick} 余额：${result.body.goldCoinInfo.virtualCash}，今天收益：${result.body.goldCoinInfo.amountToday} 金币`)
                } else {
                    DoubleLog(`\n 会员信息: ❌ ，原因是：${result.msg}`)
                }
            } catch (e) {
                DoubleLog(`\n 信息异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 查询任务
 * @param timeout
 * @returns {Promise<unknown>}
 */
function taskList(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/zybc/bookshelf/book?size=10&usr=dh225109236&sign=BxXS6s9SoF7X4y9t2oBq0FyU5o6zeYkKBkbQlGv8RMte4uribsyqhNhleLL%2BCyfWomzSQbEF3GY%2Bm3%2Fkp81AwbYV9XTkUeUSHDJ%2F8lZdd9NeH0V%2FfHKiAwumbTxuPiVX1KoY8RlP%2Fx6ISvNL1zSaWXpue%2F9a4kVvzfxJKDV%2Bb%2B0%3D&timestamp=1683706484204&zysid=eb8d2ccd7acc594be8531c67ef79d64a&usr=dh225109236&rgt=&p1=ZFtLE6LTYP0DAOkE14GMi5EA&pc=10&p2=319004&p3=17811671&p4=501671&p5=19&p6=&p7=__224a396f2fd550db&p9=3&p12=&p16=Redmi+Note+7+Pro&p21=31303&p22=10&p25=78116&p26=29&p28=662a978f6fd550db&p29=zyd70f8a&p30=__&p31=__8435aa57958f9749&p33=com.chaozh.cata.bkyd`,
            headers: {
                Host: host,
                'Connection': 'keep-alive',
                'User-Agent': getUA(),
                'accept-encoding': 'gzip',
            },
        }
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                //console.log(result)
                if (result.code == 0) {
                    DoubleLog(`\n 获取书籍: ✅ ，${result.body.list[0].name}`)
                    await taskSubmit(result.body.list[0].id,2 * 1000)
                    //console.log(result.body.list[0]) 
                    //lists = result.body.list
                    //for(i = 0; i < lists.length; i++){
                       // DoubleLog(`\n 查询任务: ✅ ，${lists[0].name}`) 
                        //await $.wait(2000);                 
                        //await taskSubmit(lists[i].id,2 * 1000)
                    //}
                } else {
                    DoubleLog(`\n 获取书籍: ❌ ，原因是：${result.msg}`)
                }
            } catch (e) {
                DoubleLog(`\n 书籍异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 执行阅读
 * @param timeout
 * @returns {Promise<unknown>}
 */
function taskSubmit(taskId,timeout = 2000) {
    return new Promise((resolve) => {
        haveTicket = 0
        maxWaitTime = 0
        let url = {
            url: `${hostname}/zytc/public/index.php?ca=Api.InnerOrder&bid=${taskId}&cp=1&rt=3&save_assets=0&zysid=eb8d2ccd7acc594be8531c67ef79d64a&usr=${ck[0]}&rgt=&p1=ZFtLE6LTYP0DAOkE14GMi5EA&pc=10&p2=319004&p3=17811671&p4=501671&p5=19&p6=&p7=__224a396f2fd550db&p9=3&p12=&p16=Redmi+Note+7+Pro&p21=31399&p22=10&p25=78116&p26=29&p28=662a978f6fd550db&p29=zyd70f8a&p30=__&p31=__8435aa57958f9749&p33=com.chaozh.cata.bkyd`,
            headers: {
                Host: host,
                'Connection': 'keep-alive',
                'User-Agent': getUA(),
                'accept-encoding': 'gzip',
            },
        }
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                //console.log(result)
                if (result.Data.DownloadInfo.ChapterId > 0) {
                    DoubleLog(`\n 执行阅读: ✅ ，${result.Data.DownloadInfo.BookName} ${result.Data.DownloadInfo.ChapterName}`)
                    for (var i = 1; i <= 100; i++) {
                        chapterId = result.Data.DownloadInfo.ChapterId + i
                        await submitbook(taskId,chapterId,2 * 1000)
                        //console.log(chapterId)
                        await $.wait(10000);
                    }
                } else {
                    DoubleLog(`\n 执行阅读: ❌ ，该书籍已经没有章数。`)
                }
            } catch (e) {
                DoubleLog(`\n 阅读异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 执行信息
 * @param timeout
 * @returns {Promise<unknown>}
 */
function submitbook(taskId,chapterId,timeout = 2000) {
    return new Promise((resolve) => {
        haveTicket = 0
        maxWaitTime = 0
        let url = {
            url: `${hostname}/zytc/public/index.php?ca=Api.InnerOrder&bid=${taskId}&cp=${chapterId}&rt=3&save_assets=0&zysid=eb8d2ccd7acc594be8531c67ef79d64a&usr=${ck[0]}&rgt=&p1=ZFtLE6LTYP0DAOkE14GMi5EA&pc=10&p2=319004&p3=17811671&p4=501671&p5=19&p6=&p7=__224a396f2fd550db&p9=3&p12=&p16=Redmi+Note+7+Pro&p21=31399&p22=10&p25=78116&p26=29&p28=662a978f6fd550db&p29=zyd70f8a&p30=__&p31=__8435aa57958f9749&p33=com.chaozh.cata.bkyd`,
            headers: {
                Host: host,
                'Connection': 'keep-alive',
                'User-Agent': getUA(),
                'accept-encoding': 'gzip',
            },
        }
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                //console.log(result)
                if (result.Data.DownloadInfo.ChapterId > 0) {
                    DoubleLog(`\n 阅读书籍: ✅ ，${result.Data.DownloadInfo.BookName} ${result.Data.DownloadInfo.ChapterName}`)
                } else {
                    DoubleLog(`\n 阅读书籍: ❌ ，该书籍已经没有章数。`)
                }
            } catch (e) {
                DoubleLog(`\n 阅读异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 执行信息
 * @param timeout
 * @returns {Promise<unknown>}
 */
function taskread(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/zycp/task/read?pluginVersion=22&usr=${ck[0]}&sign=fptdnC1TodGtJFuOwy0eDsxl5iqyqjo6ZzbBbYF0BXlte9sMYedS0hRzBNXdO4Wj5M8HutX4kCpjgPG4uMaf4NsxxQG3Bk3LgNaJvHbr6Fhzc3Ysw%2BZ%2B4MS6PKJArs2ZnxviXfSZPnDl2DJhmjVB1DEicJtIRQrvVljDMZdjWn0%3D&timestamp=1683707282561&zysid=eb8d2ccd7acc594be8531c67ef79d64a&usr=dh225109236&rgt=&p1=ZFtLE6LTYP0DAOkE14GMi5EA&pc=10&p2=319004&p3=17811671&p4=501671&p5=19&p6=&p7=__224a396f2fd550db&p9=3&p12=&p16=Redmi+Note+7+Pro&p21=31399&p22=10&p25=78116&p26=29&p28=662a978f6fd550db&p29=zyd70f8a&p30=__&p31=__8435aa57958f9749&p33=com.chaozh.cata.bkyd`,
            headers: {
                Host: host,
                'Connection': 'keep-alive',
                'User-Agent': getUA(),
                'accept-encoding': 'gzip',
            },
        }
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                //console.log(result)
                if (result.code == 0) {
                    lists = result.body.readTask
                    for(i = 0; i < lists.length; i++){
                        if (lists[i].isReWarded == true) {
                            DoubleLog(`\n 阅读时长: ✅ ，已经阅读 ${lists[i].progressTo} 分钟`)
                        }               
                    }
                } else {
                    DoubleLog(`\n 阅读时长: ❌ ，原因是：${result.msg}`)
                }
            } catch (e) {
                DoubleLog(`\n 阅读异常: ❌ ，${response}`)
            } finally {
                resolve();
            }
        }, timeout)
    })
}
/**
 * 执行信息
 * @param timeout
 * @returns {Promise<unknown>}
 */
function treasure(timeout = 2000) {
    return new Promise((resolve) => {
        let url = {
            url: `${hostname}/zycl/sign/v2/treasure/donate?usr=${ck[0]}&p1=ZFtLE6LTYP0DAOkE14GMi5EA&p2=319004&p3=17811671&p4=501671&p5=19&p7=__224a396f2fd550db&p9=3&p16=Redmi+Note+7+Pro&p21=31303&p22=10&p25=78116&p26=29&p28=662a978f6fd550db&p29=zyd70f8a&p30=__&p31=__8435aa57958f9749&p33=com.chaozh.cata.bkyd&activityId=100295&zysid=eb8d2ccd7acc594be8531c67ef79d64a&zysign=GFSV3QXCTD%2F2hRXLTNmSW7bMAEusisgJRuSteLVvYnRuvbglQB75vFgpTQ1RGOac5OXL4Spm424tqRbrfZv8bRgDVXXOixyxcSFQqbc6zWMmoxUTVTKMJPNkVUca1Jow3a5LU58itGZYO75Wfh%2FQRLHjkzX0UisioiElo7tQ3oE%3D`,
            headers: {
                Host: host,
                'Connection': 'keep-alive',
                'User-Agent': getUA(),
                'accept-encoding': 'gzip',
            },
        }
        $.get(url, async (error, response, data) => {
            try {
                let result = JSON.parse(data);
                //console.log(result)
                if (result.code == 0) {
                    DoubleLog(`\n 执行宝箱: ✅ ，已经阅读 ${lists[i].progressTo} 分钟`)
                } else {
                    DoubleLog(`\n 执行宝箱: ❌ ，原因是：${result.msg}`)
                }
            } catch (e) {
                DoubleLog(`\n 宝箱异常: ❌ ，${response}`)
            } finally {
                resolve();
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
        console.log(`\n 乐客播提示：系统变量未填写 lekebo_hyxs_Cookie`)
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
/**
 * 随机延时1-30s，避免大家运行时间一样
 * @returns {*|number}
 */
function delay() {
    let time = parseInt(Math.random() * 100000);
    if (time > 30000) {// 大于30s重新生成
        return delay();
    } else {
        console.log('随机延时：', `${time}ms, 避免大家运行时间一样`)
        return time;// 小于30s，返回
    }
}
function dealToken(tokenStr, tokenKeyStr) {
    let scriptToken, scriptKey;
    scriptToken = DealScriptStr(tokenStr);
    scriptKey = DealScriptStr(tokenKeyStr);
    let tdom = new JSDOM(
        `<script>${scriptToken}</script><script>${scriptKey}</script>`,
        {
            runScripts: 'dangerously'
        }
    )
    let str = scriptKey;
    var babelStr;
    str = str.replaceAll(/eval/g, 'var babelStr=');
    str = str.replaceAll(/\\u0065\\u0076\\u0061\\u006c/g, 'var babelStr=')
    eval(str);
    eval(babelStr);
    let ast = parser.parse(babelStr);
    let funcStr = ast.program.body[0].id.name;
 let res = tdom.window[funcStr]();
    tdom.window.close();
    //console.log(window['pf8b6b']);
    return res;
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
function timestampS(){
    return Date.parse(new Date())/1000;
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
            url: `https://ghproxy.com/https://raw.githubusercontent.com/qq274023/lekebo/master/lekebo_hyxsyd.js`,
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

// md5
function MD5Encrypt(a) { function b(a, b) { return a << b | a >>> 32 - b } function c(a, b) { var c, d, e, f, g; return e = 2147483648 & a, f = 2147483648 & b, c = 1073741824 & a, d = 1073741824 & b, g = (1073741823 & a) + (1073741823 & b), c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f } function d(a, b, c) { return a & b | ~a & c } function e(a, b, c) { return a & c | b & ~c } function f(a, b, c) { return a ^ b ^ c } function g(a, b, c) { return b ^ (a | ~c) } function h(a, e, f, g, h, i, j) { return a = c(a, c(c(d(e, f, g), h), j)), c(b(a, i), e) } function i(a, d, f, g, h, i, j) { return a = c(a, c(c(e(d, f, g), h), j)), c(b(a, i), d) } function j(a, d, e, g, h, i, j) { return a = c(a, c(c(f(d, e, g), h), j)), c(b(a, i), d) } function k(a, d, e, f, h, i, j) { return a = c(a, c(c(g(d, e, f), h), j)), c(b(a, i), d) } function l(a) { for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | a.charCodeAt(i) << h, i++; return b = (i - i % 4) / 4, h = i % 4 * 8, g[b] = g[b] | 128 << h, g[f - 2] = c << 3, g[f - 1] = c >>> 29, g } function m(a) { var b, c, d = "", e = ""; for (c = 0; 3 >= c; c++)b = a >>> 8 * c & 255, e = "0" + b.toString(16), d += e.substr(e.length - 2, 2); return d } function n(a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", c = 0; c < a.length; c++) { var d = a.charCodeAt(c); 128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128)) } return b } var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21; for (a = n(a), x = l(a), t = 1732584193, u = 4023233417, v = 2562383102, w = 271733878, o = 0; o < x.length; o += 16)p = t, q = u, r = v, s = w, t = h(t, u, v, w, x[o + 0], y, 3614090360), w = h(w, t, u, v, x[o + 1], z, 3905402710), v = h(v, w, t, u, x[o + 2], A, 606105819), u = h(u, v, w, t, x[o + 3], B, 3250441966), t = h(t, u, v, w, x[o + 4], y, 4118548399), w = h(w, t, u, v, x[o + 5], z, 1200080426), v = h(v, w, t, u, x[o + 6], A, 2821735955), u = h(u, v, w, t, x[o + 7], B, 4249261313), t = h(t, u, v, w, x[o + 8], y, 1770035416), w = h(w, t, u, v, x[o + 9], z, 2336552879), v = h(v, w, t, u, x[o + 10], A, 4294925233), u = h(u, v, w, t, x[o + 11], B, 2304563134), t = h(t, u, v, w, x[o + 12], y, 1804603682), w = h(w, t, u, v, x[o + 13], z, 4254626195), v = h(v, w, t, u, x[o + 14], A, 2792965006), u = h(u, v, w, t, x[o + 15], B, 1236535329), t = i(t, u, v, w, x[o + 1], C, 4129170786), w = i(w, t, u, v, x[o + 6], D, 3225465664), v = i(v, w, t, u, x[o + 11], E, 643717713), u = i(u, v, w, t, x[o + 0], F, 3921069994), t = i(t, u, v, w, x[o + 5], C, 3593408605), w = i(w, t, u, v, x[o + 10], D, 38016083), v = i(v, w, t, u, x[o + 15], E, 3634488961), u = i(u, v, w, t, x[o + 4], F, 3889429448), t = i(t, u, v, w, x[o + 9], C, 568446438), w = i(w, t, u, v, x[o + 14], D, 3275163606), v = i(v, w, t, u, x[o + 3], E, 4107603335), u = i(u, v, w, t, x[o + 8], F, 1163531501), t = i(t, u, v, w, x[o + 13], C, 2850285829), w = i(w, t, u, v, x[o + 2], D, 4243563512), v = i(v, w, t, u, x[o + 7], E, 1735328473), u = i(u, v, w, t, x[o + 12], F, 2368359562), t = j(t, u, v, w, x[o + 5], G, 4294588738), w = j(w, t, u, v, x[o + 8], H, 2272392833), v = j(v, w, t, u, x[o + 11], I, 1839030562), u = j(u, v, w, t, x[o + 14], J, 4259657740), t = j(t, u, v, w, x[o + 1], G, 2763975236), w = j(w, t, u, v, x[o + 4], H, 1272893353), v = j(v, w, t, u, x[o + 7], I, 4139469664), u = j(u, v, w, t, x[o + 10], J, 3200236656), t = j(t, u, v, w, x[o + 13], G, 681279174), w = j(w, t, u, v, x[o + 0], H, 3936430074), v = j(v, w, t, u, x[o + 3], I, 3572445317), u = j(u, v, w, t, x[o + 6], J, 76029189), t = j(t, u, v, w, x[o + 9], G, 3654602809), w = j(w, t, u, v, x[o + 12], H, 3873151461), v = j(v, w, t, u, x[o + 15], I, 530742520), u = j(u, v, w, t, x[o + 2], J, 3299628645), t = k(t, u, v, w, x[o + 0], K, 4096336452), w = k(w, t, u, v, x[o + 7], L, 1126891415), v = k(v, w, t, u, x[o + 14], M, 2878612391), u = k(u, v, w, t, x[o + 5], N, 4237533241), t = k(t, u, v, w, x[o + 12], K, 1700485571), w = k(w, t, u, v, x[o + 3], L, 2399980690), v = k(v, w, t, u, x[o + 10], M, 4293915773), u = k(u, v, w, t, x[o + 1], N, 2240044497), t = k(t, u, v, w, x[o + 8], K, 1873313359), w = k(w, t, u, v, x[o + 15], L, 4264355552), v = k(v, w, t, u, x[o + 6], M, 2734768916), u = k(u, v, w, t, x[o + 13], N, 1309151649), t = k(t, u, v, w, x[o + 4], K, 4149444226), w = k(w, t, u, v, x[o + 11], L, 3174756917), v = k(v, w, t, u, x[o + 2], M, 718787259), u = k(u, v, w, t, x[o + 9], N, 3951481745), t = c(t, p), u = c(u, q), v = c(v, r), w = c(w, s); var O = m(t) + m(u) + m(v) + m(w); return O.toLowerCase() }
// 完整 Env
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
