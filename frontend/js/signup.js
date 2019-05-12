function singOUpArea(){
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
	h1.innerHTML = "Registration";
	
	var input1 = document.createElement("input");
	forma.appendChild(input1);
	input1.type = "text";
	input1.id = "login";
	input1.placeholder = "Pick a login";
	input1.required = true;
	
	var input2 = document.createElement("input");
	forma.appendChild(input2);
	input2.type = "text";
	input2.id = "password";
	input2.placeholder = "Create a password";
	input2.required = true;
	
	var submit1 = document.createElement("input");
	forma.appendChild(submit1);
	submit1.type = "submit";
	submit1.value = "Sign Up";
}

function show(state)
{
	document.getElementById('window').style.display = state;			
	document.getElementById('wrap').style.display = state; 			
}