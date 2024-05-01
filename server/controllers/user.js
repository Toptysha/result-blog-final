const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken } = require("../helpers/token");
const ROLES = require("../constants/roles");

async function register(login, password) {
  if (!password) {
    throw new Error("Password is empty");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ login, password: hashPassword });

  const token = generateToken({ id: user.id });

  return {
    user,
    token,
  };
}

async function login(login, password) {
  const user = await User.findOne({ login });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);

  if (!isMatchPassword) {
    throw new Error("Invalid password");
  }

  const token = generateToken({ id: user.id });

  return {
    user,
    token,
  };
}

function getUsers() {
  return User.find();
}

function getRoles() {
  return [
    {
      id: ROLES.ADMIN,
      name: "Admin",
    },
    {
      id: ROLES.MODERATOR,
      name: "Moderator",
    },
    {
      id: ROLES.USER,
      name: "User",
    },
  ];
}

function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

function editUser(id, userData) {
  return User.findByIdAndUpdate(id, userData, { returnDocument: "after" });
}

module.exports = { register, login, getUsers, getRoles, deleteUser, editUser };
