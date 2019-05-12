function show(state, id)
{
	document.getElementById(id).style.display = state;			
	document.getElementById('wrap').style.display = state; 			
}

function processFormIn(e) {
    if (e.preventDefault) e.preventDefault();
	do_post("auth.signin", ["login", this.childNodes[1].value, "passwd", this.childNodes[3].value], (state, data) => {
		console.log(state);
		console.log(data);
		if(state == 200) {
			allFine(data);
		}
	});
    return false;
}

function allFine(data){
	var stroka = JSON.parse(data);
	if(stroka.error == false){
		changeWindow("Authentication successful", "./../image/checked.svg");
		window.localStorage.setItem("token", stroka.result.token);
		window.localStorage.setItem("pib", stroka.result.pib);			
		onReload();
	}
	else
		changeWindow(stroka.result, "./../image/no-entry.svg");
}

function onReload(){
	var buttonSignOut = document.getElementById("signOut");
	buttonSignOut.style.display = 'block';
	buttonSignOut = document.getElementById("signIn");
	buttonSignOut.style.display = 'none';
	buttonSignOut = document.getElementById("signUp");
	buttonSignOut.style.display = 'none';
	buttonSignOut = document.getElementsByClassName("sign")[0];
	var h3 = document.getElementById("Name");
	h3.innerHTML = window.localStorage.getItem("pib");
}

function changeWindow(info, source){
	show("none", "window1");
	show("none", "window2");
	var textWindow = document.getElementById("after");
	textWindow.innerHTML = info;
	var imageSVG = document.getElementById("chech");
	imageSVG.src = source;
	show("block", "window3");
	setTimeout(function(){
		show("none", "window3");
	},1000);
}

function do_post(api_method, params, callback){
	if (window._http_request && api_method && callback){
		if ((params.length % 2) != 0){
			console.error('The number of parameters must be paired');
			return;
		}
		var body = '';
		for (var i=0; i< params.length-1; i+=2){
			body += params[i]+'='+params[i+1];
			if (i != params.length-2)
				body += '&';
		}
		window._http_request.open('post',document.location.origin+'/api/'+api_method, true);
		window._http_request.onreadystatechange = function () {
			if(window._http_request.readyState === XMLHttpRequest.DONE){
				callback(window._http_request.status, window._http_request.responseText);
				window._http_request.abort();
			}
		};
		window._http_request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		window._http_request.send(body);
	}
}