import { UserInterface, Tokens } from 'types';

export interface LoginResponse {
  tokens: Tokens;
  user: Partial<Omit<UserInterface, 'pwdHash'>>;
}
