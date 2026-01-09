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
