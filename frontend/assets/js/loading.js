function showLoading() {
    const div = document.createElement('div');
    div.classList.add('loading');
    div.innerHTML = '<label>Carregando...</label>';
    document.body.appendChild(div);
}


function hideLoading() {
    const loading = document.getElementsByClassName("loading")[0];
    if (loading) {
        loading.remove();
    }
}