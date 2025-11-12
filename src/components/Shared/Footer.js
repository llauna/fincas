// pie de pagina
const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            textAlign: 'center',
            padding: '10px',
            position: 'fixed',
            bottom: '0',
            width: '100%'
        }}>
            <p>&copy; 2023 Administración de Fincas. Todos los derechos reservados.</p>
            <p>Contacto: admin@fincas.com | Teléfono: +34 123 456 789</p>
        </footer>
    );
};

export default Footer;

