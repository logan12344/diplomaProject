function show(state, id)
{
	document.getElementById(id).style.display = state;			
	document.getElementById('wrap').style.display = state; 			
}

function processFormIn(e) {
    if (e.preventDefault) e.preventDefault();
	do_post("auth.signin", ["login", this.elements.login.value, "passwd", this.elements.password.value], (state, data) => {
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
		onReload('block', 'none', window.localStorage.getItem("pib"));
	}
	else
		changeWindow(stroka.result, "./../image/no-entry.svg");
}

function onReload(state1, state2, textH3){
	document.getElementById("signOut").style.display = state1;
	document.getElementById("signIn").style.display = state2;
	document.getElementById("signUp").style.display = state2;
	document.getElementById("Name").innerHTML = textH3;
}

function changeWindow(info, source){
	show("none", "windowIn");
	show("none", "windowUp");
	document.getElementById("after").innerHTML = info;
	document.getElementById("chech").src = source
	show("block", "windowOut");
	setTimeout(function(){
		show("none", "windowOut");
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