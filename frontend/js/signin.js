function show1(state)
{
	document.getElementById('window1').style.display = state;			
	document.getElementById('wrap').style.display = state; 			
}

function processFormIn(e) {
    if (e.preventDefault) e.preventDefault();
	do_post("auth.signin", ["login", this.childNodes[1].value, "passwd", this.childNodes[3].value], (state, data) => {
		console.log(state);
		console.log(data);
		if(state == 200) {
			var stroka = JSON.parse(data);
			if(stroka.error == false){
				changeWindow1("Authentication successful", "./../image/checked.svg");
			}
			else
				changeWindow1(stroka.result, "./../image/no-entry.svg");
		}
	});
    return false;
}

function changeWindow1(info, source){
	var div = document.getElementById("window1");
	div.removeChild(document.getElementById("loginForm"));
	var textWindow = document.getElementById("Auth");
	textWindow.innerHTML = info;
	var imageSVG = document.createElement("img");
	div.appendChild(imageSVG);
	imageSVG.src = source;
	imageSVG.id = "chech";
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