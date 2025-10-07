// src/components/Menu.js
import React from 'react';
import usePerfil from '../hooks/usePerfil';

export default function Menu({ token }) {
    const { perfil, loading } = usePerfil(token);

    if (loading) return <p>Cargando menú...</p>;
    if (!perfil) return <p>No se encontró el perfil.</p>;

    const opcionesMenu = [];

    if (perfil.rol === "Administrador") {
        opcionesMenu.push("Panel de Administración", "Gestión de Usuarios", "Reportes");
    }
    if (perfil.rol === "Propietario") {
        opcionesMenu.push("Mis Propiedades", "Gestión de Inquilinos");
    }
    if (perfil.rol === "Usuario_1") {
        opcionesMenu.push("Mis Reservas", "Soporte");
    }
    if (perfil.rol === "Usuario_2") {
        opcionesMenu.push("Ver Información", "Soporte");
    }

    if (perfil.tipo === "empleado") {
        opcionesMenu.push("Tareas Asignadas", "Calendario de Trabajo");
    }
    if (perfil.tipo === "cliente") {
        opcionesMenu.push("Mis Pagos", "Historial de Servicios");
    }

    return (
        <div>
            <h2>Menú de {perfil.nombre}</h2>
            <ul>
                {opcionesMenu.map((opcion, index) => (
                    <li key={index}>{opcion}</li>
                ))}
            </ul>
        </div>
    );
}
