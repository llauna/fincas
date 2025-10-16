// src/components/Menu.js
import React from 'react';
import { Link } from 'react-router-dom';
import usePerfil from '../hooks/usePerfil';

export default function Menu({ token }) {
    const { perfil, loading } = usePerfil(token);

    if (loading) return <p>Cargando menú...</p>;
    if (!perfil) return <p>No se encontró el perfil.</p>;

    const opcionesMenu = [];

    if (perfil.rol === "Administrador") {
        opcionesMenu.push({ nombre: "Panel de Administración", ruta: "/admin" });
        opcionesMenu.push({ nombre: "Gestión de Usuarios", ruta: "/perfil" });
        opcionesMenu.push({ nombre: "Reportes", ruta: "/reportes" });
        opcionesMenu.push({ nombre: "Configuración", ruta: "/configuracion" }); // ✅ enlace a Configuración
    }
    if (perfil.rol === "Propietario") {
        opcionesMenu.push({ nombre: "Mis Propiedades", ruta: "/propiedades" });
        opcionesMenu.push({ nombre: "Gestión de Inquilinos", ruta: "/inquilinos" });
    }
    if (perfil.rol === "Usuario_1") {
        opcionesMenu.push({ nombre: "Mis Reservas", ruta: "/reservas" });
        opcionesMenu.push({ nombre: "Soporte", ruta: "/soporte" });
    }
    if (perfil.rol === "Usuario_2") {
        opcionesMenu.push({ nombre: "Ver Información", ruta: "/informacion" });
        opcionesMenu.push({ nombre: "Soporte", ruta: "/soporte" });
    }

    if (perfil.tipo === "empleado") {
        opcionesMenu.push({ nombre: "Tareas Asignadas", ruta: "/tareas" });
        opcionesMenu.push({ nombre: "Calendario de Trabajo", ruta: "/calendario" });
    }
    if (perfil.tipo === "cliente") {
        opcionesMenu.push({ nombre: "Mis Pagos", ruta: "/pagos" });
        opcionesMenu.push({ nombre: "Historial de Servicios", ruta: "/historial" });
    }

    return (
        <div>
            <h2>Menú de {perfil.nombre}</h2>
            <ul>
                {opcionesMenu.map((opcion, index) => (
                    <li key={index}>
                        <Link to={opcion.ruta}>{opcion.nombre}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
