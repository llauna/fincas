// src/hooks/usePerfil.js
import { useState, useEffect } from 'react';

export default function usePerfil(token) {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        fetch('http://localhost:3001/api/usuarios/perfil', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setPerfil(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("❌ Error cargando perfil:", err);
                setLoading(false);
            });
    }, [token]);

    return { perfil, loading };
}
