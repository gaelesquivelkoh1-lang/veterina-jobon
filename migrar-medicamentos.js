// Script de una sola vez: prepara la tabla detalle_ventas para vender medicamentos.
// Es seguro correrlo más de una vez. No borra ni modifica datos existentes.
//
// Uso (desde la carpeta del proyecto):  node migrar-medicamentos.js

const sequelize = require('./config/database');

(async () => {
  try {
    const [columnas] = await sequelize.query('SHOW COLUMNS FROM detalle_ventas');
    const nombres = columnas.map((c) => c.Field);

    // 1. Agregar la columna medicamentoId si no existe
    if (!nombres.includes('medicamentoId')) {
      await sequelize.query('ALTER TABLE detalle_ventas ADD COLUMN medicamentoId INT NULL');
      console.log('Columna medicamentoId agregada.');
    } else {
      console.log('La columna medicamentoId ya existia.');
    }

    // 2. Permitir el valor "medicamento" en tipo_item (conserva los valores actuales)
    await sequelize.query(
      "ALTER TABLE detalle_ventas MODIFY COLUMN tipo_item ENUM('alimento','accesorio','medicamento') NOT NULL DEFAULT 'alimento'"
    );
    console.log('Columna tipo_item actualizada.');

    console.log('Listo.');
    process.exit(0);
  } catch (error) {
    console.error('Error en la migracion:', error.message);
    process.exit(1);
  }
})();