import jwt from "jsonwebtoken";
const secret = "sklfj23432@#@";

const createTokenForUser = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    profileImg: user.profileImageUrl,
    role: user.role,
    name: user.fullName,
  };
  const token = jwt.sign(payload, secret);
  return token;
};

const validateToken = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};

export { createTokenForUser, validateToken };
