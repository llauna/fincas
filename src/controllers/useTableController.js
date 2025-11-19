// useTableController.js
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export function useTableController(data = [], storageKey = 'tableConfig', defaultItemsPerPage = 5) {
    // 🔹 Cargar configuración previa desde localStorage
    const configGuardada = JSON.parse(localStorage.getItem(storageKey) || '{}');

    const [paginaActual, setPaginaActual] = useState(configGuardada.paginaActual || 1);
    const [itemsPorPagina, setItemsPorPagina] = useState(configGuardada.itemsPorPagina || defaultItemsPerPage);
    const [filtroTexto, setFiltroTexto] = useState(configGuardada.filtroTexto || '');
    const [ordenColumna, setOrdenColumna] = useState(configGuardada.ordenColumna || '');
    const [ordenDireccion, setOrdenDireccion] = useState(configGuardada.ordenDireccion || 'asc');

    // 🔹 Guardar configuración en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify({
            paginaActual,
            filtroTexto,
            ordenColumna,
            ordenDireccion,
            itemsPorPagina
        }));
    }, [paginaActual, filtroTexto, ordenColumna, ordenDireccion, itemsPorPagina, storageKey]);

    // 🔹 Filtrado por texto (busca en todas las columnas)
    const datosFiltrados = data.filter(row =>
        Object.values(row).some(val =>
            val?.toString().toLowerCase().includes(filtroTexto.toLowerCase())
        )
    );

    // 🔹 Ordenamiento
    const datosOrdenados = [...datosFiltrados].sort((a, b) => {
        if (!ordenColumna) return 0;
        let valorA = a[ordenColumna] || '';
        let valorB = b[ordenColumna] || '';

        if (valorA instanceof Date || ordenColumna.toLowerCase().includes('fecha')) {
            valorA = new Date(valorA);
            valorB = new Date(valorB);
        } else {
            valorA = valorA.toString().toLowerCase();
            valorB = valorB.toString().toLowerCase();
        }

        if (valorA < valorB) return ordenDireccion === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordenDireccion === 'asc' ? 1 : -1;
        return 0;
    });

    // 🔹 Paginación
    const indiceInicio = (paginaActual - 1) * itemsPorPagina;
    const indiceFin = indiceInicio + itemsPorPagina;
    const datosPaginados = datosOrdenados.slice(indiceInicio, indiceFin);
    const totalPaginas = Math.ceil(datosOrdenados.length / itemsPorPagina);

    // 🔹 Cambiar orden
    const cambiarOrden = (columna) => {
        if (ordenColumna === columna) {
            setOrdenDireccion(ordenDireccion === 'asc' ? 'desc' : 'asc');
        } else {
            setOrdenColumna(columna);
            setOrdenDireccion('asc');
        }
    };

    // 🔹 Exportar a CSV
    const exportToCSV = (filename = 'export.csv') => {
        if (!datosOrdenados.length) return;
        const headers = Object.keys(datosOrdenados[0]);
        const csvRows = [
            headers.join(','),
            ...datosOrdenados.map(row => headers.map(field => `"${row[field] ?? ''}"`).join(','))
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    // 🔹 Exportar a Excel
    const exportToExcel = (filename = 'export.xlsx') => {
        if (!datosOrdenados.length) return;
        const worksheet = XLSX.utils.json_to_sheet(datosOrdenados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
        XLSX.writeFile(workbook, filename);
    };

    return {
        datosPaginados,
        datosOrdenados,
        paginaActual,
        setPaginaActual,
        totalPaginas,
        filtroTexto,
        setFiltroTexto,
        ordenColumna,
        ordenDireccion,
        cambiarOrden,
        itemsPorPagina,
        setItemsPorPagina,
        exportToCSV,
        exportToExcel
    };
}
