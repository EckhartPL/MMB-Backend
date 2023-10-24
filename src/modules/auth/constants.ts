export const jwtConstants = {
  secret: `${process.env.SECRET_OR_KEY}`,
  atExpiresIn: 60 * 10,
  rtExpiresIn: 60 * 60 * 24 * 3,
};
