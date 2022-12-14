import { Router, Response, Request } from 'express';
import Container from 'typedi';
import { RegisterRequest } from '../../@types/models/AuthRequest';
import { GetMusicianRequest, GetRtcTokenRequest } from '../../@types/models/UserRequest';
import UserService from '../../services/user';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.post('/register', async (req: RegisterRequest, res: Response) => {
    const { museId, museAlias } = req.body;

    if(!museAlias || !museId) {
        res.sendStatus(400);
        return;
    }

    const userService = Container.get(UserService);

    const user = await userService.getUserByMuse(museId);

    if(user) {
        res.send({
            id: user.id,
            points: user.points,
            streamKey: user.streamKey
        });
    }
    else {
        const newUser = await userService.register(museId, museAlias);
        res.send({
            id: newUser.id,
            points: newUser.points,
            streamKey: newUser.streamKey
        });
    }
  })

  route.post('/token', async (req: GetRtcTokenRequest, res: Response) => {
    const { channelName, account } = req.body;

    if(!channelName || !account) {
        res.sendStatus(400);
        return;
    }

    const userService = Container.get(UserService);
    const token = userService.getRtcToken(channelName, account);

    res.send({
        token
    });
  })

  route.get('/random', async (req: Request, res: Response) => {
    const userService = Container.get(UserService);
    const user = await userService.getRandomUser();

    res.send({
        museId: user.museId
    });
  })

  route.get('/musician/:id', async (req: GetMusicianRequest, res: Response) => {
    const { id } = req.params;

    const userService = Container.get(UserService);
    
    let museId;

    try {
        museId = parseInt(id);
    }
    catch {
        res.status(400).send({ msg: "User id must be number" });
        return;
    }
    const user = await userService.getUserByMuse(museId);

    if(!user) {
        res.status(404).send({ msg: "User not found" });
        return;
    }

    res.send({
        id: user.id,
        alias: user.museAlias,
        points: user.points,
        liveUrl: user.liveUrl
    });
  });
};
