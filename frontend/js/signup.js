function processFormUp(e) {
    if (e.preventDefault) e.preventDefault();
	do_post("auth.signup", ["login", this.elements.loginReg.value, "teach_id", this.elements.teacheID.value, "passwd", this.elements.passwordReg.value], (state, data) => {
		console.log(state);
		console.log(data);
		allFine(data);
	});
    return false;
}