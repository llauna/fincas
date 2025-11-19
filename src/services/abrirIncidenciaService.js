// src/services/abrirIncidenciaService.js
const API_BASE_URL = 'http://localhost:3001';

export async function obtenerIncidencia(id) {
    const res = await fetch(`${API_BASE_URL}/api/incidencias/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function crearIncidencia(data) {
    const res = await fetch(`${API_BASE_URL}/api/incidencias`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function actualizarIncidencia(id, data) {
    const res = await fetch(`${API_BASE_URL}/api/incidencias/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
