import jwt from 'jsonwebtoken';
import * as usersService from '../services/users.service.js';

export async function requestMagicLink(req, res) {
  const { email } = req.body;
  const user = await usersService.findOrCreateUserByEmail(email);

  const token = jwt.sign(
    { userId: user.id, email: user.email, purpose: 'magic-link' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  await usersService.sendMagicLinkEmail(email, token);

  if (process.env.NODE_ENV !== 'production') {
    return res.json({ message: 'Magic link generated (dev mode)', token });
  }

  res.json({ message: 'Magic link sent to your email' });
}

export async function verifyMagicLink(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired magic link' });
  }

  if (payload.purpose !== 'magic-link') {
    return res.status(401).json({ error: 'Invalid token purpose' });
  }

  await usersService.upsertProfile({ id: payload.userId, email: payload.email });

  const sessionToken = jwt.sign(
    { userId: payload.userId, email: payload.email, purpose: 'session' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token: sessionToken,
    user: { id: payload.userId, email: payload.email },
  });
}

export async function getMe(req, res) {
  const user = await usersService.getUserById(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const profile = await usersService.getProfileById(req.user.id);
  res.json({ ...user, profile });
}
