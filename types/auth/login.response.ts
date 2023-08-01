import { Tokens, UserResponse } from 'types';

export interface LoginResponse {
  tokens: Tokens;
  user: UserResponse;
}
