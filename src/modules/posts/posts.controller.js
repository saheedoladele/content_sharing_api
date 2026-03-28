import * as postsService from "./posts.service.js";

export async function list(req, res, next) {
  try {
    const scope = req.query.scope === "following" ? "following" : "global";
    const posts = await postsService.listPosts({ scope, userId: req.userId });
    res.json(posts);
  } catch (e) {
    next(e);
  }
}

export async function search(req, res, next) {
  try {
    const q = req.query.q;
    const posts = await postsService.searchPosts(q);
    res.json(posts);
  } catch (e) {
    next(e);
  }
}

export async function getOne(req, res, next) {
  try {
    const post = await postsService.getPostById(req.params.id);
    res.json(post);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const post = await postsService.createPost(req.userId, req.body);
    res.status(201).json(post);
  } catch (e) {
    next(e);
  }
}

export async function like(req, res, next) {
  try {
    const post = await postsService.toggleLike(req.userId, req.params.id);
    res.json(post);
  } catch (e) {
    next(e);
  }
}

export async function byAuthor(req, res, next) {
  try {
    const posts = await postsService.listPostsByAuthor(req.params.userId);
    res.json(posts);
  } catch (e) {
    next(e);
  }
}

export async function likedByUser(req, res, next) {
  try {
    const posts = await postsService.listLikedPosts(req.params.userId);
    res.json(posts);
  } catch (e) {
    next(e);
  }
}
