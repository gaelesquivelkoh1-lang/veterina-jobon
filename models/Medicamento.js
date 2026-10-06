const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicamento = sequelize.define('Medicamento', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  presentacion: {
    type: DataTypes.STRING,
    allowNull: true, // ej. "Frasco 100 ml", "Tabletas", "Ampolleta", "Pipeta"
  },
  especie: {
    type: DataTypes.STRING,
    allowNull: true, // ej. "Perro", "Gato", "Ganado", "Aves", "Todas"
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
  lote: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fecha_caducidad: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  requiere_receta: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  proveedor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'medicamentos',
  timestamps: true,
});

module.exports = Medicamento;