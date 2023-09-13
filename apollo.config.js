const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  client: {
    includes: ['./src/**/*.{tsx,ts}'],
    tagname: 'gql',
    service: {
      name: 'newProject',
      url: process.env.REACT_APP_HOST,
    },
  },
};
