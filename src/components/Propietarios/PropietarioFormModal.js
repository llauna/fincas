// components/Propietarios/PropietarioFormModal.js
import React from 'react';

const PropietarioFormModal = ({
                                  show,
                                  isEditing,
                                  formData,
                                  empresas,
                                  comunidades,
                                  formSubmitError,
                                  handleChange,
                                  handleChangeComunidades,
                                  handleSubmit,
                                  handleClose
                              }) => {
    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            {isEditing ? 'Editar Propietario' : 'Registrar Propietario'}
                        </h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        {formSubmitError && <div className="alert alert-danger">{formSubmitError}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Teléfono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Gestor de Finca</label>
                                <select
                                    className="form-control"
                                    name="gestorFinca"
                                    value={formData.gestorFinca}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un gestor</option>
                                    {empresas.map(emp => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Comunidades</label>
                                <select
                                    className="form-control"
                                    name="comunidades"
                                    value={formData.comunidades}
                                    onChange={handleChangeComunidades}
                                    multiple
                                >
                                    {comunidades.map(com => (
                                        <option key={com._id} value={com._id}>
                                            {com.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-success">
                                {isEditing ? 'Guardar Cambios' : 'Registrar'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropietarioFormModal;
