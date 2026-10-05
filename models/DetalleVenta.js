const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleVenta = sequelize.define('DetalleVenta', {
  tipo_item: {
    type: DataTypes.ENUM('alimento', 'accesorio'),
    allowNull: false,
    defaultValue: 'alimento',
  },
  tipo_venta: {
    type: DataTypes.ENUM('kilo', 'saco', 'pieza'),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'detalle_ventas',
  timestamps: true,
});

module.exports = DetalleVenta;