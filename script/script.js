// Efeito de mudar a cor da navbar ao rolar a página
window.addEventListener('scroll', function() {
    const nav = document.querySelector('header');
    if (window.scrollY > 50) {
        nav.style.backgroundColor = '#000';
    } else {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    }
});

// Configuração do LoginRadius
var loginRadiusV2 = loginRadiusV2 || {};
loginRadiusV2.util = loginRadiusV2.util || {};
loginRadiusV2.util.ready = function(callback) {
    if (/complete|interactive|loaded/.test(document.readyState)) {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
};

loginRadiusV2.util.ready(function() {
    LoginRadiusSDK.setLoginRadiusConfig("ramosbarbearia", {
        hashKey: "1f40c717-bc79-4ea4-a7d6-8e22db12788c",
        apiKey: "sidzrYtYiLtOZ4AQMH5bYMGqVciYeR5MdNe8BHu7yZM",
        v2Flows: true
    });
});
