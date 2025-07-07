const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('my_database', 'Ankit', '*******', {
  host: 'Local instance MySQL80',
  dialect: 'mysql',
});
sequelize
  .authenticate()
  .then(() => console.log('connected to mysql '))
  .catch((error) => console.error('Unable to connect to mysql ', error));
module.exports = sequelize;
