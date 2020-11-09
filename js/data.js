import { hideLoading, showLoading } from "./notifications.js";

function host(endpoint) {
    return `https://api.backendless.com/83A6E1AD-4667-D288-FF78-68C9DA957800/FEB68A11-F452-42BE-8B3B-B3EE2A139E0C/${endpoint}`; 
    
}

const endpoints = {
    REGISTER: "users/register",
    LOGIN: "users/login",
    LOGOUT: "users/logout",
    MOVIES: "data/movies",
    MOVIE_BY_ID: "data/movies/"
};

export async function register(username, password) {
    showLoading();

    const result = (await fetch(host(endpoints.REGISTER), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    })).json();

    hideLoading();

    return result;
}

export async function login(username, password) {
    showLoading();

    const result = (await (await fetch(host(endpoints.LOGIN), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login: username,
            password
        })
    })).json());

    localStorage.setItem("userToken", result["user-token"]);
    localStorage.setItem("userId", result.objectId);
    localStorage.setItem('username', result.username);


    hideLoading();
    return result;
}

export async function logout() {
    showLoading();

    const token = verifyUserToken();

    const result = fetch(host(endpoints.LOGOUT), {
        method: "GET",
        headers: {
            "user-token": token
        }
    });
    hideLoading();

    return result;
}

export async function getAllMovies(search) {
    showLoading();

    const token = verifyUserToken();
    let url = '';

    if (search) {
        url = `?where=${escape(`genres LIKE '${search}'`)}`;
    }
    const result = (await fetch(host(endpoints.MOVIES + url), {
        headers: {
            "user-token": token 
        }
    })).json();
    hideLoading();

    return result;
}

export async function getMovieById(id) {

    showLoading();

    const token = verifyUserToken();

    const result = (await fetch(host(endpoints.MOVIE_BY_ID + id), {
        headers: {
            "user-token": token
        }
    })).json();
    hideLoading();

    return result;
}

export async function createMovie(newMovie) {
    showLoading();

    const token = verifyUserToken();

    const result = (await fetch(host(endpoints.MOVIES), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "user-token": token
        },
        body: JSON.stringify(newMovie)
    })).json();

    hideLoading();

    return result;
}

export async function updateMovie(movieId, updatedProps) {
    showLoading();

    const token = verifyUserToken();

    const result = (await fetch(host(endpoints.MOVIE_BY_ID + movieId), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "user-token": token
        },
        body: JSON.stringify(updatedProps)
    })).json();

    hideLoading();

    return result;
}

export async function getMoviesByOwner(ownerId) {

    showLoading();

    const token = verifyUserToken();
   
    const result = (await fetch(host(endpoints.MOVIES + `?where=ownerId='${ownerId}'`), {
        headers: {
            "Content-Type": "application/json",
            "user-token": token
        }
    })).json();

    hideLoading();

    return result;
}

export async function buyTicket(movie) {

    showLoading();

    const newTickets = movie.tickets - 1;

    const result = await updateMovie(movie.objectId, { tickets: newTickets });

    hideLoading();

    return result;
}

export async function deleteMovie(movieId) {

    showLoading();

    const token = verifyUserToken();

    const result = ( await fetch(host(endpoints.MOVIE_BY_ID + movieId), {
        method: "DELETE",
        headers: {
            "user-token": token
        }
    })).json();

    hideLoading();

    return result;
}

function verifyUserToken() {
    const token = localStorage.getItem("userToken");

    if (! token ) {
        alert("User is not logged in!");
        throw new Error("User must be logged in!");
    }
    return token;
}