function processFormOut() {
	do_post("auth.logout", ["token", window.localStorage.getItem("token")], (state, data) => {
		window.localStorage.clear();
		console.log(state);
		console.log(data);
		var buttonSignOut = document.getElementById("signOut");
		buttonSignOut.style.display = 'none';
		buttonSignOut = document.getElementById("signIn");
		buttonSignOut.style.display = 'block';
		buttonSignOut = document.getElementById("signUp");
		buttonSignOut.style.display = 'block';
		buttonSignOut = document.getElementsByClassName("sign")[0];
		var h3 = document.getElementById("Name");
		h3.innerHTML = '';
	});
    return false;
}