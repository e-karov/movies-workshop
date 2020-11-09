import {login} from '../data.js';
import {showError, showInfo } from '../notifications.js';

export default async function () {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs')
    };

    this.partial('../templates/user/login.hbs');
}

export async function loginPost() {

    try {
        const username = this.params.username;
        const password = this.params.password;
    
        const result = await login(username, password);
        if (result.hasOwnProperty('errorData')) {
            const error = Object.assign({}, result);
            throw error;
        };
    
        this.app.userData.loggedIn = true;
        this.app.userData.username = result.username;
        
        
        showInfo('Successfully logged in!');

        this.redirect('#/home');

    } catch (error) {
        console.error(error.message);
        showError(error.message);
    }
    
}