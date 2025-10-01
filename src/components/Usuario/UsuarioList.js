import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/usuarios');
                setUsuarios(res.data);
            } catch (err) {
                setError('Error al obtener usuarios');
            }
        };
        fetchUsuarios();
    }, []);

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {usuarios.map(usuario => (
                    <li key={usuario._id}>{usuario.nombre}</li>
                ))}
            </ul>
        </div>
    );
};

export default ListaUsuarios;
