function createTable(t, data){
	var a = document.createElement('th');
	t.appendChild(a);
	a.innerHTML = data;
}

function createBettonDelete(a, data, methodDelete){
	var b = document.createElement('button');
	a.appendChild(b);
	b.id = data;
	b.innerHTML = 'Видалити';
	b.onclick = methodDelete;
}

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
	document.getElementById('emptyImg').style.display = 'none';
	document.getElementById('workPlan').style.display = 'none';
	document.getElementsByClassName('workPlanBody')[0].innerHTML = '';
	document.getElementById('tableType').style.display = 'none';
	document.getElementById('tableTypeSec').style.display = 'none';
	document.getElementById('fileUploadTable').style.display = 'none';
	document.getElementsByClassName('fileUploadTableBody')[0].innerHTML = '';
	document.getElementById('Zviti').style.display = 'none';
	document.getElementsByClassName('ZvitiBody')[0].innerHTML = '';
	document.getElementById('TaskEx').style.display = 'none';
	document.getElementsByClassName('TaskExBody')[0].innerHTML = '';
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
		createTable(t, stroka.result[i].current);
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
		createTable(t, stroka.result[i].specialty_name);
		createTable(t, stroka.result[i].approv_date.split('T')[0]);
		createTable(t, stroka.result[i].edu_quali_name);
		createTable(t, stroka.result[i].edu_level_name);
		createTable(t, stroka.result[i].edu_form_name);
		createTable(t, stroka.result[i].train_period);
		createTable(t, stroka.result[i].knowl_area_name);
		var a = document.createElement('th');
		t.appendChild(a);
		createBettonDelete(a, stroka.result[i].edu_plan_id, deleteEdTableInfo);
	}
	document.getElementById('EdPlan').style.display = 'table';
	document.getElementById('HeaderTitle').innerHTML = 'Навчальний план';
}

function parseVikl(data){
	shadow();
	var stroka = JSON.parse(data);
	if(stroka.error == true){
			document.getElementById('emptyImg').style.display = 'block';
	}
	else{
		for(var i= 0; i< stroka.result.length; i++){
			var t = document.createElement('tr');
			document.getElementsByClassName('ViklBody')[0].appendChild(t);
			var a = document.createElement('img');
			t.appendChild(a);
			if(stroka.result[i].photo)
				a.src = stroka.result[i].photo;
			else
				a.src = 'image/avatar.jpg';
			createTable(t, stroka.result[i].pib);
			createTable(t, stroka.result[i].contact_info[0]);
			createTable(t, stroka.result[i].contact_info[1]);
			createTable(t, stroka.result[i].contact_info[2]);
			createTable(t, stroka.result[i].work_exp);
			createTable(t, stroka.result[i].position);
			createTable(t, stroka.result[i].academic_status);
			createTable(t, stroka.result[i].degree);
			var a = document.createElement('th');
			t.appendChild(a);
			var s = '';
			for(var o=0; o< stroka.result[i].discipline.length; o++){
				s += stroka.result[i].discipline[o] + ', ';
			}
			a.innerHTML = s;
			a = document.createElement('th');
			t.appendChild(a);
			createBettonDelete(a, stroka.result[i].teacher_id, deleteViklTableInfo);
		}
		document.getElementById('Vikl').style.display = 'table';
	}
	document.getElementById('HeaderTitle').innerHTML = 'Довідник викладачів';	
}

function parseDisc(data){
	shadow();
	var stroka = JSON.parse(data);
	if(stroka.error == true){
			document.getElementById('emptyImg').style.display = 'block';
	}
	else{
		for(var i= 0; i< stroka.result.length; i++){
			var t = document.createElement('tr');
			document.getElementsByClassName('discBody')[0].appendChild(t);
			createTable(t, stroka.result[i].name);
			createTable(t, stroka.result[i].edu_plan_id);
			createTable(t, stroka.result[i].pib);
			createTable(t, stroka.result[i].term);
			createTable(t, stroka.result[i].selective);
			createTable(t, stroka.result[i].num_lec_hours);
			createTable(t, stroka.result[i].num_prac_hours);
			createTable(t, stroka.result[i].num_lab_hours);
			createTable(t, stroka.result[i].num_indep_hours);
			createTable(t, stroka.result[i].num_indiv_hours);
			createTable(t, stroka.result[i].project);
			createTable(t, stroka.result[i].exam);
			createTable(t, stroka.result[i].file_name);
			a = document.createElement('th');
			t.appendChild(a);
			createBettonDelete(a, stroka.result[i].subject_id, deleteDiscTableInfo);
		}
		document.getElementById('Disc').style.display = 'table';
	}		
	document.getElementById('HeaderTitle').innerHTML = 'Довідник дисциплін';
}

function trueFalse(a, statusB){
	if(statusB == false)
		a.innerHTML = 'Ні';
	else
		a.innerHTML = 'Так';
}

function strouka(){
	var timeR = ['8:30 - 9:50','10:00 - 11:20','11:45 - 13:05','13:15 - 14:30','14:40 - 15:50','16:00 - 17:10','17:20 - 18:30','18:40 - 19:50','20:00 - 21:20'];
	for(var i = 0; i < 9; i++){
		var t = document.createElement('tr');
		document.getElementsByClassName('RozkBody')[0].appendChild(t);
		createTable(t, timeR[i]);
		var a = document.createElement('th');
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
		createTable(t2, timeR[i]);
		var a2 = document.createElement('th');
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
		var d = new Date(stroka.result[i].weekday.split('T')[0]);
		var dayName = days[d.getDay()];
		if(stroka.result[i].week == false)
			rozkTable(document.getElementById('Rozk').rows[stroka.result[i].lecture_id].children[dayName], stroka.result[i].group_name +
	' ' + stroka.result[i].name + ' аудиторія ' + stroka.result[i].audience + ' (' + stroka.result[i].lec_name + ')');
		else
			rozkTable(document.getElementById('RozkSec').rows[stroka.result[i].lecture_id].children[dayName], stroka.result[i].group_name +
	' ' + stroka.result[i].name + ' аудиторія ' + stroka.result[i].audience + ' (' + stroka.result[i].lec_name + ')');
	}
	document.getElementById('Rozk').style.display = 'table';
	document.getElementById('RozkSec').style.display = 'table';
	document.getElementById('tableType').style.display = 'block';
	document.getElementById('tableTypeSec').style.display = 'block';
	document.getElementById('HeaderTitle').innerHTML = 'Розклад';
}

function rozkTable(stroka, place){
	
	stroka.innerHTML = place;
}

function parseIndivPlan(data){
	shadow();
	var stroka = JSON.parse(data);
	if(stroka.error == true){
			document.getElementById('emptyImg').style.display = 'block';
	}
	else{
		for(var i= 0; i< stroka.result.length; i++){
			var t = document.createElement('tr');
			document.getElementsByClassName('IndivPlanBody')[0].appendChild(t);
			createTable(t, stroka.result[i].pib);
			createTable(t, stroka.result[i].name);
			createTable(t, stroka.result[i].num_lec_hours);
			createTable(t, stroka.result[i].num_prac_hours);
			createTable(t, stroka.result[i].num_lab_hours);
			createTable(t, stroka.result[i].num_indep_hours);
			createTable(t, stroka.result[i].num_indiv_hours);
			var a = document.createElement('th');
			t.appendChild(a);
			createBettonDelete(a, stroka.result[i].individ_plan_id, deleteIndivTableInfo);
		}
		document.getElementById('IvdivPlan').style.display = 'table';
	}
	document.getElementById('HeaderTitle').innerHTML = 'Індивідуальний план';
}

function parseLecturesPlan(data){
	shadow();
	var stroka = JSON.parse(data);
	if(stroka.error == true){
			document.getElementById('emptyImg').style.display = 'block';
	}
	else{
		for(var i= 0; i< stroka.result.length; i++){
			var t = document.createElement('tr');
			document.getElementsByClassName('lecturesPlanBody')[0].appendChild(t);
			createTable(t, stroka.result[i].pib);
			var a = document.createElement('th');
			t.appendChild(a);
			var b = document.createElement('table');
			a.appendChild(b);
			b.style = 'display: table; width: 100%;';
			var c = document.createElement('tbody');
			b.appendChild(c);
			for(var j=0; j<stroka.result[i].lectures.length; j++){
				var t = document.createElement('tr');
				c.appendChild(t);
				t.style = 'background-color: #ECEAFA';
				var tableH = document.createElement('th');
				t.appendChild(tableH);
				tableH.style = 'width: 7%; border: none;';
				tableH.innerHTML = stroka.result[i].lectures[j].lec_num;
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
				tableH.style = 'width: 7%; border: none;';
				tableH.innerHTML = stroka.result[i].lectures[j].control_type;
				tableH = document.createElement('th');
				t.appendChild(tableH);
				tableH.style = 'width: 7%; border: none;';
				tableH.innerHTML = stroka.result[i].lectures[j].report_date;
				tableH = document.createElement('th');
				t.appendChild(tableH);
				tableH.style = 'width: 7%; border: none;';
				tableH.innerHTML = stroka.result[i].lectures[j].total_points;
				tableH = document.createElement('th');
				t.appendChild(tableH);
				tableH.style = 'width: 7%; border: none;';
				tableH.innerHTML = stroka.result[i].lectures[j].lec_name;
				tableH = document.createElement('th');
				tableH.style = 'width: 51%; border: none;';
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
					tableH2.innerHTML = stroka.result[i].lectures[j].method_mat[k].pib;
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
					trueFalse(tableH2, stroka.result[i].lectures[j].method_mat[k].public);
				}
			}
		}
		document.getElementById('lecturesPlan').style.display = 'table';
	}
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
		a.innerHTML = stroka.result[i].name;
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
			t.style = 'background-color: #ECEAFA';
			var tableH = document.createElement('th');
			t.appendChild(tableH);
			tableH.style = 'width: 15%; border: none;';
			tableH.innerHTML = stroka.result[i].lectures[j].lec_num;
			tableH = document.createElement('th');
			t.appendChild(tableH);
			tableH.style = 'width: 15%; border: none;';
			tableH.innerHTML = stroka.result[i].lectures[j].topic;
			tableH = document.createElement('th');
			t.appendChild(tableH);
			tableH.style = 'width: 15%; border: none;';
			tableH.innerHTML = stroka.result[i].lectures[j].work_content;
			tableH = document.createElement('th');
			t.appendChild(tableH);
			tableH.style = 'width: 15%; border: none;';
			tableH.innerHTML = stroka.result[i].lectures[j].control_type;
			tableH = document.createElement('th');
			t.appendChild(tableH);
			tableH.style = 'width: 25%; border: none;';
			tableH.innerHTML = stroka.result[i].lectures[j].total_points;
			tableH = document.createElement('th');
			t.appendChild(tableH);
			tableH.style = 'width: 15%; border: none;';
			tableH.innerHTML = stroka.result[i].lectures[j].lec_name;
		}
	}
	document.getElementById('workPlan').style.display = 'table';
	document.getElementById('HeaderTitle').innerHTML = 'План робіт з дисципліни';
}

function parseFileUploader(data){
	shadow();
	var stroka = JSON.parse(data);
	if(stroka.error == true){
			document.getElementById('emptyImg').style.display = 'block';
	}
	else{
		for(var i= 0; i< stroka.result.length; i++){
			var t = document.createElement('tr');
			document.getElementsByClassName('fileUploadTableBody')[0].appendChild(t);
			createTable(t, stroka.result[i].file_name);
			createTable(t, stroka.result[i].description);
			createTable(t, stroka.result[i].public);
			var a = document.createElement('th');
			t.appendChild(a);
			createBettonDelete(a, stroka.result[i].method_mat_id, deletefileUploaderInfo);
		}
		document.getElementById('fileUploadTable').style.display = 'table';
		document.getElementsByClassName('formNavchMat')[0].style.display = 'block';
	}
	document.getElementById('HeaderTitle').innerHTML = 'Формування навчальних матеріалів';
}

function parseZvitiZ(data){
	shadow();
	var stroka = JSON.parse(data);
	if(stroka.error == true){
			document.getElementById('emptyImg').style.display = 'block';
	}
	else{
		for(var i= 0; i< stroka.result.length; i++){
			var t = document.createElement('tr');
			document.getElementsByClassName('ZvitiBody')[0].appendChild(t);
			createTable(t, stroka.result[i].from);
			createTable(t, stroka.result[i].to);
			createTable(t, stroka.result[i].file_name);
			var a = document.createElement('th');
			t.appendChild(a);
			createBettonDelete(a, stroka.result[i].report_id, deletefileZvitiZInfo);
		}
		document.getElementById('Zviti').style.display = 'table';
	}
	document.getElementById('HeaderTitle').innerHTML = 'Звіти';
}

function parseTaskEx(data){
	shadow();
	var stroka = JSON.parse(data);
	if(stroka.error == true){
			document.getElementById('emptyImg').style.display = 'block';
	}
	else{
		for(var i= 0; i< stroka.result.length; i++){
			var t = document.createElement('tr');
			document.getElementsByClassName('TaskExBody')[0].appendChild(t);
			createTable(t, stroka.result[i].report_date.split('T')[0]);
			createTable(t, stroka.result[i].topic);
			createTable(t, stroka.result[i].pib);
			createTable(t, stroka.result[i].file_name);
			createTable(t, stroka.result[i].send_date.split('T')[0]);
			var a = document.createElement('th');
			t.appendChild(a);
			createBettonDelete(a, stroka.result[i].task_id, deletefileTaskExInfo);
		}
		document.getElementById('TaskEx').style.display = 'table';
	}
	document.getElementById('HeaderTitle').innerHTML = 'Контроль виконання завдання';
}

function AddRowZviti(){
	document.getElementById("addForm").innerHTML = "";
	var forma = document.getElementById("addForm");
	createInput(forma, "EdPlanInput1", "text", "Від кого", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput2", "text", "Кому", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput3", "file", "Файл звіту", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanSubmit", "submit", "Додати");
	//forma.onsubmit = addEd;
}

function AddRowTaskEx(){
	document.getElementById("addForm").innerHTML = "";
	var forma = document.getElementById("addForm");
	createInput(forma, "EdPlanInput1", "text", "Планова дата здачі", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput2", "text", "Тема", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput3", "text", "Фаайл звіту", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput4", "text", "Дата відправлення", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanSubmit", "submit", "Додати");
	//forma.onsubmit = addEd;
}

function AddRowEd(){
	document.getElementById("addForm").innerHTML = "";
	var forma = document.getElementById("addForm");
	createInput(forma, "EdPlanInput1", "text", "Назва спеціальності", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput2", "text", "Дата затвердження плану", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput3", "text", "Освітня кваліфікація", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput4", "text", "Рівень", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput5", "text", "Форма навчання", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput6", "text", "Термін навчання", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput7", "text", "Галузь знань", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanSubmit", "submit", "Додати");
	forma.onsubmit = addEd;
}

function AddRowDisc(){
	document.getElementById("addForm").innerHTML = "";
	var forma = document.getElementById("addForm");
	createInput(forma, "EdPlanInput1", "text", "Назва дисципліни", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput2", "text", "Код навчального плану", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput3", "text", "П.І.Б", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput4", "text", "Семестр", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput5", "text", "Обов`язковість", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput6", "text", "Години лекцій", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput7", "text", "Години практик", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput8", "text", "Години лабораторних", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput9", "text", "Години самостійних", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput10", "text", "Години індивідуальних", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput11", "text", "Курсовий проект", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput12", "text", "Екзамен", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput13", "text", "Файл робочої програми", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanSubmit", "submit", "Додати");
	//forma.onsubmit = ;
}

function AddRowVikl(){
	document.getElementById("addForm").innerHTML = "";
	var forma = document.getElementById("addForm");
	createInput(forma, "EdPlanInput1", "text", "П.І.Б.", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput2", "text", "Номер телефону", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput3", "text", "Електронна пошта", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput4", "text", "Адреса", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput5", "text", "Стаж роботи", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput6", "text", "Посада", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput7", "text", "Вчене звання", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput8", "text", "Науковий ступінь", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput9", "text", "Дисципліни", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanSubmit", "submit", "Додати");
	//forma.onsubmit = ;
}

function AddRowIndivPlan(){
	document.getElementById("addForm").innerHTML = "";
	var forma = document.getElementById("addForm");
	createInput(forma, "EdPlanInput1", "text", "П.І.Б.", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput2", "text", "Назва дисципліни", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput3", "text", "Кількість годин лекцій	", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput4", "text", "Кількість годин практик", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput5", "text", "Кількість годин лабораторних", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput6", "text", "Кількість годин самостійних", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanInput7", "text", "Кількість годин індивідуальних", "left", "EdPlanInputEr");
	createInput(forma, "EdPlanSubmit", "submit", "Додати");
	//forma.onsubmit = ;
}

function AddRowFileUp(){
	document.getElementById("addForm").innerHTML = "";
	var forma = document.getElementById("addForm");
	var di = document.createElement('div');
	forma.appendChild(di);
	var di2 = document.createElement('div');
	di.appendChild(di2);
	di2.style.width = '100%';
	createInput(di2, "EdPlanInput1", "file", "", "left", "EdPlanInputEr");
	createInput(di2, "EdPlanInput2", "checkbox", "Загальний доступ", "left", "EdPlanInputEr");
	var d = document.createElement('div');
	di.appendChild(d);
	d.style.width = '10%';
	var textB = document.createElement('textarea');
	d.appendChild(textB);
	textB.id = 'descriptionUp';
	textB.name = 'desc';
	createInput(forma, "EdPlanSubmit", "submit", "Додати");
	forma.onsubmit = uploadFiles;
}

function createInput(forma, id, typeOf, holder, state, classer){
	var a = document.createElement('input');
	forma.appendChild(a);
	a.style.float = state;
	a.style.margin = "1%";
	a.setAttribute("type", typeOf);
	a.id = id;
	if(typeOf == 'text'){
		a.classList.add(classer);
		a.required = "required";
		a.placeholder = holder;
	}else if(typeOf == 'checkbox'){
		a.name = "public";
		a.id = 'check';
		var a2 = document.createElement('a');
		forma.appendChild(a2);
		a2.style.float = state;
		a2.innerHTML = holder;
	}else if(typeOf == 'file'){
		a.id = 'upload';
		a.name = "uploadFiles";
		a.multiple = "multiple";
	}
	else{
		a.value = holder;
	}
}