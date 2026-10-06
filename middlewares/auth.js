
// Verifica que haya una sesión activa
exports.requiereLogin = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/');
  }

  next();
};

// Verifica que el usuario sea admin
exports.requiereAdmin = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/');
  }

  if (req.session.usuario.rol !== 'admin') {
    return res.status(403).send(
      'No tienes permiso para acceder a esta sección (solo administradores)'
    );
  }

  next();
};

// Verifica que el usuario sea admin o vendedor
exports.requiereAdminOVendedor = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect('/');
  }

  if (
    req.session.usuario.rol !== 'admin' &&
    req.session.usuario.rol !== 'vendedor'
  ) {
    return res.status(403).send(
      'No tienes permiso para acceder a esta sección'
    );
  }

  next();
};

