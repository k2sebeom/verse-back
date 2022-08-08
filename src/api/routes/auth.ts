import { Router, Response } from 'express';
import {
  RefreshRequest,
  SignInRequest,
  SignUpRequest,
} from '../../@types/models/AuthRequest';
import Container from 'typedi';
import UserService from '../../services/user';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post('/signin', async (req: SignInRequest, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ msg: 'Invalid Fields' });
      return;
    }

    const userService = Container.get(UserService);

    const user = await userService.getUser(email);

    if (!user) {
      res.status(404).send({ msg: 'User not found' });
      return;
    }

    const isPwValid = await userService.isPasswordValid(password, user.pw);

    if (!isPwValid) {
      res.status(401).send({ msg: 'Password Incorrect' });
      return;
    }

    const cred = await userService.updateUserRefreshToken(user.id);

    res.send({
      result: {
        id: user.id,
        email: user.email,
        points: user.points,
        role: user.role,
        ...cred,
      },
    });
  });

  route.post('/signup', async (req: SignUpRequest, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ msg: 'Invalid Fields' });
      return;
    }

    const userService = Container.get(UserService);

    const user = await userService.getUser(email);

    if (user) {
      res.status(400).send({ msg: 'Email already exists' });
      return;
    }

    const newUser = await userService.createUser(email, password);
    const cred = await userService.updateUserRefreshToken(newUser.id);

    res.send({
      result: {
        id: newUser.id,
        email: newUser.email,
        ...cred,
      },
    });
  });

  route.post('/token', async (req: RefreshRequest, res: Response) => {
    const { email, password, refreshToken } = req.body;
    if (!email || !password || !refreshToken) {
      res.status(400).send({ msg: 'Invalid Fields' });
      return;
    }

    const userService = Container.get(UserService);

    const user = await userService.getUser(email);

    if (!user) {
      res.status(404).send({ msg: 'User not found' });
      return;
    }

    const isPwValid = await userService.isPasswordValid(password, user.pw);

    if (!isPwValid) {
      res.status(401).send({ msg: 'Password Incorrect' });
      return;
    }

    const isTokenValid = await userService.isRefreshTokenValid(
      refreshToken,
      user.id
    );

    if (isTokenValid) {
      res.status(401).send({ msg: 'Token Invalid' });
      return;
    }

    const cred = await userService.updateUserRefreshToken(user.id);

    res.send({
      result: {
        id: user.id,
        email: user.email,
        ...cred,
      },
    });
  });
};
