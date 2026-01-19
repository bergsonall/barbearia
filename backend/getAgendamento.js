window.consultAgendamentos = async function consultAgendamentos(dataISO) {
    const user = firebase.auth().currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    const idToken = await user.getIdToken();

    const filter = encodeURIComponent(JSON.stringify({
        "where": {
            "data": dataISO
        }
    }));

    const res = await fetch(`${API}/agendamentos?filter=${filter}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
        },
    });

    const data = await res.json().catch(() => ([]));

    if (!res.ok) {
        console.error("Erro API:", data);
        throw new Error(data?.error?.message || "Erro ao buscar agendamentos");
    }

    return Array.isArray(data) ? data : [];
};
