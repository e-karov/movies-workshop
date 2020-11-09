import {register as apiRegister} from '../data.js';
import { showError } from '../notifications.js';

export default async function register() {
    this.partials = {
        header: await this.load('../templates/common/header.hbs'),
        footer: await this.load('../templates/common/footer.hbs')
    };

    this.partial('../templates/user/register.hbs');
}

export async function registerPost() {
    const username = this.params.username;
    const password = this.params.password;
    const rePassword = this.params.repeatPassword;

   try {
    if (!username || username.length < 3) {
        throw new Error('Username must be at least 3 symbols!');
    };
    if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 symbols!');
    };
    if (password !== rePassword) {
        throw new Error("Passwords don't match!");
    }
       const user = await apiRegister(username, password);
       if (user.hasOwnProperty('errorData')) {
           const error = Object.assign({}, user);
           throw error;
       }

    this.redirect('#/login');
   } catch (error) {
       showError(error.message)
   }
}