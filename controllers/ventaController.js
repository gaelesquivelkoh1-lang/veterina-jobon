const { Producto, Venta, DetalleVenta, Accesorio, Medicamento } = require('../models/index');

// Mostrar la pantalla del punto de venta
exports.mostrarPuntoVenta = (req, res) => {
  res.render('ventas/punto-de-venta');
};

// Registrar una venta nueva
exports.crearVenta = async (req, res) => {
  const sequelize = require('../config/database');
  const t = await sequelize.transaction();

  try {
    const { items, monto_pagado } = req.body;
    // items: [{ tipo: 'alimento'|'accesorio'|'medicamento', id, tipo_venta, cantidad, precio_unitario, subtotal }, ...]

    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const total = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const pagado = parseFloat(monto_pagado) || 0;
    const cambio = pagado - total;

    if (cambio < 0) {
      await t.rollback();
      return res.status(400).json({ error: 'El monto pagado es menor al total de la venta' });
    }

    const venta = await Venta.create({
      total,
      monto_pagado: pagado,
      cambio,
      usuarioId: req.session.usuario.id,
    }, { transaction: t });

    const detallesParaRecibo = [];

    for (const item of items) {
      if (item.tipo === 'accesorio') {
        // ===== LÓGICA PARA ACCESORIOS (por pieza) =====
        await DetalleVenta.create({
          ventaId: venta.id,
          accesorioId: item.id,
          tipo_item: 'accesorio',
          tipo_venta: 'pieza',
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
        }, { transaction: t });

        const accesorio = await Accesorio.findByPk(item.id, { transaction: t });
        const nuevoStock = accesorio.stock - parseInt(item.cantidad);

        if (nuevoStock < 0) {
          throw new Error(`Stock insuficiente para ${accesorio.nombre}`);
        }

        await accesorio.update({ stock: nuevoStock }, { transaction: t });

        detallesParaRecibo.push({
          nombre: accesorio.nombre,
          tipo_venta: 'pieza',
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
        });

      } else if (item.tipo === 'medicamento') {
        // ===== LÓGICA PARA MEDICAMENTOS (por pieza) =====
        await DetalleVenta.create({
          ventaId: venta.id,
          medicamentoId: item.id,
          tipo_item: 'medicamento',
          tipo_venta: 'pieza',
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
        }, { transaction: t });

        const medicamento = await Medicamento.findByPk(item.id, { transaction: t });
        const nuevoStock = medicamento.stock - parseInt(item.cantidad);

        if (nuevoStock < 0) {
          throw new Error(`Stock insuficiente para ${medicamento.nombre}`);
        }

        await medicamento.update({ stock: nuevoStock }, { transaction: t });

        detallesParaRecibo.push({
          nombre: medicamento.nombre,
          tipo_venta: 'pieza',
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
        });

      } else {
        // ===== LÓGICA PARA ALIMENTOS (por kilo/saco) =====
        await DetalleVenta.create({
          ventaId: venta.id,
          productoId: item.id,
          tipo_item: 'alimento',
          tipo_venta: item.tipo_venta,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
        }, { transaction: t });

        const producto = await Producto.findByPk(item.id, { transaction: t });
        let kilosADescontar = item.tipo_venta === 'saco'
          ? parseFloat(item.cantidad) * parseFloat(producto.peso_saco)
          : parseFloat(item.cantidad);

        const nuevoStock = parseFloat(producto.stock_kilos) - kilosADescontar;

        if (nuevoStock < 0) {
          throw new Error(`Stock insuficiente para ${producto.nombre}`);
        }

        await producto.update({ stock_kilos: nuevoStock }, { transaction: t });

        detallesParaRecibo.push({
          nombre: producto.nombre,
          tipo_venta: item.tipo_venta,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
        });
      }
    }

    await t.commit();

    res.json({
      success: true,
      ventaId: venta.id,
      total,
      monto_pagado: pagado,
      cambio,
      fecha: venta.fecha,
      items: detallesParaRecibo,
    });
  } catch (error) {
    await t.rollback();
    console.error('Error al crear venta:', error);
    res.status(500).json({ error: error.message || 'Error al procesar la venta' });
  }
};

// Mostrar historial de ventas
exports.mostrarHistorial = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const { fecha } = req.query;
    const usuarioActual = req.session.usuario;

    let condicion = {};

    if (fecha) {
      const inicio = new Date(fecha + 'T00:00:00');
      const fin = new Date(fecha + 'T23:59:59');
      condicion.fecha = { [Op.between]: [inicio, fin] };
    }

    if (usuarioActual.rol !== 'admin') {
      condicion.usuarioId = usuarioActual.id;
    }

    const ventas = await Venta.findAll({
      where: condicion,
      include: [
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [
            { model: Producto, as: 'producto' },
            { model: Accesorio, as: 'accesorio' },
            { model: Medicamento, as: 'medicamento' },
          ],
        },
        {
          model: require('../models/Usuario'),
          as: 'vendedor',
          attributes: ['id', 'nombre'],
        },
      ],
      order: [['fecha', 'DESC']],
    });

    const esAdmin = usuarioActual.rol === 'admin';
    let grupos = null;

    if (esAdmin) {
      // Agrupar las ventas por vendedor
      const mapa = {};
      ventas.forEach(venta => {
        const idVendedor = venta.vendedor ? venta.vendedor.id : 0;
        const nombreVendedor = venta.vendedor ? venta.vendedor.nombre : 'Usuario eliminado';

        if (!mapa[idVendedor]) {
          mapa[idVendedor] = {
            nombre: nombreVendedor,
            ventas: [],
            total: 0,
          };
        }
        mapa[idVendedor].ventas.push(venta);
        mapa[idVendedor].total += parseFloat(venta.total);
      });

      // Convertir a arreglo y ordenar por el que más vendió
      grupos = Object.values(mapa).sort((a, b) => b.total - a.total);
    }

    res.render('ventas/historial', {
      ventas,
      grupos,
      fechaFiltro: fecha || '',
      esAdmin,
    });
  } catch (error) {
    console.error('Error al cargar historial:', error);
    res.status(500).send('Error al cargar el historial de ventas');
  }
};

// Resumen de ventas de hoy (para el Punto de Venta)
exports.resumenHoyAPI = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const usuarioActual = req.session.usuario;

    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
    const fin = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59);

    const condicion = { fecha: { [Op.between]: [inicio, fin] } };

    // Los vendedores solo ven sus propias ventas; el admin ve todas
    if (usuarioActual.rol !== 'admin') {
      condicion.usuarioId = usuarioActual.id;
    }

    const ventasHoy = await Venta.findAll({ where: condicion });

    const totalHoy = ventasHoy.reduce((sum, v) => sum + parseFloat(v.total), 0);

    res.json({
      cantidadVentas: ventasHoy.length,
      totalHoy: totalHoy,
    });
  } catch (error) {
    console.error('Error al obtener resumen del día:', error);
    res.status(500).json({ error: 'Error al obtener el resumen' });
  }
};