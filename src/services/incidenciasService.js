// incidenciasService.js
export async function obtenerIncidencias(token) {
    const url = 'http://localhost:3001/api/incidencias'; // ✅ Cambia por la URL real de tu backend

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Error al obtener incidencias');
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
    }
    return data;
}
