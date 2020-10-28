function host(endpoint) {
    return `https://api.backendless.com/83A6E1AD-4667-D288-FF78-68C9DA957800/FEB68A11-F452-42BE-8B3B-B3EE2A139E0C/${endpoint}`; 
}

const endpoints = {
    REGISTER: "users/register",
    LOGIN: "users/login",
    LOGOUT: "users/logout",
    MOVIES: "data/movies"
};

async function register(username, password) {
    return (await fetch(host(endpoints.REGISTER), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    })).json();
}

async function login(username, password) {
    const result = (await fetch(host(endpoints.LOGIN), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            login: username,
            password
        })
    })).json();

    localStorage.setItem("userToken", result["user-token"]);
    localStorage.setItem("userId", result.objectId);
    return result;
}

function logout() {
    const token = localStorage.getItem("userToken");

    return fetch(host(endpoints.LOGOUT), {
        method: "GET",
        headers: {
            "user-token": token
        }
    });
}

async function getAllMovies() {

    return (await fetch(host(endpoints.MOVIES))).json();
}

async function getMovieById(id) {

}

async function createMovie(newMovie) {

}

async function updateMovie(movieId, updatatedProps) {

}

async function getMovieByOwner(ownerId) {

}

async function buyTicket(movieId) {

}

async function deleteMovie(movieId) {

}