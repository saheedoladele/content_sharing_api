import * as usersService from "./users.service.js";

export async function list(req, res, next) {
  try {
    const excludeUserId = req.query.excludeSelf === "true" && req.userId ? req.userId : undefined;
    const users = await usersService.listUsers({ excludeUserId });
    res.json(users);
  } catch (e) {
    next(e);
  }
}

export async function getOne(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
}

export async function updateMe(req, res, next) {
  try {
    const user = await usersService.updateProfile(req.userId, req.body);
    res.json(user);
  } catch (e) {
    next(e);
  }
}

export async function follow(req, res, next) {
  try {
    const user = await usersService.follow(req.userId, req.params.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
}

export async function unfollow(req, res, next) {
  try {
    const user = await usersService.unfollow(req.userId, req.params.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
}
