import axios from 'axios';
import { RequestHandler } from 'express';
import environment from './environment';

const authURL = `https://discord.com/api/oauth2/authorize?client_id=${ environment.clientID }&redirect_uri=${ encodeURI(environment.UIServerURL) }&response_type=code&scope=identify&prompt=none`;

const discordAuth: RequestHandler = async (req, res, next) => {
  let userReqToken = req.cookies.accesstoken ?? null;

  if (req.query.code || (!req.cookies.accesstoken && req.cookies.refreshtoken)) {
    const params = new URLSearchParams({
      client_id: environment.clientID,
      client_secret: environment.clientSecret,
      grant_type: req.query.code ? 'authorization_code' : 'refresh_token',
    });
    if (req.query.code) {
      params.append('code', String(req.query.code));
      params.append('redirect_uri', environment.UIServerURL);
    } else { params.append('refresh_token', req.cookies.refreshtoken); }
    try {
      const tokenRes = await axios.post('https://discord.com/api/oauth2/token', params);
      res.cookie('accesstoken', tokenRes.data.access_token, { httpOnly: true, maxAge: 1000 * 60 * 30 });
      res.cookie('refreshtoken', tokenRes.data.refresh_token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
      if (req.query.code) {
        res.redirect('/');
        return;
      }
      userReqToken = tokenRes.data.access_token;
      console.log('token response from discord');
    } catch (error) {
      console.log(error);
    }
  }

  if (userReqToken)
    try {
      const userRes = await axios.get('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${ userReqToken }` } });
      res.cookie('username', userRes.data.username);
      res.cookie('userid', userRes.data.id);
      res.cookie('avatar', userRes.data.avatar);
      next();
      return;
    } catch (error) {
      console.log(error);
    }

  if (req.url.includes('/api')) {
    res.writeHead(401);
    res.end();
    return;
  }
  res.redirect(authURL);
};

export default discordAuth;
