import React, { useEffect, useState } from 'react';
import UsuarioService from '../../services/UsuarioService';

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        UsuarioService.getUsuarios()
            .then((data) => {
                console.log('Usuarios obtenidos en el componente:', data); // Verifica los datos aquí
                setUsuarios(data);
            })
            .catch((err) => {
                console.error('Error al obtener usuarios:', err);
                setError('Error al obtener usuarios');
            });
    }, []);

    //console.log('Estado usuarios antes de renderizar:', usuarios); // Verifica el estado

    return (
        <div>
            <h1>Lista de Usuarios</h1>
            {error ? <p>{error}</p> : null}
            <ul>
                {Array.isArray(usuarios) && usuarios.map((usuario) => (
                    <li key={usuario._id}>
                        {usuario.nombre} - Rol: {usuario.rol}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsuarioList;
