const { Page } = require('../scripts/shared/page_controller')

class UserPage extends Page {
    constructor() {
        super()

    }

    getUserData() {}

}

class LoginPage extends Page {
    constructor() {
        super()
    }

    
}


function isLoggedIn() {
        return false;
    }


isLoggedIn()? new UserPage() : new LoginPage()