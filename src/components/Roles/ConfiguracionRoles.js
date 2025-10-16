import React, { useEffect } from 'react';

function ConfiguracionRoles() {
    useEffect(() => {
        const cargarRoles = () => {
            console.log("Cargando roles...");
        };

        const cargarUsuarios = () => {
            console.log("Cargando usuarios...");
        };

        cargarRoles();
        cargarUsuarios();
    }, []); // Ya no hay warning

    return <div>Configuración de Roles</div>;
}

export default ConfiguracionRoles;

