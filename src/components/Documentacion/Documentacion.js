// src/components/Documentacion/Documentacion.js
import React from 'react';

const Documentacion = () => {
    return (
        <div className="container mt-4">
            <h2>Documentación</h2>
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card mb-3">
                        <div className="card-header">
                            <h5>Actas de Reuniones</h5>
                        </div>
                        <div className="card-body">
                            <div className="list-group">
                                <a href="/templates/acta-reunion.docx" className="list-group-item list-group-item-action">
                                    Plantilla Acta de Reunión
                                </a>
                                <a href="/templates/acta-junta.docx" className="list-group-item list-group-item-action">
                                    Plantilla Acta de Junta
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Estados Financieros</h5>
                        </div>
                        <div className="card-body">
                            <div className="list-group">
                                <a href="/templates/balance.xlsx" className="list-group-item list-group-item-action">
                                    Plantilla Balance
                                </a>
                                <a href="/templates/estado-cuentas.xlsx" className="list-group-item list-group-item-action">
                                    Plantilla Estado de Cuentas
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documentacion;