const Sequelize = require("sequelize");

const sequelize = new Sequelize("gemsdb", "root", "Spd090303", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = sequelize;
