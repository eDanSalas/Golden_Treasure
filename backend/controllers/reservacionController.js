const { createReservation, getAllReservaciones, updateReservacion, deleteReservacion } = require('../services/reservacionService');

const addReservation = async (req, res) => {
    const { numero_reservacion, nombre, correo, cantidad_personas } = req.body;

    if (!numero_reservacion || !nombre || !correo || !cantidad_personas) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
        const newUser = await createReservation({ numero_reservacion, nombre, correo, cantidad_personas });
        res.status(201).json({ message: 'Reservacion agregada correctamente', id: newUser.id });
    } catch (error) {
        if (error.message === 'DUPLICATE_RESERVATION') {
        return res.status(409).json({ message: 'Ya existe un usuario con ese número de reservación' });
        }

        console.error('Error al agregar usuario:', error);
        res.status(500).json({ message: 'Error al agregar usuario' });
    }
};

const obtenerTodas = async (req, res) => {
    try {
        const datos = await getAllReservaciones();
        res.status(200).json(datos);
    } catch (err) {
        console.log("Error en obtener reservaciones: ", err);
        res.status(500).json({ message: 'Error al obtener reservaciones' });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;
        await updateReservacion(id, nuevosDatos);
        res.status(200).json({ message: 'Reservación actualizada' });
    } catch (err) {
        console.log("Error al editar registro. ", err);
        res.status(500).json({ message: 'Error al actualizar' });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteReservacion(id);
        res.status(200).json({ message: 'Reservación eliminada' });
    } catch (err) {
        console.log("Error al eliminar: ", err);
        res.status(500).json({ message: 'Error al eliminar' });
    }
};

module.exports = {
    addReservation,
    obtenerTodas,
    actualizar,
    eliminar
};