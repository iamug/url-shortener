export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  BASEURL: process.env.BASEURL || `http://localhost:${parseInt(process.env.PORT, 10) || 3000}/`,
});
