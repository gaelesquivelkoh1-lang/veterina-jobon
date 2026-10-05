const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Accesorio = sequelize.define('Accesorio', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true, // ej. "Perro", "Gato", "Ganado"
  },
  precio_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  precio_venta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  proveedor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha_entrega: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  fecha_recibido: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'accesorios',
  timestamps: true,
});

module.exports = Accesorio;