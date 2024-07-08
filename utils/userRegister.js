const {DataTypes} = require("sequelize");
const User = require("../models/userModels");

exports.userRegister = async function( name, lname, age, email, uname, password ){
    try {
    let userDetails = await User.max("id");
    const [user, created] = await User.findOrCreate({
      where: { userName: uname },
      defaults: {
        id: ++userDetails,
        firstName: name,
        lastName: lname,
        age: age,
        userName: uname,
        email: email,
        password: password,
        createdAt: DataTypes.DATETIME,
        updatedAt: DataTypes.DATETIME,
      },
    });
    if (created) {
      console.log(user, "was created");
      return created;
    //   res.redirect("/login");
    } else return(500);
  } catch (err) {
    if (err) {
      console.error(err);
      return(404);
    }
  }
}