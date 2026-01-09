document.addEventListener("DOMContentLoaded", () => {
    const btnLogout = document.getElementById("logout-btn");

    // Se não existir na página, não faz nada
    if (!btnLogout) return;

    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        showLoading();

        console.log("Tentando deslogar usuário");

        firebase.auth().signOut()
            .then(() => {
                console.log("Usuário deslogado com sucesso!");
                hideLoading();
                window.location.href = "pages/login.html";
            })
            .catch(error => {
                hideLoading();
                console.error("Erro ao deslogar o usuário:", error);
            });
    });
});

//desabilita botao logout se nao estiver logado
firebase.auth().onAuthStateChanged(user => {
    const btnLogout = document.getElementById("logout-btn");
    if (btnLogout) {
        if (user) {
            btnLogout.style.display = "block";
        } else {
            btnLogout.style.display = "none";
        }
    }
});