import * as authService from "./auth.service.js";

export async function register(req, res, next) {
  try {
    const { username, displayName, email, password } = req.body;
    const result = await authService.register({
      username,
      displayName,
      email,
      password,
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getMe(req.userId);
    res.json(user);
  } catch (e) {
    next(e);
  }
}
