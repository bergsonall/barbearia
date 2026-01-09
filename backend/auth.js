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
if (btnLogin){
    btnLogin.addEventListener("click", function(e){
        e.preventDefault();
        showLoading();
        
        // Obtém valores dos campos de email e senha
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        console.log("Tentando logar com", email, password);

        // Faz login no Firebase
        firebase.auth().signInWithEmailAndPassword(email, password).then(response =>{
            console.log("Usuário logado com sucesso!", response);
            document.getElementById("login-form").reset();
            window.location.href = "../index.html";
            hideLoading();
        }).catch(error =>{
            // Trata diferentes tipos de erro
            hideLoading();
            console.error("Erro ao logar o usuário:", error);
            console.log("Código do erro:", error.code);
            
            if(!password || !email){
                document.getElementById("invalid-feedback").textContent = "Email e senha não podem estar vazios.";
                document.getElementById("invalid-feedback").style.display = "block";
             } else if(error.code === "auth/invalid-credential"){
                document.getElementById("invalid-feedback").textContent = "Credenciais inválidas.";
                document.getElementById("invalid-feedback").style.display = "block";
             } else if(error.code === "auth/invalid-email"){
                document.getElementById("invalid-feedback").textContent = "Email inválido.";
                document.getElementById("invalid-feedback").style.display = "block";
            }
        });
    });
}

// ===== FUNÇÃO DE REGISTRO =====
const btnRegister = document.getElementById("btn-reg")
if (btnRegister){
        btnRegister.addEventListener("click", function(e){
        e.preventDefault();
        showLoading();
        console.log("Botão de registro clicado");
        
        // Obtém valores dos campos de registro
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value;
        const passwordConfirm = document.getElementById("reg-password-confirm").value;
        const name = document.getElementById("reg-name").value.trim();

        console.log("Tentando registrar com", email, password);
        
        // Valida se as senhas coincidem
        if(password !== passwordConfirm){
            hideLoading();
            document.getElementById("reg-invalid-feedback").textContent = "As senhas não coincidem.";
            document.getElementById("reg-invalid-feedback").style.display = "block";
            return;
        }
        
        // Cria novo usuário no Firebase
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() =>{
            hideLoading();
            document.getElementById("reg-invalid-feedback").textContent = "Usuário registrado com sucesso!";
            window.location.href = "login.html";
            return firebase.auth().signOut();
        }).catch(error =>{
            // Trata diferentes tipos de erro no registro
            console.error("Erro ao registrar o usuário:", error);
            if(!password || !email || !name || !passwordConfirm){
                hideLoading();
                document.getElementById("reg-invalid-feedback").textContent = "Verifique se todos os campos foram preenchidos.";
                document.getElementById("reg-invalid-feedback").style.display = "block";
            } else if(error.code === "auth/weak-password"){
                hideLoading();
                document.getElementById("reg-invalid-feedback").textContent = "Senha muito fraca. Use no mínimo 6 caracteres.";
                document.getElementById("reg-invalid-feedback").style.display = "block";
            } else if(error.code === "auth/invalid-email"){
                hideLoading();
                document.getElementById("reg-invalid-feedback").textContent = "Email inválido.";
                document.getElementById("reg-invalid-feedback").style.display = "block";
            }
        });
    });
}

// ===== FUNÇÃO DE RECUPERAÇÃO DE SENHA =====
const email = document.getElementById("login-email");
if (email){
    // Monitora entrada de email para habilitar/desabilitar botão
    email.addEventListener("input", function(){
        const btnRecover = document.getElementById("recover-password")
        // Habilita botão apenas se email contém "@"
        document.getElementById("recover-password").disabled = !email.value.includes("@");
        
        if (btnRecover){
            btnRecover.addEventListener("click", function(e){
                e.preventDefault();
                showLoading();
                const email = document.getElementById("login-email").value.trim();
                console.log("Tentando recuperar senha para", email);
                
                // Envia email de recuperação de senha
                firebase.auth().sendPasswordResetEmail(email).then(() => {
                    hideLoading();
                    document.getElementById("reg-invalid-feedback").textContent = "Email de recuperação de senha enviado com sucesso!";
                    document.getElementById("reg-invalid-feedback").style.display = "block";
                    alert("Email de recuperação de senha enviado com sucesso!");
                }).catch((error) => {
                    // Trata erro ao enviar email de recuperação
                    hideLoading();
                    console.error("Erro ao enviar email de recuperação de senha:", error);
                    if(!email){
                        document.getElementById("invalid-feedback").textContent = "Por favor, insira seu email para recuperação de senha.";
                        document.getElementById("invalid-feedback").style.display = "block";
                    } else if(error.code === "auth/invalid-email"){
                        document.getElementById("invalid-feedback").textContent = "Email inválido.";
                        document.getElementById("invalid-feedback").style.display = "block";
                    }
                });
            });
        }
    });
}