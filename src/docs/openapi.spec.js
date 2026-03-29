export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Content Sharing API",
    author: {
      name: "Saheed Baba",
      url: "https://github.com/saheedoladele",
    },
    description:
      "REST API for the content-sharing app: auth (JWT), users, posts, comments, likes, follows, and image upload (Cloudinary) built by @saheedbaba using Node.js, Express, MongoDB, and Mongoose.",
    version: "1.0.0",
  },
  servers: [
    {
      url: process.env.API_URL || "http://localhost:3002",
      description: "Local development",
    },
  ],
  tags: [
    { name: "Health", description: "Liveness" },
    { name: "Auth", description: "Register, login, current user" },
    { name: "Users", description: "Profiles and follow graph" },
    { name: "Posts", description: "Feed, search, create, likes" },
    { name: "Comments", description: "Threaded comments on posts" },
    {
      name: "Upload",
      description:
        "Image upload to Cloudinary (requires CLOUDINARY_URL on server)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          path: { type: "string" },
          details: {},
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", description: "MongoDB ObjectId as string" },
          username: { type: "string" },
          displayName: { type: "string" },
          email: { type: "string", format: "email" },
          avatar: { type: "string" },
          bio: { type: "string" },
          followers: {
            type: "array",
            items: { type: "string" },
            description: "User ids",
          },
          following: {
            type: "array",
            items: { type: "string" },
            description: "User ids",
          },
        },
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "string" },
          authorId: { type: "string" },
          text: { type: "string", maxLength: 500 },
          imageUrl: { type: "string", nullable: true },
          likes: { type: "array", items: { type: "string" } },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          id: { type: "string" },
          postId: { type: "string" },
          parentCommentId: { type: "string", nullable: true },
          authorId: { type: "string" },
          text: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      RegisterBody: {
        type: "object",
        required: ["username", "displayName", "email", "password"],
        properties: {
          username: { type: "string" },
          displayName: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      CreatePostBody: {
        type: "object",
        required: ["text"],
        properties: {
          text: { type: "string", maxLength: 500 },
          imageUrl: { type: "string", description: "Optional image URL" },
        },
      },
      UpdateProfileBody: {
        type: "object",
        properties: {
          displayName: { type: "string" },
          bio: { type: "string" },
          avatar: { type: "string" },
        },
      },
      CreateCommentBody: {
        type: "object",
        required: ["text"],
        properties: {
          text: { type: "string" },
          parentCommentId: {
            type: "string",
            nullable: true,
            description: "Set for replies; omit or null for top-level",
          },
        },
      },
      UploadImageResponse: {
        type: "object",
        properties: {
          url: {
            type: "string",
            format: "uri",
            description: "HTTPS URL (use as imageUrl on posts or avatar)",
          },
          publicId: { type: "string" },
          width: { type: "integer" },
          height: { type: "integer" },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { ok: { type: "boolean", example: true } },
                },
              },
            },
          },
        },
      },
    },
    "/api/upload/image": {
      post: {
        tags: ["Upload"],
        summary: "Upload image",
        description:
          "Multipart form with field name `image`. Returns a `url` suitable for `POST /api/posts` (`imageUrl`) or profile `avatar`. Requires `CLOUDINARY_URL` on the server.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Image file (max 5MB; image/* only)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Uploaded asset",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UploadImageResponse" },
              },
            },
          },
          400: {
            description: "Invalid file or missing field",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          503: {
            description: "Upload not configured",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterBody" },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          409: {
            description: "Email or username already taken",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginBody" },
            },
          },
        },
        responses: {
          200: {
            description: "JWT and user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          401: {
            description: "Missing or invalid token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        description:
          "Optional Bearer token. Use `excludeSelf=true` to omit the current user (requires auth).",
        parameters: [
          {
            name: "excludeSelf",
            in: "query",
            schema: { type: "string", enum: ["true", "false"] },
            description:
              "When `true` and authenticated, excludes current user from the list",
          },
        ],
        responses: {
          200: {
            description: "Array of public user objects",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "MongoDB ObjectId",
          },
        ],
        responses: {
          200: {
            description: "User",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          404: {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/users/me/profile": {
      patch: {
        tags: ["Users"],
        summary: "Update my profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProfileBody" },
            },
          },
        },
        responses: {
          200: {
            description: "Updated user",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/users/{id}/follow": {
      post: {
        tags: ["Users"],
        summary: "Follow user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Target user id",
          },
        ],
        responses: {
          200: {
            description: "Target user after follow",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: {
            description: "Cannot follow yourself",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Unfollow user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Target user id",
          },
        ],
        responses: {
          200: {
            description: "Target user after unfollow",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: {
            description: "Cannot unfollow yourself",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/posts": {
      get: {
        tags: ["Posts"],
        summary: "List posts (feed)",
        description:
          "`scope=following` requires `Authorization: Bearer` and returns posts from followed users and self.",
        parameters: [
          {
            name: "scope",
            in: "query",
            schema: {
              type: "string",
              enum: ["global", "following"],
              default: "global",
            },
          },
        ],
        responses: {
          200: {
            description: "Posts, newest first",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
          401: {
            description: "Authentication required when scope is following",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Create post",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePostBody" },
            },
          },
        },
        responses: {
          201: {
            description: "Created post",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/posts/search": {
      get: {
        tags: ["Posts"],
        summary: "Search posts by text",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Substring match on post text (case-insensitive)",
          },
        ],
        responses: {
          200: {
            description: "Matching posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
        },
      },
    },
    "/api/posts/user/{userId}": {
      get: {
        tags: ["Posts"],
        summary: "Posts by author",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Author posts, newest first",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
        },
      },
    },
    "/api/posts/user/{userId}/liked": {
      get: {
        tags: ["Posts"],
        summary: "Posts liked by user",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Liked posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
        },
      },
    },
    "/api/posts/{id}": {
      get: {
        tags: ["Posts"],
        summary: "Get post by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Post",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          404: {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/posts/{id}/like": {
      post: {
        tags: ["Posts"],
        summary: "Toggle like on post",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Post id",
          },
        ],
        responses: {
          200: {
            description: "Post with updated likes array",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/posts/{postId}/comments": {
      get: {
        tags: ["Comments"],
        summary: "List comments for post",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Comments in creation order",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Comment" },
                },
              },
            },
          },
          404: {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "Add comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCommentBody" },
            },
          },
        },
        responses: {
          201: {
            description: "Created comment",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          404: {
            description: "Post not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};
