function processFormUp(e) {
    if (e.preventDefault) e.preventDefault();
	do_post("auth.signup", ["login", this.childNodes[1].value, "teach_id", this.childNodes[3].value, "passwd", this.childNodes[5].value], (state, data) => {
		console.log(state);
		console.log(data);
		allFine(data);
	});
    return false;
}