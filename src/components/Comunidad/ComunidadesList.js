import React, { useState } from 'react';

const ComunidadesList = ({ comunidades, onVerPropietarios }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <button className="btn btn-link" onClick={toggleExpand}>
                {expanded ? 'Ocultar comunidades' : `Ver comunidades (${comunidades.length})`}
            </button>
            {expanded && (
                <ul>
                    {comunidades.map(c => (
                        <li key={c._id}>
                            {c.nombre}
                            <button
                                className="btn btn-sm btn-info ms-2"
                                onClick={() => onVerPropietarios(c._id)}
                            >
                                Ver propietarios
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ComunidadesList;
