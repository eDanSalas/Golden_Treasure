const { createReservation, getAllReservaciones, getReservacionId, updateReservacion, deleteReservacion } = require('../services/reservacionService');

const addReservation = async (req, res) => {
    const { nombre, correo, extras, fin, habitacion, huespedes, inicio, noches, reserva, telefono, total } = req.body;

    if (!nombre || !correo || !Array.isArray(extras) || !fin|| !habitacion || !huespedes || !inicio || !noches || !reserva || !telefono || !total) {
        return res.status(400).json({ message: 'Faltan datos obligatorios o el formato es incorrecto' });
    }

    try {
        const newReservation = await createReservation({
            nombre, correo, extras,
            fin, habitacion, huespedes, inicio,
            noches, reserva, telefono, total
        });
        res.status(201).json({ message: 'Reservación agregada correctamente', id: newReservation.id, no_reservacion: newReservation.no_reservacion });
    } catch (error) {
        if (error.message === 'DUPLICATE_RESERVATION') {
            return res.status(409).json({ message: 'Ya existe una reservación con ese número' });
        }

        console.error('Error al agregar reservación:', error);
        res.status(500).json({ message: 'Error al agregar reservación' });
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

const obtenerReservacion = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Faltan el id que es obligatorio' });
    }

    try {
        const datos = await getReservacionId(id);
        res.status(200).json(datos);
    } catch (err) {
        console.log("Error en obtener reservaciones: ", err);
        res.status(500).json({ message: 'Error al obtener reservaciones' });
    }
}

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
    obtenerReservacion,
    actualizar,
    eliminar
};