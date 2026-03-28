import * as commentsService from "./comments.service.js";

export async function list(req, res, next) {
  try {
    const comments = await commentsService.listByPost(req.params.postId);
    res.json(comments);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const comment = await commentsService.createComment(req.params.postId, req.userId, req.body);
    res.status(201).json(comment);
  } catch (e) {
    next(e);
  }
}
