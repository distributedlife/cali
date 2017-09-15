let client;

export const initialiseBugSnag = () => {
  const { Client, Configuration } = require('bugsnag-react-native');

  const configuration = new Configuration('fa41ada86107bc4365138f150baa3f89');

  client = new Client(configuration);
};

export const notify = (error, addExtraParams) => {
  if (!client) {
    return;
  }

  client.notify(error, addExtraParams);
};

export const getClient = () => client;

export default () => getClient();
