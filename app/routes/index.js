const eventsRoutes = require('./events_routes');
const usersRoutes = require('./users_routes');

module.exports = function(app) {
  app.use(eventsRoutes)
  app.use(usersRoutes);

  // Тут, позже, будут и другие обработчики маршрутов
};
