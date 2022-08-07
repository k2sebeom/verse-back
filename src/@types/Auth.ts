import { JwtPayload } from 'jsonwebtoken';

interface Credentials {
  accessToken: string;
  refreshToken: string;
}

interface TokenInterface extends JwtPayload {
  id: number;
}

export type { Credentials, TokenInterface };
