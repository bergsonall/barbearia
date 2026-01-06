/* script/script.js
 * Arquivo principal de comportamentos JS para a página estática
 * - Efeito visual do header ao rolar
 * - Integração mínima com LoginRadius para login/cadastro (exemplo)
 */
/*
 * Efeito de mudar a cor da navbar ao rolar a página
 * Descrição: adiciona um listener de scroll que altera a cor de fundo do elemento <header>
 * Uso: mantém a navbar visível em rolagens longas
 */
// Scroll: altera o fundo do header ao rolar a página
function handleScroll() {
    const nav = document.querySelector('header');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.style.backgroundColor = '#000';
    } else {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    }
}

window.addEventListener('scroll', handleScroll);


/*
 * LoginRadius (autenticação)
 * Nota: configuração mantendo os valores originais; se não usar LoginRadius remova/oculte essas chaves
 * As credenciais abaixo estão presentes no repositório — considere movê-las para variáveis de ambiente
 */
var loginRadiusV2 = loginRadiusV2 || {};
loginRadiusV2.util = loginRadiusV2.util || {};
loginRadiusV2.util.ready = function (callback) {
    if (/complete|interactive|loaded/.test(document.readyState)) {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
};

/* Inicializa a configuração do SDK LoginRadius — comente/remova se não for utilizado */
loginRadiusV2.util.ready(function () {
    LoginRadiusSDK.setLoginRadiusConfig("ramosbarbearia", {
        hashKey: "1f40c717-bc79-4ea4-a7d6-8e22db12788c", // TODO: mover para ambiente seguro
        apiKey: "sidzrYtYiLtOZ4AQMH5bYMGqVciYeR5MdNe8BHu7yZM", // TODO: mover para ambiente seguro
        v2Flows: true
    });
});

// Login: handler separado e anexado somente se o formulário existir
function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    LoginRadiusSDK.login(
        { email, password },
        function (response) {
            console.log('Login OK', response);
            localStorage.setItem('token', response.access_token);
            window.location.href = '/dashboard.html';
        },
        function (error) {
            alert(error.Description || 'Erro no login');
        }
    );
}

var _loginForm = document.getElementById('login-form');
if (_loginForm) {
    _loginForm.addEventListener('submit', handleLoginSubmit);
}

// Registro: handler separado e anexado somente se o formulário existir
function handleRegisterSubmit(e) {
    e.preventDefault();

    LoginRadiusSDK.register(
        {
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            firstName: document.getElementById('reg-name').value
        },
        function (response) {
            alert('Conta criada com sucesso!');
            window.location.href = 'login.html';
        },
        function (error) {
            alert(error.Description || 'Erro no cadastro');
        }
    );
}

var _registerForm = document.getElementById('register-form');
if (_registerForm) {
    _registerForm.addEventListener('submit', handleRegisterSubmit);
}

/*
 * Bloqueio do CTA 'Agendar agora' para usuários não autenticados
 * - Se não houver `token` no localStorage, impede a navegação
 *   e pergunta se o usuário quer fazer login agora.
 */
function requireLoginForAgendar() {
    var cta = document.querySelector('.hero .cta-agendar');
    if (!cta) return;

    cta.addEventListener('click', function (e) {
        var token = localStorage.getItem('token');
        if (!token) {
            e.preventDefault();
            // mostrar modal estilizado em vez de confirm()
            showLoginModal();
        }
    });
}

// Anexa o listener quando o DOM estiver pronto
loginRadiusV2.util.ready(requireLoginForAgendar);

/* Modal control functions */
function showLoginModal() {
    var modal = document.getElementById('login-modal');
    if (!modal) return;
    modal.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');

    // attach handlers once
    var loginBtn = document.getElementById('modal-login-btn');
    var cancelBtn = document.getElementById('modal-cancel-btn');

    function onLogin() { window.location.href = 'functions/login.html'; }
    function onCancel() { hideLoginModal(); }

    if (loginBtn) { loginBtn.addEventListener('click', onLogin, { once: true }); }
    if (cancelBtn) { cancelBtn.addEventListener('click', onCancel, { once: true }); }
}

function hideLoginModal() {
    var modal = document.getElementById('login-modal');
    if (!modal) return;
    modal.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
}
