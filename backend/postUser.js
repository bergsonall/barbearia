window.registerUserData = async function registerUserData(payload, idToken) {
    const res = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
            "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
        console.error("Erro API:", data);
        throw new Error(data?.error?.message || "Erro ao cadastrar usuário");
        }

        console.log("API status:", res.status);
        console.log("Usuário cadastrado/atualizado:", data);
}