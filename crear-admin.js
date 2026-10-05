const sequelize = require('./config/database');
const bcrypt = require('bcrypt');
const { Usuario } = require('./models/index');

async function crearAdmin() {
  try {
    await sequelize.sync();

    const existe = await Usuario.findOne({ where: { usuario: 'admin' } });
    if (existe) {
      console.log('⚠️  Ya existe un usuario con el nombre "admin". No se creó ninguno nuevo.');
      process.exit(0);
    }

    const passwordEncriptada = await bcrypt.hash('admin123', 10);

    await Usuario.create({
      nombre: 'Administrador',
      usuario: 'admin',
      password: passwordEncriptada,
      rol: 'admin',
      activo: true,
    });

    console.log('✅ Usuario administrador creado correctamente');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
    console.log('   ⚠️  Cámbiala después de tu primer inicio de sesión.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear el usuario administrador:', error);
    process.exit(1);
  }
}

crearAdmin();