import { logout as logoutPost } from '../data.js';
import { showInfo, showError } from '../notifications.js';

export default async function logout() {

   try {
       const result = await logoutPost();
       if (result.hasOwnProperty('errorData')) {
           const error = new Error();
           Object.assign(error, result);
           throw error;
       }

       localStorage.removeItem('userToken');
       localStorage.removeItem('userId');
       localStorage.removeItem('username');
       
       this.app.userData.loggedIn = false;
       this.app.userData.username = '';
       this.app.userData.userId = '';

       showInfo('Successfully logged out!');
       this.redirect('#/home');

       return result;
       
   } catch (error) {
       showError(error.message);
   }
}