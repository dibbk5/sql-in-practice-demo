require("dotenv").config();
const { CONNECTION_STRING } = process.env;
const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const userID = 4;
const clientID = 3;

module.exports = {
  getUserInfo: (req, res) => {
    sequelize
      .query(
        `SELECT * FROM cc_clients AS c
        JOIN cc_users AS u ON c.user_id = u.user_id
        WHERE u.user_id = ${userID};`
      )
      .then((dbResult) => {
        console.log(dbResult);
        res.status(200).send(dbResult[0]);
      })
      .catch((err) => console.log(err));
  },
  updateUserInfo: (req, res) => {
    let {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      city,
      state,
      zipCode,
    } = req.body;

    sequelize
      .query(
        `update cc_users set first_name = '${firstName}',
    last_name = '${lastName}',
    email = '${email}',
    phone_number = ${phoneNumber}
    where user_id = ${userID};

    update cc_clients set address = '${address}',
    city = '${city}',
    state = '${state}',
    zip_code = ${zipCode}
    where user_id = ${userID};
    `
      )
      .then(() => res.sendStatus(200))
      .catch((err) => console.log(err));
  },
  getUserAppt: (req, res) => {
    sequelize
      .query(
        `SELECT * FROM cc_appointments
    WHERE client_id = ${clientID}
    ORDER BY date DESC`
      )
      .then((dbResult) => res.status(200).send(dbResult[0]))
      .catch((err) => console.log(err));
  },
  requestAppointment: (req, res) => {
    const { date, service } = req.body;

    sequelize
      .query(
        `INSERT INTO cc_appointments (client_id, date, service_type, notes, approved, completed)
    VALUES(${clientID}, '${date}', '${service}', 'Helloooo', false, false)
    RETURNING *;`
      )
      .then((dbResult) => res.status(200).send(dbResult[0]))
      .catch((err) => console.log(err));
  },
};
