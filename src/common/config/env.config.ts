export default () => ({
  env: process.env.ENV,
  port: parseInt(process.env.PORT, 10) || 3001,
  enableLogging: process.env.ENABLE_LOGGING === 'true',
  mongodb: process.env.MONGO_DB,
  postgresUser: process.env.POSTGRES_USER || 'root',
  postgresPassword: process.env.POSTGRES_ROOT_PASSWORD,
  postgresServer: process.env.POSTGRES_SERVER_NAME,
  postgresPort: process.env.POSTGRES_PORT,
  postgresDatabase: process.env.POSTGRES_DATABASE,
  jwtSecret: process.env.JWT_SECRET,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  apiVersion: process.env.API_VERSION,
  gitHead: process.env.GIT_HEAD,
});
