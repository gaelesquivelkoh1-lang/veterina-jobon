const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/database');
const { Producto, Venta, DetalleVenta, Usuario } = require('./models/index');
const productoRoutes = require('./routes/productoRoutes');
const accesorioRoutes = require('./routes/accesorioRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Configurar el almacenamiento de sesiones en la base de datos
const sessionStore = new SequelizeStore({ db: sequelize });

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 8 * 60 * 60 * 1000, // 8 horas de sesión
  },
}));

// Hacer disponible el usuario logueado en todas las vistas automáticamente
app.use((req, res, next) => {
  res.locals.usuarioActual = req.session.usuario || null;
  next();
});

app.use('/', authRoutes);
app.use('/productos', productoRoutes);
app.use('/accesorios', accesorioRoutes);
app.use('/ventas', ventaRoutes);

sequelize.sync()
  .then(() => {
    sessionStore.sync(); // crea la tabla de sesiones
    console.log('✅ Conexión y sincronización con la base de datos exitosa');
  })
  .catch((err) => console.error('❌ Error al conectar a la base de datos:', err));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

