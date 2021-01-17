import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Profiles: {
            screens: {
              TabOneScreen: 'one',
            },
          },
          Friends: {
            screens: {
              TabTwoScreen: 'two',
            },
          },
        },
      },
      NotFound: '*',
    },
  },
};
