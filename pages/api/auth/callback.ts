import auth0 from '../../../lib/auth0';

export default async function callback(req, res) {
  try {
    console.log('AUTH CALLBACK FUNCTION');
    console.log(req);
    await auth0.handleCallback(req, res, {
      redirectTo: '/me',
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
