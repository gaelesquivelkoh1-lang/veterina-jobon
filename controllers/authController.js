const bcrypt = require('bcrypt');
const { Usuario } = require('../models/index');

// Mostrar pantalla de login
exports.mostrarLogin = (req, res) => {
  if (req.session.usuario) {
    return res.redirect('/ventas');
  }
  res.render('auth/login', { error: null });
};

// Procesar el login
exports.procesarLogin = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    const usuarioEncontrado = await Usuario.findOne({ where: { usuario } });

    if (!usuarioEncontrado || !usuarioEncontrado.activo) {
      return res.render('auth/login', { error: 'Usuario o contraseña incorrectos' });
    }

    const passwordValido = await bcrypt.compare(password, usuarioEncontrado.password);

    if (!passwordValido) {
      return res.render('auth/login', { error: 'Usuario o contraseña incorrectos' });
    }

    // Guardar en la sesión (solo lo necesario, nunca la contraseña)
    req.session.usuario = {
      id: usuarioEncontrado.id,
      nombre: usuarioEncontrado.nombre,
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol,
    };

    // Los vendedores van directo al punto de venta, los admins también (pueden navegar a todo)
    res.redirect('/ventas');
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.render('auth/login', { error: 'Ocurrió un error, intenta de nuevo' });
  }
};

// Cerrar sesión
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};