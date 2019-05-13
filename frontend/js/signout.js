function processFormOut() {
	do_post("auth.logout", ["token", window.localStorage.getItem("token")], (state, data) => {
		window.localStorage.clear();
		console.log(state);
		console.log(data);
		onReload('none', 'block', '');
	});
    return false;
}