const app = require('./src/app')
const config = require('./src/config')
const db= require('./src/models')
const sequelize = require('sequelize')


async function dbConnectionCheck(){
try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

dbConnectionCheck()
db.sequelize.sync().then(() => {
  app.listen(config.PORT, () => {
    console.log(`App listening at http://localhost:${config.PORT}`)
  })
})
