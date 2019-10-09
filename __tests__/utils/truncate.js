// Remove all content from all test tables

const { sequelize } = require('../../src/app/models');

module.exports = () => {
  return Promise.all(
    Object.keys(sequelize.models).map(key => {
      return sequelize.models[key].destroy({
        truncate: true,
        force: true
      });
    })
  );
};
