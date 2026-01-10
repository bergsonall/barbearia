/*aguarda pagina carregar, monitora mudanças no input*/
document.addEventListener('DOMContentLoaded', () => {

    let dataEscolhida = null;   // ✅ variável global
    let hojeData = null;       // ✅ usada depois no botão

    //Seleciona o serviço
    let servicoSelecionado = "";

    const cards = document.querySelectorAll('.servico-card');

    cards.forEach(card => {
        const input = card.querySelector('input');

        card.addEventListener('click', () => {
            // marca o radio
            input.checked = true;

            // salva valor
            servicoSelecionado = input.value;

            // visual ativo
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // log
            console.log("Serviço escolhido:", servicoSelecionado);
        });
    });

    // ============================
    // DATA E HORA - CONTROLE TOTAL
    // ============================

    const dataInput = document.getElementById('data');
    const horaInput = document.getElementById('hora');

    // começa bloqueado
    horaInput.disabled = true;

    // data mínima = hoje
    const hoje = new Date();
    const hojeISO = hoje.toISOString().split('T')[0];
    dataInput.setAttribute('min', hojeISO);

    // sempre que mudar a data
    dataInput.addEventListener('change', () => {

        if (!dataInput.value) {
            horaInput.disabled = true;
            horaInput.value = "";
            return;
        }

        horaInput.disabled = false;

        const agora = new Date();

        // 🔥 agora usamos a variável GLOBAL
        dataEscolhida = new Date(dataInput.value + "T00:00");

        hojeData = new Date();
        hojeData.setHours(0, 0, 0, 0);

        let minHora = "09:00";
        const maxHora = "18:00";

        // se a data for hoje → mínimo = agora
        if (dataEscolhida.getTime() === hojeData.getTime()) {
            const h = String(agora.getHours()).padStart(2, '0');
            const m = String(agora.getMinutes()).padStart(2, '0');
            minHora = `${h}:${m}`;
        }

        horaInput.setAttribute('min', minHora);
        horaInput.setAttribute('max', maxHora);

        // se já houver valor inválido, limpa
        if (horaInput.value && horaInput.value < minHora) {
            horaInput.value = "";
        }

        console.log("Data válida:", dataInput.value);
    });

    // valida toda mudança de hora
    horaInput.addEventListener('change', () => {

        if (!dataInput.value) {
            alert("Selecione a data antes de escolher o horário.");
            horaInput.value = "";
            horaInput.disabled = true;
            return;
        }

        const hora = horaInput.value;

        if (!hora) return;

        const dataHoraEscolhida = new Date(`${dataInput.value}T${hora}`);
        const agoraDataHora = new Date();

        // ❌ bloqueia qualquer horário no passado
        if (dataHoraEscolhida < agoraDataHora) {
            alert("Não é permitido escolher um horário anterior ao momento atual.");
            horaInput.value = "";
            return;
        }

        // ❌ fora do expediente
        if (hora < "09:00" || hora > "18:00") {
            alert("Horário fora do expediente (09:00 - 18:00).");
            horaInput.value = "";
            return;
        }

        console.log("Hora válida:", hora);
    });

    // ============================
    // CONTROLE DE USUÁRIO LOGADO
    // ============================
    let usuarioLogado = null;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            usuarioLogado = user;
        } else {
            alert("Você precisa estar logado para acessar esta página.");
            window.location.href = "../login.html";
        }
    });

    // ============================
    // BOTÃO AGENDAR
    // ============================
    const agendarBtn = document.getElementById('agendarBtn');

    agendarBtn.addEventListener('click', () => {

        if (!servicoSelecionado) {
            alert("Selecione um serviço.");
            return;
        }

        if (!dataInput.value || !horaInput.value) {
            alert("Selecione data e horário.");
            return;
        }

        if (!usuarioLogado) {
            alert("Você precisa estar logado.");
            return;
        }

        const dataHoraEscolhida = new Date(`${dataInput.value}T${horaInput.value}`);
        const agoraDataHora = new Date();

        // ✅ agora dataEscolhida e hojeData EXISTEM
        if (dataEscolhida && hojeData) {
            if (dataEscolhida.getTime() === hojeData.getTime()) {
                if (dataHoraEscolhida < agoraDataHora) {
                    alert("Não é permitido escolher um horário anterior ao momento atual.");
                    return;
                }
            }
        }

        const agendamentoData = {
            servico: servicoSelecionado,
            data: dataInput.value,
            hora: horaInput.value,
            uid: usuarioLogado.uid,
            criadoEm: new Date()
        };

        console.log("📦 Enviando:", agendamentoData);

        firebase.firestore()
            .collection("agendamentos")
            .add(agendamentoData)
            .then(doc => {
                console.log("✅ SALVO:", doc.id);
                alert("Agendamento salvo com sucesso!");
            })
            .catch(err => {
                console.error("❌ ERRO:", err);
                alert("Erro ao salvar: " + err.message);
            });
        alert("Agendamento realizado com sucesso!");
    });

});
