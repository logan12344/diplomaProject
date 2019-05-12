function singInArea(){
	var forma = document.createElement("form");
	forma.addEventListener("submit", processForm);
	var open1 = document.createElement("a");
	document.getElementsByClassName("sign")[0].appendChild(open1);
	open1.href = "javascript:show('block');";
	var div1 = document.createElement("div");
	div1.id = "wrap";
	div1.onclick = function(){show('none');};
	document.body.appendChild(div1);
	
	var div2 = document.createElement("div");
	div2.id = "window";
	document.body.appendChild(div2);
	div2.appendChild(forma);
	
	var h1 = document.createElement("h1");
	div2.appendChild(h1);
	h1.id = "Auth";
	h1.innerHTML = "Authentication";
	
	var input1 = document.createElement("input");
	forma.appendChild(input1);
	input1.type = "text";
	input1.id = "login";
	input1.placeholder = "Enter login";
	input1.required = true;
	
	var input2 = document.createElement("input");
	forma.appendChild(input2);
	input2.type = "text";
	input2.id = "password";
	input2.placeholder = "Enter password";
	input2.required = true;
	
	var submit1 = document.createElement("input");
	forma.appendChild(submit1);
	submit1.type = "submit";
	submit1.value = "Sign in";
}

function show(state)
{
	document.getElementById('window').style.display = state;			
	document.getElementById('wrap').style.display = state; 			
}

function processForm(e) {
    if (e.preventDefault) e.preventDefault();
	do_post("auth.signin", ["login", this.childNodes[0].value, "passwd", this.childNodes[1].value], (state, data) => {
		console.log(data);
		console.log(state);
	});
    return false;
}

window.onload = function () {
	window._http_request = new XMLHttpRequest();
};

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
			if(window._http_request.readyState === XMLHttpRequest.DONE)
				callback(window._http_request.status, window._http_request.responseText);
		};
		window._http_request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		window._http_request.send(body);
	}
}