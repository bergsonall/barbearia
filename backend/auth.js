const email = document.getElementById("login-email").value;
const password = document.getElementById("login-password").value;

const firebaseConfig = {
    apiKey: "AIzaSyCwHSefApnq82su3wZrSQ5GC4jdmnoiqL0",
    authDomain: "barbearia-63be3.firebaseapp.com",
    projectId: "barbearia-63be3",
    storageBucket: "barbearia-63be3.firebasestorage.app",
    messagingSenderId: "1018794607068",
    appId: "1:1018794607068:web:c0f402996b97d90d760f19"
  };
  firebase.initializeApp(firebaseConfig);

document.getElementById("btn-login").addEventListener("click", function(e){
    e.preventDefault();
    console.log("Tentando logar com", email, password);
    firebase.auth().signInWithEmailAndPassword(email, password).then(response =>{
            console.log("Usuário logado com sucesso!", response);
    }).catch(error =>{
        console.error("Erro ao logar o usuário:", error);
    });
});