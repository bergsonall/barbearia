document.addEventListener("DOMContentLoaded", function () {
    firebase.auth().onAuthStateChanged((userCredential) => {
        if (userCredential && userCredential.emailVerified) {
            window.location.href = "../index.html";
        }
    })
    // ===== FUNÇÃO DE LOGIN =====
    const btnLogin = document.getElementById("btn-login")
    if (btnLogin) {
        btnLogin.addEventListener("click", function (e) {
            e.preventDefault();
            showLoading();

            // Obtém valores dos campos de email e senha
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;
            console.log("Tentando logar com", email, password);

            // Faz login no Firebase
            firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
                const user = userCredential.user;

                if (!user.emailVerified) {
                    hideLoading();
                    const feedback = document.getElementById("invalid-feedback");

                    feedback.textContent = "Por favor, verifique seu email antes de fazer login.";
                    feedback.classList.add("show");
                    return;
                }
                window.location.href = "../index.html";
                hideLoading();
            }).catch(error => {
                // Trata diferentes tipos de erro
                hideLoading();
                console.error("Erro ao logar o usuário:", error);
                console.log("Código do erro:", error.code);
                const feedback = document.getElementById("invalid-feedback");

                if (!password || !email) {
                    feedback.textContent = "Email e senha não podem estar vazios.";
                    feedback.classList.add("show");
                } else if (error.code === "auth/invalid-login-credentials") {
                    feedback.textContent = "Credenciais inválidas.";
                    feedback.classList.add("show");
                } else if (error.code === "auth/invalid-email") {
                    feedback.textContent = "Email inválido.";
                    feedback.classList.add("show");
                }
            });
        });
    }
});