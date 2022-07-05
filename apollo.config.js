module.exports = {
  client: {
    includes: ['./src/**/*.{tsx,ts}'],
    tagname: 'gql',
    service: {
      name: 'newProject',
      url: (process.env.NODE_ENV = 'production'
        ? 'https://second-hand-market-backend.herokuapp.com/graphql'
        : 'http://localhost:4000/graphql'),
    },
  },
};
