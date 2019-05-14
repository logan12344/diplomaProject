function processFormOut() {
	do_post("auth.logout", ["token", window.localStorage.getItem("token")], (state, data) => {
		window.localStorage.clear();
		console.log(state);
		console.log(data);
		onReload('none', 'block', '');
		shadow();
	});
    return false;
}

function processFormUp(e) {
    if (e.preventDefault) e.preventDefault();
	do_post("auth.signup", ["login", this.elements.loginReg.value, "teach_id", this.elements.teacheID.value, "passwd", this.elements.passwordReg.value], (state, data) => {
		console.log(state);
		console.log(data);
		allFine(data);
	});
    return false;
}

function edPlan(){
	do_post("educationalplan.get", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
			parseEdPlan(data);
	});
}

function indivPlan(){
	do_post("individualplan.get", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
			parseIndivPlan(data);
	});
}

function rozklad(){
	do_post("schedule.get", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
		if(state == 200) {
			parseRozklad(data);
		}
	});
}

function dovDisc(){
	do_post("subjects.get", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
		if(state == 200) {
			parseDisc(data);
		}
	});
}

function dovVikl(){
	do_post("teachers.get", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
		if(state == 200) {
			parseVikl(data);
		}
	});
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