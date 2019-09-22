function IpConfig(){
	let ipAddress;
	let ssrUrl;
	this.Set = function(IP, SSRURL){
		ipAddress = IP;
		ssrUrl = SSRURL;
	}
	this.Ip = function(){
		return ipAddress;
	}
	this.SSRUrl = function(){
		return ssrUrl;
	}
}
function pingFunction(ipConfig){
	const ssrUrl = ipConfig.SSRUrl();
	const ip = ipConfig.Ip();
	let sendTime = 0;
	let responseTime = -1;
	let totalTime = -1;
	let responseText = "Unsuccessful Connect!";
	let isFinished = 0;
	this.IP = function(){
		return ip;
	}
	this.SendTime = function(){
		return sendTime;
	}
	this.ResponseTime = function(){
		return responseTime;
	}
	this.URL = function(){
		return ssrUrl;
	}
	this.IsFinished = function(){
		return isFinished;
	}
	this.startPing = function(){
		console.log("正在验证当前ip：" + ip + "是否可用...");
		let ajax = new Ajax();
		AjaxGet(ajax);
	}
	let getUrl = function(IP){
		let strReg = "^((https|http)?://){1}";
		let Reg = new RegExp(strReg);
		return Reg.test(IP) ? IP : ("https://" + IP);
	}
	
	let Ajax = function(){
		if(typeof XMLHttpRequest != "undefined"){
			try{
				return new XMLHttpRequest();
			}
			catch(ex) {
				throw new Error("ie7以下对原生XMLHTTPRequest不兼容，请百度ie7以下如何对原生ajax进行兼容")
			}
		}
	}
	
	let AjaxGet = function(ajax){
		//ajax.open(请求类型,请求URL,是否异步发送请求)
		ajax.onreadystatechange = function(){
			switch(ajax.readyState){
				case 0:
					console.log("正在准备建立请求...")
					break;
				case 1:
					console.log(ip + "请求已建立。")
					break;
				case 4:
					console.log(ip + "请求已返回。");
					responseTime = new Date().getTime();
					isFinished = 1;
			}
			if(ajax.readyState == 4){
				if(ajax.status >= 200 & ajax.status < 300 || ajax.status == 304){
					responseText = ajax.responseText;
				}
			}
		}
		console.log("当前测试URL为：" + getUrl(ip) + "/" + (new Date()).getTime() + ".html");
		try{
			ajax.open("get", getUrl(ip) + "/" + (new Date()).getTime() + ".html", true);
			sendTime = new Date().getTime();
			ajax.send(null);
		}
		catch(ex){
			console.log(ip + "请求已返回。");
			responseTime = new Date().getTime();
			isFinished = 1;
		}
		
	}
}
let CanUsedUrl = function(contactObj, time){
	setTimeout(function(){
		let completeCount = 0;
		contactObj.ipConfigPingArray.map((item)=>{
			if(item.IsFinished()){
				completeCount++;
			}
		});
		if(completeCount < ipConfigPingArray.length){
			console.log("第" + time++ + "次尝试读取，ajax还未完成，请稍候。\n(剩余" + (ipConfigPingArray.length - completeCount) + "个IP尚未返回...");
			
			CanUsedUrl(contactObj, time++);
			isComplete = 1;
			return "";
		}
		let canUsedUrl = new Array();
		contactObj.ipConfigPingArray.map((item)=>{
			if (item.ResponseTime() - item.SendTime() > 0 && item.ResponseTime() - item.SendTime() < 10000){
				console.log("当前ip" + item.IP() + "可用！");
				canUsedUrl.push(item.URL());
			}
			else{
				console.log("当前ip" + item.IP() + "不可用！响应时间为：" + (item.ResponseTime() - item.SendTime()));
			}
		});
		console.log(canUsedUrl.join("\n"));
	},3000);
}
let ipConfigArray = new Array();
this.ipConfigPingArray = new Array();
Array.from(document.querySelectorAll("#post-box > div > section > div > table > tbody > tr")).map((item)=>{
	let ipConfig = new IpConfig();
	ipConfig.Set(item.children[1].innerHTML, item.children[0].children[0].href);
	ipConfigArray.push(ipConfig);
});

ipConfigArray.map((item)=>{
	let ipConfigPing = new pingFunction(item);
	ipConfigPing.startPing();
	ipConfigPingArray.push(ipConfigPing);
});
let contactObj = this;
CanUsedUrl(contactObj, 1);