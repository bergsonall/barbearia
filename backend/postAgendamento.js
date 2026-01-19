window.registerAgendamento = async function registerAgendamento(payload) {
    const user = firebase.auth().currentUser;
    if (!user) throw new Error("Usuário não autenticado");
    const idToken = await user.getIdToken();

    const res = await fetch(`${API}/agendamentos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
        console.error("Erro API:", data);
        throw new Error(data?.error?.message || "Erro ao agendar serviço");
        }

        console.log("API status:", res.status);
        console.log("Agendamento cadastrado/atualizado:", data);
}