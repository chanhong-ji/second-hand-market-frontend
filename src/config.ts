function required(key: string, defaultValue: any = undefined) {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`envError : Key ${key} is undefind`);
  }
  return value;
}

const config = {
  service: {
    host: required('REACT_APP_HOST'),
    subscriptionHost: required('REACT_APP_SUBSCRIPTION'),
  },
};

export default config;
