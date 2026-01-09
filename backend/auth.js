// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCwHSefApnq82su3wZrSQ5GC4jdmnoiqL0",
    authDomain: "barbearia-63be3.firebaseapp.com",
    projectId: "barbearia-63be3",
    storageBucket: "barbearia-63be3.firebasestorage.app",
    messagingSenderId: "1018794607068",
    appId: "1:1018794607068:web:c0f402996b97d90d760f19"
};
firebase.initializeApp(firebaseConfig);

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
        firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
            console.log("Usuário logado com sucesso!", response);
            document.getElementById("login-form").reset();
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




// ===== FUNÇÃO DE RECUPERAÇÃO DE SENHA =====
const email = document.getElementById("login-email");
if (email) {
    // Monitora entrada de email para habilitar/desabilitar botão
    email.addEventListener("input", function () {
        const btnRecover = document.getElementById("recover-password")
        // Habilita botão apenas se email contém "@"
        document.getElementById("recover-password").disabled = !email.value.includes("@");
    });
};

const btnRecover = document.getElementById("recover-password")
if (btnRecover) {
    btnRecover.addEventListener("click", function (e) {
        e.preventDefault();
        showLoading();
        const email = document.getElementById("login-email").value.trim();
        console.log("Tentando recuperar senha para", email);

        // Envia email de recuperação de senha
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            hideLoading();
            document.getElementById("invalid-feedback").textContent = "Email de recuperação de senha enviado com sucesso!";
            document.getElementById("invalid-feedback").style.display = "block";
        }).catch((error) => {
            // Trata erro ao enviar email de recuperação
            hideLoading();
            console.error("Erro ao enviar email de recuperação de senha:", error);
            if (!email) {
                document.getElementById("invalid-feedback").textContent = "Por favor, insira seu email para recuperação de senha.";
                document.getElementById("invalid-feedback").style.display = "block";
            } else if (error.code === "auth/invalid-email") {
                document.getElementById("invalid-feedback").textContent = "Email inválido.";
                document.getElementById("invalid-feedback").style.display = "block";
            }
        });
    });
};