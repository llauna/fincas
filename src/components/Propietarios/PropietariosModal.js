import React from 'react';

const PropietariosModal = ({ propietarios, onClose }) => {
    return (
        <div className="modal fade show custom-modal" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Propietarios de la Comunidad</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <ul>
                            {propietarios.map(p => (
                                <li key={p._id}>{p.nombre} - {p.telefono}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropietariosModal;
