const sequelize = require('./config/database');
const bcrypt = require('bcrypt');
const { Usuario } = require('./models/index');

async function crearVendedor() {
  try {
    await sequelize.sync();

    const existe = await Usuario.findOne({ where: { usuario: 'vendedor1' } });
    if (existe) {
      console.log('⚠️  Ya existe un usuario con el nombre "vendedor1". No se creó ninguno nuevo.');
      process.exit(0);
    }

    const passwordEncriptada = await bcrypt.hash('vendedor123', 10);

    await Usuario.create({
      nombre: 'Juan Vendedor',
      usuario: 'vendedor1',
      password: passwordEncriptada,
      rol: 'vendedor',
      activo: true,
    });

    console.log('✅ Usuario vendedor creado correctamente');
    console.log('   Usuario: vendedor1');
    console.log('   Contraseña: vendedor123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear el usuario vendedor:', error);
    process.exit(1);
  }
}

crearVendedor();