window.consultServiceId = async function consultServiceId(servicoSelecionado) {
    const user = firebase.auth().currentUser;
    const idToken = await user.getIdToken();

    const filter = encodeURIComponent(JSON.stringify({
        where: { nome: servicoSelecionado },
        limit: 1
    }));

    const res = await fetch(`${API}/servicos/?filter=${filter}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
            "ngrok-skip-browser-warning": "true"
        }
    });

    const data = await res.json().catch(() => ([]))

    if (!res.ok) {
        console.error("Erro API:", data);
        throw new Error(data?.error?.message || "Erro ao buscar serviço");
    }
    const service = Array.isArray(data) ? data[0] : null;

    if (!service) {
        throw new Error("Serviço não encontrado no banco (não cadastrado).");
    }

    console.log("API status:", res.status);
    console.log("User Data:", data);
    
    return service; // aqui você já tem id do MySQL, nome, email, etc
}