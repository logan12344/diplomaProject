function show(state, id){
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

function shadow(){
	document.getElementById('Disc').style.display = 'none';
	document.getElementsByClassName('discBody')[0].innerHTML = '';
	document.getElementById('Rozk').style.display = 'none';
	document.getElementsByClassName('RozkBody')[0].innerHTML = '';
	document.getElementById('RozkSec').style.display = 'none';
	document.getElementsByClassName('RozkSecBody')[0].innerHTML = '';
	document.getElementById('Vikl').style.display = 'none';
	document.getElementsByClassName('ViklBody')[0].innerHTML = '';
	document.getElementById('EdPlan').style.display = 'none';
	document.getElementsByClassName('EdPlanBody')[0].innerHTML = '';
	document.getElementById('IvdivPlan').style.display = 'none';
	document.getElementsByClassName('IndivPlanBody')[0].innerHTML = '';
	document.getElementsByClassName('formNavchMat')[0].style.display = 'none';
	document.getElementById('UserSession').style.display = 'none';
	document.getElementsByClassName('UserSessionBody')[0].innerHTML = '';
	document.getElementById('lecturesPlan').style.display = 'none';
	document.getElementsByClassName('lecturesPlanBody')[0].innerHTML = '';
	document.getElementById('officeImg').style.display = 'none';
	document.getElementById('workPlan').style.display = 'none';
	document.getElementsByClassName('workPlanBody')[0].innerHTML = '';
	document.getElementById('tableType').style.display = 'none';
	document.getElementById('tableTypeSec').style.display = 'none';
}

function parseUserSession(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		if(stroka.result[i].current == true){
			t.style.backgroundColor = "#09FA92";
		}
		document.getElementsByClassName('UserSessionBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		a.id = i;
		a.innerHTML = stroka.result[i].session_id;
		var a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].current;
		a = document.createElement('th');
		t.appendChild(a);
		var b = document.createElement('button');
		a.appendChild(b);
		b.className = i;
		b.innerHTML = 'Закрити';
		b.onclick = closeUserSession;
	}
	document.getElementById('UserSession').style.display = 'table';
	document.getElementById('HeaderTitle').innerHTML = 'Активні сеанси';
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
		a.innerHTML = stroka.result[i].approv_date.split('T')[0];
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].edu_quali_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].edu_level_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].edu_form_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].train_period;
	}
	document.getElementById('EdPlan').style.display = 'table';
	document.getElementById('HeaderTitle').innerHTML = 'Навчальний план';
}

function parseVikl(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('ViklBody')[0].appendChild(t);
		var a = document.createElement('img');
		t.appendChild(a);
		if(stroka.result[i].photo)
			a.src = stroka.result[i].photo;
		else
			a.src = 'image/avatar.jpg';
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
	document.getElementById('HeaderTitle').innerHTML = 'Довідник викладачів';	
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
		a.innerHTML = stroka.result[i].edu_plan_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].teacher_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].term;
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
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].work_prog_file_id;
	}
	document.getElementById('Disc').style.display = 'table';	
	document.getElementById('HeaderTitle').innerHTML = 'Довідник дисциплін';
}

function strouka(){
	var timeR = ['8:30 - 9:50','10:00 - 11:20','11:45 - 13:05','13:15 - 14:30','14:40 - 15:50','16:00 - 17:10','17:20 - 18:30','18:40 - 19:50','20:00 - 21:20'];
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
		var t2 = document.createElement('tr');
		document.getElementsByClassName('RozkSecBody')[0].appendChild(t2);
		var a2 = document.createElement('th');
		t2.appendChild(a2);
		a2.innerHTML = timeR[i];
		a2 = document.createElement('th');
		t2.appendChild(a2);
		a2 = document.createElement('th');
		t2.appendChild(a2);
		a2 = document.createElement('th');
		t2.appendChild(a2);
		a2 = document.createElement('th');
		t2.appendChild(a2);
		a2 = document.createElement('th');
		t2.appendChild(a2);
		a2 = document.createElement('th');
		t2.appendChild(a2);
		a2 = document.createElement('th');
		t2.appendChild(a2);
	}
}

function parseRozklad(data){
	shadow();
	var stroka = JSON.parse(data);
	strouka();
	var days = ['7', '1', '2', '3', '4', '5', '6'];
	for(var i= 0; i< stroka.result.length; i++){
		if(stroka.result[i].week == false)
			rozkTable(stroka, i, days,'Rozk');
		else
			rozkTable(stroka, i, days,'RozkSec');
	}
	document.getElementById('Rozk').style.display = 'table';
	document.getElementById('RozkSec').style.display = 'table';
	document.getElementById('tableType').style.display = 'block';
	document.getElementById('tableTypeSec').style.display = 'block';
	document.getElementById('HeaderTitle').innerHTML = 'Розклад';
}

function rozkTable(stroka, i, days, table){
	var d = new Date(stroka.result[i].weekday.split('T')[0]);
	var dayName = days[d.getDay()];
	document.getElementById(table).rows[stroka.result[i].lecture_id].children[dayName].innerHTML = stroka.result[i].group_name +
	' ' + stroka.result[i].name + ' (' + stroka.result[i].lecture_name + ')';
}

function parseIndivPlan(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('IndivPlanBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].pib;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].name;
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
	document.getElementById('HeaderTitle').innerHTML = 'Індивідуальний план';
}

function uploadFile(){
	shadow();
	document.getElementsByClassName('formNavchMat')[0].style.display = 'block';
	document.getElementById('HeaderTitle').innerHTML = 'Формування навчальних матеріалів';
}

function parseLecturesPlan(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('lecturesPlanBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].work_prog_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].edu_plan_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].specialty_code;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].pib;
		a = document.createElement('th');
		t.appendChild(a);
		var b = document.createElement('table');
		a.appendChild(b);
		b.style = 'display: table; width: 100%;';
		var c = document.createElement('tbody');
		b.appendChild(c);
		for(var j=0; j<stroka.result[i].lectures.length; j++){
			var t = document.createElement('tr');
			c.appendChild(t);
			var tableH = document.createElement('th');
			t.appendChild(tableH);
			tableH.style = 'width: 7%; border: none;';
			tableH.innerHTML = stroka.result[i].lectures[j].lecture_id;
			tableH = document.createElement('th');
			t.appendChild(tableH);
			tableH.style = 'width: 7%; border: none;';
			tableH.innerHTML = stroka.result[i].lectures[j].topic;
			tableH = document.createElement('th');
			t.appendChild(tableH);
			tableH.style = 'width: 7%; border: none;';
			tableH.innerHTML = stroka.result[i].lectures[j].work_content;
			tableH = document.createElement('th');
			t.appendChild(tableH);
			var tableB = document.createElement('table');
			tableH.appendChild(tableB);
			tableB.style = 'display: table; width: 100%;';
			var tableC = document.createElement('tbody');
			tableB.appendChild(tableC);
			for(var k=0; k< stroka.result[i].lectures[j].method_mat.length; k++){
				var tableT = document.createElement('tr');
				tableC.appendChild(tableT);
				var tableH2 = document.createElement('th');
				tableT.appendChild(tableH2);
				tableH2.style = 'width: 12%; border: none;';
				tableH2.innerHTML = stroka.result[i].lectures[j].method_mat[k].teacher_id;
				tableH2 = document.createElement('th');
				tableT.appendChild(tableH2);
				tableH2.style = 'width: 15%; border: none;';
				tableH2.innerHTML = stroka.result[i].lectures[j].method_mat[k].method_mat_id;
				tableH2 = document.createElement('th');
				tableT.appendChild(tableH2);
				tableH2.style = 'width: 40%; border: none;';
				tableH2.innerHTML = stroka.result[i].lectures[j].method_mat[k].file_name;
				tableH2 = document.createElement('th');
				tableT.appendChild(tableH2);
				tableH2.style = 'width: 25%; border: none;';
				tableH2.innerHTML = stroka.result[i].lectures[j].method_mat[k].description;
				tableH2 = document.createElement('th');
				tableT.appendChild(tableH2);
				tableH2.style = 'width: 11%; border: none;';
				tableH2.innerHTML = stroka.result[i].lectures[j].method_mat[k].public;
			}
		}
	}
	document.getElementById('lecturesPlan').style.display = 'table';
	document.getElementById('HeaderTitle').innerHTML = 'План занять';
}

function parseWorkPlan(data){
	shadow();
	var stroka = JSON.parse(data);
	for(var i= 0; i< stroka.result.length; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('workPlanBody')[0].appendChild(t);
		var a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].work_plan_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].subject_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].lecture_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].topic;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].lec_type_id;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].work_content;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].control_type;
		a = document.createElement('th');
		t.appendChild(a);
		a.innerHTML = stroka.result[i].total_points;
		a = document.createElement('th');
	}
	document.getElementById('workPlan').style.display = 'table';
	document.getElementById('HeaderTitle').innerHTML = 'План робіт з дисципліни';
}