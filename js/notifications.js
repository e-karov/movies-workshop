const elements = {
    loading: document.querySelector('#loadingBox'),
    info: document.querySelector('#infoBox'),
    error: document.querySelector('#errorBox'),
};

elements.info.addEventListener('click', hideInfo);
elements.error.addEventListener('click', hideError);

export function showInfo(message) {
    elements.info.children[0].textContent = message;
    elements.info.style.display = 'block';
    setTimeout(hideInfo, 2000);
}

export function hideInfo() {
    elements.info.style.display = 'none';
}
let requests = 0;

export function showLoading() {
    elements.loading.style.display = 'block';
    requests++;
}

export function hideLoading() {
    requests--;
    if (requests === 0) {
        elements.loading.style.display = 'none';
    }
}

export function showError(message) {
    elements.error.children[0].textContent = message;
    elements.error.style.display = 'block';
    setTimeout(hideError, 3000);
}

export function hideError() {
    elements.error.style.display = 'none';
}
