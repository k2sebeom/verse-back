import { Router, Response } from 'express';
import Container from 'typedi';
import { GetMusicianRequest } from '../../@types/models/UserRequest';
import UserService from '../../services/user';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.get('/musician/:id', async (req: GetMusicianRequest, res: Response) => {
    const { id } = req.params;

    const userService = Container.get(UserService);
    
    let userId;

    try {
        userId = parseInt(id);
    }
    catch {
        res.status(400).send({ msg: "User id must be number" });
        return;
    }
    const user = await userService.getUserById(parseInt(id));

    if(!user) {
        res.status(404).send({ msg: "User not found" });
        return;
    }

    if(user.role !== 'MUSICIAN') {
        res.status(404).send({ msg: "User is not a musician" });
        return;
    }

    res.send({
        id: user.id,
        points: user.points,
        liveUrl: user.liveUrl,
        tracks: user.tracks
    });
  });
};
