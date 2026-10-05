const Producto = require('./Producto');
const Venta = require('./Venta');
const DetalleVenta = require('./DetalleVenta');
const Usuario = require('./Usuario');
const Accesorio = require('./Accesorio');

// Una venta tiene muchos detalles (productos vendidos)
Venta.hasMany(DetalleVenta, { foreignKey: 'ventaId', as: 'detalles' });
DetalleVenta.belongsTo(Venta, { foreignKey: 'ventaId' });

// Un producto (alimento) puede aparecer en muchos detalles de venta
Producto.hasMany(DetalleVenta, { foreignKey: 'productoId' });
DetalleVenta.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

// Un accesorio puede aparecer en muchos detalles de venta
Accesorio.hasMany(DetalleVenta, { foreignKey: 'accesorioId' });
DetalleVenta.belongsTo(Accesorio, { foreignKey: 'accesorioId', as: 'accesorio' });

// Un usuario puede hacer muchas ventas
Usuario.hasMany(Venta, { foreignKey: 'usuarioId' });
Venta.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'vendedor' });

module.exports = { Producto, Venta, DetalleVenta, Usuario, Accesorio };