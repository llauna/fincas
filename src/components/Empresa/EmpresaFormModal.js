// components/Empresa/EmpresaFormModal.js
import React from 'react';

const EmpresaFormModal = ({
                              show,
                              editMode,
                              formData,
                              comunidades,
                              formError,
                              handleChange,
                              handleChangeComunidades,
                              handleSubmit,
                              handleClose
                          }) => {
    if (!show) return null;

    return (
        <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            {editMode ? 'Editar Empresa' : 'Registrar Nueva Empresa'}
                        </h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        {formError && <div className="alert alert-danger">{formError}</div>}
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label className="form-label">Comunidades</label>
                                <select
                                    className="form-control"
                                    name="comunidades"
                                    value={formData.comunidades}
                                    onChange={handleChangeComunidades}
                                    multiple
                                    required
                                >
                                    {comunidades.map(com => (
                                        <option key={com._id} value={com._id}>
                                            {com.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
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
                                    required
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
                                <label className="form-label">CIF</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="cif"
                                    value={formData.cif}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary">
                                    {editMode ? '💾 Guardar Cambios' : '💾 Guardar Empresa'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmpresaFormModal;
