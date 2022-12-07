const express = require('express');
const db = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Auth } = require('../../config/database');
require('dotenv').config();
//var {file} = require('./imageUploader')
//const profileInfo= require('./public.controller')

const getUserById = async (req, res) => {
  try {
    const profile = await db.Profile.findOne({
      where: {
        id: req.params.id,
      },
      raw: true,
      include: [
        {
          association: 'auth',
          attributes: ['email', 'profileId'],
        },
      ],
    });
    return res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateImageById = async (req, res) => {
  
  
  try {
   // console.log(req.file.filename)

    if (req.file == undefined) {
      return res.status(400).send({ message: "Image file is not uploaded correctly. please upload again!" });
    }
  
    const userId = req.params.id;
    if (userId!=req.userId){
      res.status(401).send('User is not valid')
    }
  

    await db.Profile.update(
      { profilePhoto: req.file.filename },
      {
        where: {
          id: userId,
        },
      }
    );
    res.status(200).send({
      message: "Successfully uploaded the profile photo path : " + req.file.originalname,
    
    });
  } catch (err) {
    res.status(500).send({
      message: `Internal server Error. the error is ${err}`,
    });
  }
}

const updateUserById = async (req, res) => {

  const { firstName, lastName, nid, profilePhoto, isMarried, age } = req.body;

  const profileInfo = {
    firstName: firstName,
    lastName: lastName,
    nid: nid,
    profilePhoto: profilePhoto,
    isMarried: isMarried,
    age: age,
  };

  // console.log(req.userId,req.params.id)
  try {
   
    if (req.userId !=req.params.id) {
      throw new Error('user is not valid');
    }
    const result = await db.Profile.update(profileInfo, {
      where: {
        id: req.params.id,
      },
    });
    return res.json(result);
  } catch (e) {
    console.log('error deleting user:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await db.Profile.destroy({
      where: {
        id: userId,
      },
      include: [
        {
          association: 'auth',
          cascade: true,
        },
      ],
    });
    return res.json(result);
  } catch (e) {
    console.log('error deleting user:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getAllUser = async (req, res) => {
  try {
    const result = await db.Profile.findAll({
      raw: true,
      include: [
        {
          association: 'auth',
          attributes: ['email', 'profileId'],
        },
      ],
    });
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = {
  getUserById,
  updateImageById,
  updateUserById,
  deleteUserById,
  getAllUser

}