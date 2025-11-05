// Carga las variables de entorno (.env)
require('dotenv').config();

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); 

const app = express();
const prisma = new PrismaClient(); 
const PORT = process.env.PORT || 3000;

// === MIDDLEWARE (HERRAMIENTAS BÁSICAS) ===
app.use(express.json()); 
app.use(cors()); 

// === ENDPOINTS DEL MVP (P4) ===

// 1. 🚀 POST: CREAR un nuevo pedido (Función Clave del MVP)
app.post('/api/pedidos', async (req, res) => {
    try {
        const { direccion, cliente, detalles } = req.body;

        if (!direccion || !cliente) {
            return res.status(400).json({ error: "Dirección y Cliente son obligatorios." });
        }

        const nuevoPedido = await prisma.pedido.create({
            data: { direccion, cliente, detalles },
        });

        res.status(201).json(nuevoPedido); 

    } catch (error) {
        console.error("Error al crear el pedido:", error);
        res.status(500).json({ error: "Error interno del servidor. Revisa tu conexión a PostgreSQL." });
    }
});

// 2. 📝 GET: LISTAR todos los pedidos (Segunda parte del P4)
app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await prisma.pedido.findMany({
            orderBy: { fechaCreacion: 'desc' }, 
        });
        res.status(200).json(pedidos);
    } catch (error) {
        console.error("Error al listar pedidos:", error);
        res.status(500).json({ error: "No se pudieron obtener los pedidos." });
    }
});

// 3. 🩺 GET: Endpoint de Salud (Verificación rápida para Render)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Servidor LOGISTUC activo. Backend funcional.' });
});


// 🚀 Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en el puerto ${PORT}`);
});