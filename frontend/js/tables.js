function show(state, id)
{
	document.getElementById(id).style.display = state;			
	document.getElementById('wrap').style.display = state; 			
}

function onReload(state1, state2, textH3){
	document.getElementById("authOk").style.display = state1;
	document.getElementById("signOut").style.display = state1;
	document.getElementById("signIn").style.display = state2;
	document.getElementById("signUp").style.display = state2;
	document.getElementById("Name").value = textH3;
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

function shadow(){
	document.getElementById('Disc').style.display = 'none';
	document.getElementsByClassName('discBody')[0].innerHTML = '';
	document.getElementById('Rozk').style.display = 'none';
	document.getElementsByClassName('RozkBody')[0].innerHTML = '';
	document.getElementById('Vikl').style.display = 'none';
	document.getElementsByClassName('ViklBody')[0].innerHTML = '';
	document.getElementById('EdPlan').style.display = 'none';
	document.getElementsByClassName('EdPlanBody')[0].innerHTML = '';
	document.getElementById('IvdivPlan').style.display = 'none';
	document.getElementsByClassName('IndivPlanBody')[0].innerHTML = '';
	document.getElementsByClassName('formNavchMat')[0].style.display = 'none';
	document.getElementById('UserSession').style.display = 'none';
	document.getElementsByClassName('UserSessionBody')[0].innerHTML = '';
	document.getElementById('WorkProg').style.display = 'none';
	document.getElementsByClassName('WorkProgBody')[0].innerHTML = '';
	document.getElementById('officeImg').style.display = 'none';
}

function userSession(){
	shadow();
	for(var i= 0; i< 5; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('UserSessionBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		/*a.innerHTML = window.localStorage.getItem("token");*/
		a = document.createElement('button');
		t.appendChild(a);
		a.value = 'Редагувати'
	}
	document.getElementById('UserSession').style.display = 'table';
}

function parseEdPlan(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('EdPlanBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].specialty_code;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].edu_plan_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].approv_year.split('T')[0];
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].term;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].flow;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].degree;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].groups;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].students;
	}
	document.getElementById('EdPlan').style.display = 'table';
}

function allFine(data){
	var stroka = JSON.parse(data);
	if(stroka.error == false){
		changeWindow("Authentication successful", "./../image/checked.svg");
		window.localStorage.setItem("token", stroka.result.token);
		window.localStorage.setItem("pib", stroka.result.pib);			
		onReload('block', 'none', window.localStorage.getItem("pib"));
		document.getElementById('logoImg').style.display = 'none';
	}
	else
		changeWindow(stroka.result, "./../image/no-entry.svg");
}

function parseVikl(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('ViklBody')[0].appendChild(t);
		var a = document.createElement('img');
		t.appendChild(a);
		a.src = stroka.result[i].photo;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].pib;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].contact_info[0];
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].contact_info[1];
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].contact_info[2];
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].work_exp;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].position;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].academic_status;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].degree;
		a = document.createElement('th');
		t.appendChild(a);
		var s = '';
		for(var o=0; o< stroka.result[i].discipline.length; o++){
			s += stroka.result[i].discipline[o] + ', ';
		}
		a.innerHTML = s;
	}
	document.getElementById('Vikl').style.display = 'table';	
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

function parseIndivPlan(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('IndivPlanBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].teacher_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].edu_plan_id;
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
	}
	document.getElementById('IvdivPlan').style.display = 'table';
}

function uploadFile(){
	shadow();
	document.getElementsByClassName('formNavchMat')[0].style.display = 'block';
}

function parseWorkPlan(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('WorkProgBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].work_prog_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].edu_plan_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].spesialty_code;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].teacher_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = '';
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = '';
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = '';
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = '';
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = '';
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = '';
	}
	document.getElementById('WorkProg').style.display = 'table';
}