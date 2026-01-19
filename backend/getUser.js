window.consultUserId = async function consultUserId() {
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    const idToken = await user.getIdToken();

    const filter = encodeURIComponent(JSON.stringify({
        where: { firebase_uid: uid },
        limit: 1
    }));

    const res = await fetch(`${API}/usuarios/?filter=${filter}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
        }
    });

    const data = await res.json().catch(() => ([]))

    if (!res.ok) {
        console.error("Erro API:", data);
        throw new Error(data?.error?.message || "Erro ao buscar usuário");
    }
    const usuario = Array.isArray(data) ? data[0] : null;

    if (!usuario) {
        throw new Error("Usuário não encontrado no banco (não cadastrado).");
    }

    console.log("API status:", res.status);
    console.log("User Data:", data);
    
    return usuario; // aqui você já tem id do MySQL, nome, email, etc
}