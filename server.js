const express = require("express");
const app = express();
const session = require("express-session");

const bcrypt = require("bcrypt");

const bodyParser = require("body-parser");

const Invitation = require("./models/invitationModel.js");
const User = require("./models/userModel.js");

// middleWares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// app.use(cookieParser());
app.use(
  session({
    secret: "Can't_Your_SuperMan",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

//one-to-one relationship
Invitation.hasOne(User, { foreignKey: "id" });
User.belongsTo(Invitation, { foreignKey: "id" });

app.use(bodyParser.json());

app.post("/invitation", async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      alternativeEmail,
      organizationName,
      roleInOrganization,
      validTill,
    } = req.body;

    const invitation = await Invitation.create({
      name,
      email,
      phoneNumber,
      alternativeEmail,
      organizationName,
      roleInOrganization,
      validTill,
    });

    res.json({ id: invitation.id });
  } catch (error) {
    console.error("Error creating invitation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const invitation = await Invitation.findByPk(id);

    console.log(invitation, password);

    if (invitation) {
      const user = await User.create({
        name: invitation.name,
        email: invitation.email,
        password: hashedPassword,
        phoneNumber: invitation.phoneNumber,
      });
      await invitation.destroy();
      res.status(201).json({ message: "Signup successful." });
    } else {
      res.status(404).json({ message: "Invitation not found." });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to signup." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (await bcrypt.compare(password, user.password)) {
      if (user) {
        req.session.loggedIn = true;
        req.session.username = user.name;

        res.status(200).json({ user });
      } else {
        res.status(401).json({ message: "Invalid email User Not Found" });
      }
    } else {
      res.status(401).json({ message: "Invalid password." });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to login." });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.clearCookie("sessionID");
      res.json({ message: "Logout successful" });
    }
  });
});

app.put("/edit", async (req, res) => {
  try {
    const { name, email, phoneNumber, alternativeEmail } = req.body;
    const user = await User.findOne({ where: { name } });
    console.log(user);
    if (user) {
      User.update(
        {
          name,
          email,
          phoneNumber,
          alternativeEmail,
        },
        { where: { id: user.id } }
      );
      res.status(200).json({ user });
    } else {
      res.status(401).json({ message: "User Doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to update user details." });
  }
});

app.listen(8081, () => {
  console.log(`Server started `);
});
