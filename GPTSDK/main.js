var version = "1.3.5 (288a_01)"; // 版本设置
var openversion = false;
document.writeln("<title>GPTSDK " + version + "</title>"); // 页面标题
// 输入密钥
if (openversion) {
	// 输入密钥
	var key = "000000";
} else {
	if (localStorage.getItem("key") == null) {
		var key = window.prompt("[内部版本] 请输入密钥：");
		localStorage.setItem("key", key, 30);
		localStorage.setItem("alert", "true", 30);
		localStorage.setItem("api", "https://capi1.fenserver.cn/gpt.php", 30);
		alert(
			"已经自动为您添加密钥至 Cookie 中！30天后自动失效。\n如需要提前失效或更换密钥可进入菜单中“安全”页面进行设置。\n默认为 FensGPT-3 服务器，可进入菜单中“安全”页面进行设置。"
		);
	} else {
		var key = localStorage.getItem("key");
		if (localStorage.getItem("alert") == "true") {
			alert(
				"已经自动为您使用现有密钥，如需更换请进入菜单中“安全”页面进行设置。\n如需关闭此弹窗，可进入菜单中“提醒”页面进行设置。"
			);
		}
	}
	if (localStorage.getItem("font") == null) {
		localStorage.setItem("font", "'Microsoft Jhenghei'");
	}
}
function clearCookie() {
	localStorage.setItem("key", null);
	localStorage.setItem("api", null);
	localStorage.setItem("alert", null);
	alert("清理完成！");
}
document.getElementById("head").innerHTML =
	document.getElementById("head").innerHTML +
	"<style>*{font-family: " +
	localStorage.getItem("font") +
	";}</style>";

function requestAI(questions) {
	// 请求部分
	result = "<font color='red'>[错误] Ajax 请求过程中出现问题。</font>";
	$.ajax({
		url: localStorage.getItem("api"),
		type: "post",
		data: {
			apikey: localStorage.getItem("key"),
			content:
				questions +
				" 【请用" +
				language_name +
				"回答。请在每几句后添加Emoji使语言活泼。本段内容无需回答，也无需引用关于本段内容的参考文献。】", // 将联网引用的链接放在最后，每一个都换行，标序号，没有联网则不显示参考文献，联网后找不到合适的结果也不需要显示。
		},
		async: false,
		success: function (data) {
			result = data;
		},
	});
	if (result == "密钥错误") {
		result = "<font color='red'>[错误] 密钥错误。</font>";
	}
	if (result == undefined) {
		result =
			"<font color='red'>[错误] 未知错误，控制台可能有更多信息。</font>";
	}
	return result;
}
function submitQuestion() {
	// 表单获取&验证部分
	var ask = document.forms["mainForm"]["questions"].value;
	if (ask == "" || ask == null) {
		alert("请输入内容");
		return false;
	} else {
		// 生成 ChatID
		document.getElementById("questions").disabled = true;
		document.getElementById("questionsSubmit").disabled = true;
		var chatid = "chat-" + String(Math.floor(Math.random() * 999999999));
		// 请求并显示UI
		function print() {
			document.getElementById("chat").innerHTML =
				document.getElementById("chat").innerHTML +
				'<p class="chat-me no-translating">' +
				ask +
				"</p>";
			var test1 =
				document.getElementById("chat").innerHTML +
				'<p class="chat-ta" id="' +
				chatid +
				'"><span class="spinner-grow" style="height: 16px; width: 16px;"></span><span style="font-size: 16px;" class="finding-text">正在请求 API...请耐心等待</p>';
			document.getElementById("chat").innerHTML = test1;
			translate.execute();
			document.getElementById("chat").scrollTop =
				document.getElementById("chat").scrollHeight;
		}
		setTimeout(print(), 500);
		setTimeout(function () {
			// 请求缓存
			if (
				localStorage.getItem("chatcache_" + ask + language_name) == null
			) {
				answer = requestAI(ask);
				localStorage.setItem(
					"chatcache_" + ask + language_name,
					answer
				);
			} else {
				answer = localStorage.getItem(
					"chatcache_" + ask + language_name
				);
			}
			console.log(ask);
			document.getElementById(chatid).innerHTML = marked(
				answer
					.replaceAll(
						">`【当前AI回答未使用联网搜索，不具有时效性，请确保核对事实】`",
						"<small>未使用联网功能，可能无时效性，请确保核对事实。</small>"
					)
					.replaceAll(
						">`【当前AI回答基于联网搜索生成，请确保核对事实】`",
						"<small>使用了联网功能，请确保核对事实。</small>"
					)
			)
				.replaceAll("<p>", "")
				.replaceAll("</p>", "<br/>")
				.replaceAll("<pre>", "")
				.replaceAll("</pre>", "")
				.replaceAll("\n", "")
				.replaceAll("<code>", "")
				.replaceAll("</code>", "")
				.replaceAll("<ol>", "")
				.replaceAll("</ol>", "")
				.replaceAll("<li>", "→ ")
				.replaceAll("</li>", "<br/>")
				.replaceAll("<blockquote>", "")
				.replaceAll("</blockquote>", "")
				.replaceAll("<hr>", "");
			document.getElementById(chatid).innerHTML =
				document.getElementById(chatid).innerHTML +
				"<a href='//capi1.fenserver.cn/delq.php?delq=" +
				ask +
				"&apikey=" +
				localStorage.getItem("key") +
				"'>清除服务器缓存</a>&nbsp;<a href='javascript:;' onclick='clr_cache(\"" +
				ask +
				"\")'>清除本地缓存[建议]</a>";
			document.getElementById("questions").disabled = false;
			document.getElementById("questionsSubmit").disabled = false;
			document.getElementById("questions").value = "";
			translate.execute();
		}, 500);
	}
}

function clr_cache(chat_content) {
	localStorage.removeItem("chatcache_" + chat_content + language_name);
	alert("成功清空本地缓存！");
}

// 模态框 JS
// 模态框
if (localStorage.getItem("alert") !== "false") {
	document.getElementById("startTips").checked = true;
}
document.getElementById("API").value = localStorage.getItem("api");
document.getElementById("keyset").value = localStorage.getItem("key");
document.getElementById("font").value = localStorage.getItem("font");
// 保存模态框
function saveTipsForm() {
	var alertAtStart = document.forms["tipsForm"]["startTips"].checked;
	localStorage.setItem("alert", String(alertAtStart));
	setTimeout(function () {
		alert("保存成功！");
	}, 500);
}
function saveSecurityForm() {
	var apivalue = document.forms["securityForm"]["API"].value;
	var keyysetvalue = document.forms["securityForm"]["keyset"].value;
	localStorage.setItem("api", apivalue);
	localStorage.setItem("key", keyysetvalue);
	setTimeout(function () {
		alert("保存成功！");
	}, 500);
}
function saveSettingsForm() {
	var fontvalue = document.forms["settingsForm"]["font"].value;
	localStorage.setItem("font", fontvalue);
	setTimeout(function () {
		alert("保存成功！部分设置可能需要重新启动网页。");
	}, 500);
}

// 翻译
translate.language.setLocal("chinese_simplified");
translate.selectLanguageTag.show = false;
translate.ignore.class.push("no-translating");
translate.execute();
if (translate.language.getCurrent() == "english") {
	language_name = "英语";
}
if (translate.language.getCurrent() == "chinese_traditional") {
	language_name = "繁体中文";
}
if (translate.language.getCurrent() == "chinese_simplified") {
	language_name = "简体中文";
}
