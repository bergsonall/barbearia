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
                    document.getElementById("invalid-feedback").textContent = "Por favor, verifique seu email antes de fazer login.";
                    document.getElementById("invalid-feedback").style.display = "block";
                    firebase.auth().signOut();
                    return;
                }
                window.location.href = "../index.html";
                hideLoading();
            }).catch(error => {
                // Trata diferentes tipos de erro
                hideLoading();
                console.error("Erro ao logar o usuário:", error);
                console.log("Código do erro:", error.code);

                if (!password || !email) {
                    document.getElementById("invalid-feedback").textContent = "Email e senha não podem estar vazios.";
                    document.getElementById("invalid-feedback").style.display = "block";
                } else if (error.code === "auth/invalid-credential") {
                    document.getElementById("invalid-feedback").textContent = "Credenciais inválidas.";
                    document.getElementById("invalid-feedback").style.display = "block";
                } else if (error.code === "auth/invalid-email") {
                    document.getElementById("invalid-feedback").textContent = "Email inválido.";
                    document.getElementById("invalid-feedback").style.display = "block";
                }
            });
        });
    }
});