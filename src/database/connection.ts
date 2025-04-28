import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  models: [__dirname + "/models"],
  pool: {
    max: 50,
    min: 5,
    acquire: 60000,
    idle: 10000,
  },
});

console.log(process.env.DB_HOST);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Syncing the models with the database
// sequelize.sync({ alter: false });

// Syncing the models with the database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synchronized!");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

// Relationship

export default sequelize;
