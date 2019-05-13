function show(state, id)
{
	document.getElementById(id).style.display = state;			
	document.getElementById('wrap').style.display = state; 			
}

function shadow(){
	document.getElementById('Disc').style.display = 'none';
	document.getElementsByClassName('discBody')[0].innerHTML = '';
	document.getElementById('Rozk').style.display = 'none';
	document.getElementsByClassName('RozkBody')[0].innerHTML = '';
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

function parseDisc(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('discBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].name;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].selective;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].num_lec_hours;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].num_prac_hours;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].num_lab_hours;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].num_indep_hours;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].num_indiv_hours;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].project;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].exam;
	}
	document.getElementById('Disc').style.display = 'table';	
}

function strouka(){
	var timeR = ['8:30 - 9:50','10:00 - 11:20','11:45 - 13:05','13:15 - 14:30','14:40 - 15:50','16:00 - 17:10','17:20 - 18:30','18:40 - 19:50','20:00 - 21:20']
	for(var i = 0; i < 9; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('RozkBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = timeR[i];
		a = document.createElement('th');
		t.appendChild(a);
		a = document.createElement('th');
		t.appendChild(a);
		a = document.createElement('th');
		t.appendChild(a);
		a = document.createElement('th');
		t.appendChild(a);
		a = document.createElement('th');
		t.appendChild(a);
		a = document.createElement('th');
		t.appendChild(a);
		a = document.createElement('th');
		t.appendChild(a);
	}
}

function parseRozklad(data){
	shadow();
	var stroka = JSON.parse(data);
	strouka();
	var days = ['7', '1', '2', '3', '4', '5', '6'];
	for(var i= 0; i< stroka.result.length; i++){
		var d = new Date(stroka.result[i].weekday.split('T')[0]);
		var dayName = days[d.getDay()];
		document.getElementById('Rozk').rows[stroka.result[i].lecture_id].children[dayName].innerHTML = stroka.result[i].group_name +
		' ' + stroka.result[i].name + ' (' + stroka.result[i].lecture_name + ')';
	}
	document.getElementById('Rozk').style.display = 'table';	
}

function onReload(state1, state2, textH3){
	document.getElementById("authOk").style.display = state1;
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