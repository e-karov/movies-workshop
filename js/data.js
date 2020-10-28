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
    const result = (await (await fetch(host(endpoints.LOGIN), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "login": username,
            password
        })
    })).json());

    localStorage.setItem("userToken", result["user-token"]);
    localStorage.setItem("userId", result.objectId);

    return result;
}

function logout() {
    const token = verifyUserToken();

    return fetch(host(endpoints.LOGOUT), {
        method: "GET",
        headers: {
            "user-token": token
        }
    });
}

async function getAllMovies() {
    const token = verifyUserToken();

    return (await fetch(host(endpoints.MOVIES), {
        headers: {
            "user-token": token
        }
    })).json();
}

async function getMovieById(id) {

    const token = verifyUserToken();

    return (await fetch(host(endpoints.MOVIE_BY_ID + id), {
        headers: {
            "user-token": token
        }
    })).json();
}

async function createMovie(newMovie) {

    const token = verifyUserToken();

    return (await fetch(host(endpoints.MOVIES), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "user-token": token
        },
        body: JSON.stringify(newMovie)
    })).json();

}

async function updateMovie(movieId, updatedProps) {

    const token = verifyUserToken();

    return (await fetch(host(endpoints.MOVIE_BY_ID + movieId), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "user-token": token
        },
        body: JSON.stringify(updatedProps)
    })).json();
}

async function getMovieByOwner(ownerId) {

    const token = verifyUserToken();
   
    return (await fetch(host(endpoints.MOVIES + `?where=ownerId='${ownerId}'`), {
        headers: {
            "user-token": token
        }
    })).json();
}

async function buyTicket(movie) {

    const newTickets = movie.tickets - 1;

    return (await updateMovie(movie.objectId, { tickets: newTickets }));
}

async function deleteMovie(movieId) {

    const token = verifyUserToken();

   ( await fetch(host(endpoints.MOVIE_BY_ID + movieId), {
        method: "DELETE",
        headers: {
            "user-token": token
        }
    })).json();
}

function verifyUserToken() {
    const token = localStorage.getItem("userToken");

    if (! token ) {
        alert("User is not logged in!");
        throw new Error("User must be logged in!");
    }
    return token;
}