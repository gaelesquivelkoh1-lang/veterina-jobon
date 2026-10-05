const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  peso_saco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // por si algún producto no se vende por saco
  },
  precio_kilo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // por si algún producto no se vende por kilo
  },
  precio_saco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  precio_compra: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  stock_kilos: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  stock_minimo: {
    type: DataTypes.DECIMAL(10, 2),
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
  tableName: 'productos',
  timestamps: true, // agrega createdAt y updatedAt automáticamente
});

module.exports = Producto;