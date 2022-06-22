import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestHandler } from 'express';
import environment from './environment';

declare global {
  namespace Express {
    interface Request {
      userData: UserData;
    }
  }
}

class UserData {
  private name: string;
  private avatar: string;
  userID: string;
  soundList: string[];

  constructor(userRes: AxiosResponse) {
    this.name = userRes.data.username;
    this.userID = userRes.data.id;
    this.avatar = userRes.data.avatar;
  }
}

const authURL = `https://discord.com/api/oauth2/authorize?client_id=${ environment.clientID }&redirect_uri=${ encodeURI(environment.UIServerURL) }&response_type=code&scope=identify&prompt=none`;

function getTokensFromCode(authCode: string) {
  const params = new URLSearchParams({
    client_id: environment.clientID,
    client_secret: environment.clientSecret,
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: environment.UIServerURL,
  });
  return axios.post('https://discord.com/api/oauth2/token', params);
}

function getTokensFromRefresh(refreshToken: string) {
  const params = new URLSearchParams({
    client_id: environment.clientID,
    client_secret: environment.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
  return axios.post('https://discord.com/api/oauth2/token', params);
}

export const discordAuth: RequestHandler = async (req, res, next) => {
  if (req.query.code) {
    try {
      const tokenRes = await getTokensFromCode(String(req.query.code));
      res.cookie('accesstoken', tokenRes.data.access_token, { httpOnly: true, maxAge: 1000 * 60 * 30 });
      res.cookie('refreshtoken', tokenRes.data.refresh_token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
      console.log('token response from discord');
    } catch (error) {
      console.log(error);
    }
    res.redirect('/');
    return;
  }

  let userReqToken = req.cookies.accesstoken;

  if (!req.cookies.accesstoken && req.cookies.refreshtoken)
    try {
      const tokenRes = await getTokensFromRefresh(req.cookies.refreshtoken);
      res.cookie('accesstoken', tokenRes.data.access_token, { httpOnly: true, maxAge: 1000 * 60 * 30 });
      res.cookie('refreshtoken', tokenRes.data.refresh_token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
      userReqToken = tokenRes.data.access_token;
      console.log('token response from discord');
    } catch (error) {
      console.log(error);
    }

  if (userReqToken)
    try {
      const userRes = await axios.get('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${ userReqToken }` } });
      req.userData = new UserData(userRes);
      next();
      return;
    } catch (error) {
      console.log(error);
    }

  if (req.url !== '/') {
    res.writeHead(401);
    res.end();
    return;
  }
  res.redirect(authURL);
};

const botConfig: AxiosRequestConfig = { headers: { Authorization: environment.botApiKey } };

export function soundRequest(userID: string, sound: string) {
  const body = { userID, sound };
  return axios.post(`${ environment.botURL }/soundrequest`, body, botConfig)
    .catch(error => console.log(error));
}

export function skipRequest(all: boolean, userID: string) {
  return axios.post(`${ environment.botURL }/skip`, { skipAll: all, userID }, botConfig)
    .catch(error => console.log(error));
}
