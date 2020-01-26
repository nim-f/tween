const eventsRoutes = require('./events_routes');
const usersRoutes = require('./users_routes');
const attendeesRoutes = require('./attendees_routes');

module.exports = function(app) {
  app.use(eventsRoutes)
  app.use(usersRoutes);
  app.use(attendeesRoutes);

  // Тут, позже, будут и другие обработчики маршрутов
};
