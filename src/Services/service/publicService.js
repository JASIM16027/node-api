const express = require("express");
const db = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const signUpSchemaValidator = require("../validators/signUpValidation");

let signUp = async (req, res) => {
  const transactionInstance = await db.sequelize.transaction();
  try {

    await signUpSchemaValidator.validate(req.body, { abortEarly: false });
    //console.log(isValid)

    // get data from request body for profile table
    const { firstName, lastName, nid, profilePhoto, isMarried, age } = req.body;
    let profileInfo = {
      firstName: firstName,
      lastName: lastName,
      nid: nid,
      profilePhoto: profilePhoto,
      isMarried: isMarried,
      age: age,
    };
    

    // insert record into Profile data
    const profile = await db.Profile.create(profileInfo,{transaction:transactionInstance});

    //get data for auth Table
    const { email, password } = req.body;
    // hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const authInfo = {
      email: email,
      password: hashedPassword,
    };

    let updatedAuth;
    if (profile && profile.id) {
      authInfo.profileId = profile.id;
      // insert profileId into auth table
      updatedAuth = await db.Auth.create(authInfo,{transaction:transactionInstance});
    }
    await transactionInstance.commit()

    return res.status(201).json({
      message: "Record created successfully!",
      response: { profile, updatedAuth },
    });
  } catch (error) {
    console.log(error);
    await transactionInstance.rollback();
    return res.status(500).json({
      message: "Unable to create a record!",
    });
  }
};

// signIn part
let signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.Auth.findOne({
      attributes: ["id", "email", "password"],
      where: {
        email: email,
      },
    });

    // password matched or not
    const isValidPassword = await bcrypt.compare(
      password,
      user.dataValues.password
    );

    if (!user && !isValidPassword) {
      res.status(401).json({
        error: "Authentication Failed!",
      });
    }

    // payload could be an object literal, buffer or string representing valid JSON.
    const payload = {
      email: user.dataValues.email,
      userId: user.dataValues.id,
    };
    //  [options, callback]
    const expireTime = {
      expiresIn: "1h",
    };

    // generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, expireTime);

    res.status(200).json({
      access_token: token,
      message: "login  successful!",
    });
  } catch (err) {
    res.send("Authentication Failed");
  }
};

module.exports = {
  signUp,
  signIn,
};
