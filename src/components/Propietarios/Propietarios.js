import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/propiedades.css';
import {
    getPropietarios,
    getEmpresas,
    getComunidades,
    createPropietario,
    updatePropietario,
    deletePropietario
} from '../../api/api';
import PropietarioFormModal from './PropietarioFormModal';

// Componente para verificar autenticación
const withAuth = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        
        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
            }
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };
};

const Propietarios = () => {
    const navigate = useNavigate();
    const [propietarios, setPropietarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [comunidades, setComunidades] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPropietarioId, setEditingPropietarioId] = useState(null);
    const [formSubmitError, setFormSubmitError] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        gestorFinca: '',
        comunidades: []
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            const [propietariosData, empresasData, comunidadesData] = await Promise.all([
                getPropietarios().catch(err => {
                    console.error('Error al obtener propietarios:', err);
                    return [];
                }),
                getEmpresas().catch(err => {
                    console.error('Error al obtener empresas:', err);
                    return [];
                }),
                getComunidades().catch(err => {
                    console.error('Error al obtener comunidades:', err);
                    return [];
                })
            ]);

            setPropietarios(Array.isArray(propietariosData) ? propietariosData : []);
            setEmpresas(Array.isArray(empresasData) ? empresasData : []);
            setComunidades(Array.isArray(comunidadesData) ? comunidadesData : []);
            
            console.log('Datos cargados:', {
                propietarios: propietariosData,
                empresas: empresasData,
                comunidades: comunidadesData
            });
        } catch (error) {
            console.error('❌ Error al obtener datos:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                alert('Error al cargar los datos. Por favor, inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Usar useCallback para memoizar fetchData
    const fetchDataMemoized = React.useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            // Obtener los datos en paralelo
            const [propietariosResponse, empresasResponse, comunidadesResponse] = await Promise.all([
                getPropietarios(),
                getEmpresas(),
                getComunidades()
            ]);

            // Verificar que las respuestas sean arrays
            const propietariosData = Array.isArray(propietariosResponse) ? propietariosResponse : [];
            const empresasData = Array.isArray(empresasResponse) ? empresasResponse : [];
            const comunidadesData = Array.isArray(comunidadesResponse) ? comunidadesResponse : [];

            setPropietarios(propietariosData);
            setEmpresas(empresasData);
            setComunidades(comunidadesData);
            
            console.log('Datos cargados:', {
                propietarios: propietariosData,
                empresas: empresasData,
                comunidades: comunidadesData
            });
        } catch (error) {
            console.error('❌ Error al obtener datos:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                alert('Error al cargar los datos. Por favor, inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]); // Solo dependemos de navigate

    // Llamar a fetchDataMemoized cuando el componente se monte
    useEffect(() => {
        fetchDataMemoized();
    }, [fetchDataMemoized]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangeComunidades = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setFormData({ ...formData, comunidades: selectedOptions });
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            telefono: '',
            email: '',
            gestorFinca: '',
            comunidades: []
        });
        setFormSubmitError('');
        setIsEditing(false);
        setEditingPropietarioId(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleEdit = (id) => {
        const propietarioToEdit = propietarios.find(p => p._id === id);
        if (propietarioToEdit) {
            const comunidadesIDs = propietarioToEdit.comunidades
                ? propietarioToEdit.comunidades.map(c => c._id || c)
                : [];
            setFormData({
                nombre: propietarioToEdit.nombre,
                telefono: propietarioToEdit.telefono,
                email: propietarioToEdit.email,
                gestorFinca: propietarioToEdit.gestorFinca || '',
                comunidades: comunidadesIDs
            });
            setIsEditing(true);
            setEditingPropietarioId(id);
            setShowModal(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitError('');
        try {
            const dataToSend = {
                ...formData,
                gestorFincaId: formData.gestorFinca,  // Map gestorFinca to gestorFincaId
                comunidadesIds: formData.comunidades   // Map comunidades to comunidadesIds
            };

            if (isEditing) {
                await updatePropietario(editingPropietarioId, formData);
            } else {
                await createPropietario(dataToSend);
            }
            resetForm();
            await fetchData();
            setShowModal(false);
        } catch (error) {
            console.error('❌ Error al guardar propietario:', error);
            setFormSubmitError('Error al guardar propietario. Por favor, verifica los campos.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este propietario?')) {
            try {
                await deletePropietario(id);
                fetchData();
            } catch (error) {
                console.error('❌ Error al eliminar propietario:', error);
                alert('Error al eliminar propietario.');
            }
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const getGestorNombre = (gestor) => {
        // Si gestor es un objeto (ya está poblado)
        if (gestor && typeof gestor === 'object') {
            return gestor.nombre || 'Sin nombre';
        }
        // Si es solo un ID, buscamos en el array de empresas
        if (gestor) {
            const gestorEncontrado = empresas.find(emp => emp._id === gestor);
            return gestorEncontrado ? gestorEncontrado.nombre : 'Sin gestor';
        }
        return 'Sin gestor';
    };

    const getComunidadesNombres = (comunidadesData) => {
        // Si no hay datos o el array está vacío
        if (!comunidadesData || !Array.isArray(comunidadesData) || comunidadesData.length === 0) {
            return 'Sin comunidades';
        }
        
        // Si el primer elemento es un objeto (ya está poblado)
        if (typeof comunidadesData[0] === 'object') {
            return comunidadesData.map(c => c.nombre).join(', ');
        }
        
        // Si es un array de IDs, buscamos en el array de comunidades
        const comunidadesRelacionadas = comunidades.filter(c => 
            comunidadesData.includes(c._id)
        );
        
        return comunidadesRelacionadas.length > 0 
            ? comunidadesRelacionadas.map(c => c.nombre).join(', ')
            : 'Sin comunidades';
    };

    if (loading) {
        return <div className="container mt-4">Cargando datos...</div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Gestión de Propietarios</h1>
            <button
                className="btn btn-primary"
                onClick={() => {

                    setIsEditing(false);
                    setShowModal(true);
                }}
            >
                ➕ Registrar Nuevo Propietario
            </button>

            {/* Modal de alta/edición */}
            <PropietarioFormModal
                show={showModal}
                isEditing={isEditing}
                formData={formData}
                empresas={empresas}
                comunidades={comunidades}
                formSubmitError={formSubmitError}
                handleChange={handleChange}
                handleChangeComunidades={handleChangeComunidades}
                handleSubmit={handleSubmit}
                handleClose={handleCloseModal}
            />

            {/* Tabla de propietarios */}
            <h2 className="mt-5">Listado de Propietarios</h2>
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Gestor de Finca</th>
                    <th>Comunidades</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {propietarios.map(prop => (
                    <tr key={prop._id}>
                        <td>{prop.nombre}</td>
                        <td>{prop.telefono}</td>
                        <td>{prop.email}</td>
                        <td>{getGestorNombre(prop.gestorFinca)}</td>
                        <td>{getComunidadesNombres(prop.comunidades)}</td>
                        <td>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(prop._id)}>
                                Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(prop._id)}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={handleGoBack} className="btn btn-secondary mt-3">
                Volver
            </button>
        </div>
    );
};

// Exportar el componente envuelto en el HOC de autenticación
export default withAuth(Propietarios);
