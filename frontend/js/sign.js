function processFormOut() {
	do_post("auth.logout", ["token", window.localStorage.getItem("token")], (state, data) => {
		window.localStorage.clear();
		console.log(state);
		console.log(data);
		onReload('none', 'block', '');
		shadow();
		document.getElementById('logoImg').style.display = 'block';
		document.getElementById('officeImg').style.display = 'block';
		document.getElementById('HeaderTitle').innerHTML = 'Віртуальний офіс';
	});
    return false;
}

function uploadFiles(e){
	if (e.preventDefault) e.preventDefault();
	if (window._http_request){
		body = new FormData(this);
		body.append('token', window.localStorage.getItem("token"));
		window._http_request.open('post',document.location.origin+'/api/file.upload', true);
		window._http_request.onreadystatechange = function () {
			if(window._http_request.readyState === XMLHttpRequest.DONE){
				document.getElementById('descriptionUp').value = '';
				document.getElementById('upload').value = '';
			}
		};
		window._http_request.send(body);
	}
}

function processFormUp(e) {
    if (e.preventDefault) e.preventDefault();
	do_post("auth.signup", ["login", this.elements.loginReg.value, "teach_id", this.elements.teacheID.value, "passwd", this.elements.passwordReg.value], (state, data) => {
		console.log(state);
		console.log(data);
		if(state == 200) {
			allFine(data);
		}
	});
    return false;
}

function workPlan(){
	do_post("workplan.get", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
		if(state == 200) {
			parseWorkPlan(data);
		}
	});
}

function edPlan(){
	do_post("educationalplan.get", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
		if(state == 200) {
			parseEdPlan(data);
		}
	});
}

function indivPlan(){
	do_post("individualplan.get", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
		if(state == 200) {
			parseIndivPlan(data);
		}
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

function userSession(){
	do_post("account.getsessions", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
		if(state == 200) {
			parseUserSession(data);
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

function lecturesPlan(){
	do_post("lecturesplan.get", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
		if(state == 200) {
			parseLecturesPlan(data);
		}
	});
}

function fileUploader(){
	do_post("file.list", ["token", window.localStorage.getItem("token")], (state, data)=> {
		console.log(state);
		console.log(data);
		if(state == 200) {
			parseFileUploader(data);
		}
	});
}

function closeUserSession(){
	var session = document.getElementById(this.className).innerHTML;
	console.log(session);
	do_post("account.closesession", ["token", window.localStorage.getItem("token"), "session_id", session], (state, data) => {
		console.log(state);
		console.log(data);
		var stroka = JSON.parse(data);
		if(stroka.result =='Token expired'){
			processFormOut();
		}
		else{
			parseUserSession(data);
		}
	});
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