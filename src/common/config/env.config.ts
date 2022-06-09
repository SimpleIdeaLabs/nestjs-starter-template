export default () => ({
  env: process.env.ENV,
  port: parseInt(process.env.PORT, 10) || 3001,
  mongodb: process.env.MONGO_DB,
  mysqlUser: process.env.MYSQL_USER || 'root',
  mysqlPassword: process.env.MYSQL_ROOT_PASSWORD,
  mysqlServer: process.env.MYSQL_SERVER_NAME,
  mysqlPort: process.env.MYSQL_PORT,
  mysqlDatabase: process.env.MYSQL_DATABASE,
});
