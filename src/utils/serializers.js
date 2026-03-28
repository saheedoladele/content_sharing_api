function refId(f) {
  if (f == null) return "";
  if (typeof f === "object" && f._id != null) return f._id.toString();
  return f.toString();
}

export function toPublicUser(user) {
  if (!user) return null;
  const doc = user.toObject?.() ?? user;
  const id = doc._id?.toString?.() ?? doc.id;
  const followers = (doc.followers || []).map(refId);
  const following = (doc.following || []).map(refId);
  return {
    id,
    username: doc.username,
    displayName: doc.displayName,
    email: doc.email,
    avatar: doc.avatar,
    bio: doc.bio,
    followers,
    following,
  };
}

function safeIso(d) {
  if (d == null) return new Date().toISOString();
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

export function toPublicPost(post) {
  if (!post) return null;
  const doc = post.toObject?.() ?? post;
  if (!doc._id) {
    throw new Error("toPublicPost: missing _id");
  }
  return {
    id: doc._id.toString(),
    authorId: doc.authorId?.toString?.() ?? doc.authorId,
    text: doc.text,
    imageUrl: doc.imageUrl || undefined,
    likes: (doc.likes || []).map((id) => id.toString()),
    createdAt: safeIso(doc.createdAt),
  };
}

export function toPublicComment(comment) {
  if (!comment) return null;
  const doc = comment.toObject?.() ?? comment;
  if (!doc._id) return null;
  return {
    id: doc._id.toString(),
    postId: doc.postId?.toString?.() ?? doc.postId,
    parentCommentId: doc.parentCommentId ? doc.parentCommentId.toString() : null,
    authorId: doc.authorId?.toString?.() ?? doc.authorId,
    text: doc.text,
    createdAt: safeIso(doc.createdAt),
  };
}
