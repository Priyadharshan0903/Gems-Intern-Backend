const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Invitation = sequelize.define("Invitation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alternativeEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  organizationName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roleInOrganization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  validTill: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Invitation.sync()
  .then(() => {
    console.log("Invitation table created");
  })
  .catch((error) => {
    console.error("Error creating Invitation table:", error);
  });

module.exports = Invitation;

// 1. Name
// 2. Email
// 3. Phone number
// 4. Alternate email id (optional)
// 5. Organizations (optional)
// a. Organization name
// b. Role in organization
// c. Valid till (date)
