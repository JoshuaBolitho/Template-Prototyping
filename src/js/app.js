
class App {

	constructor () {
		console.log('APP CONSTRUCTOR')
	}

	boot () {

		this.utils = new Utils();
	}

}

var app = new App();
app.boot();