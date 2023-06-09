/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");

module.exports.bootstrap = async function () {
  const adminUser = await User.findOne({ email: 'admin@gmail.com' });

  if (adminUser) {
    console.log(`Found admin user with email: ${adminUser.email}`);
    return;
  }
  const hashedPassword = await bcrypt.hash('admin@123', 10);

  const newAdminUser = await User.create({
    name:"admin",
    email: 'admin@gmail.com',
    password: hashedPassword,
    isAdmin: true
  }).fetch();

  console.log(`Created admin user with email: ${newAdminUser.email}`);  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
};
