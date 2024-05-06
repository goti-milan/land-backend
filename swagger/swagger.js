module.exports = {
  openapi: "3.0.3",
  info: {
    title: "User Apis",
    description: "mobile-user-apis",
    version: "1.0.0",
  },
  components: {
    securitySchemes: {
      Bearer: {
        type: "http",
        scheme: "Bearer",
        bearerFormat: "JWT",
      },
    },
  },
  servers: [
    {
      url: "http://localhost:5001/api/v1/mobile/",
    },
  ],
  schemes: ["http"],
  consumes: ["application/json"],

  paths: {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Create User",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/definitions/signup",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            schema: {
              $ref: "#/definitions/signup",
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User Login",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/definitions/login",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            schema: {
              $ref: "#/definitions/login",
            },
          },
        },
      },
    },
    "/auth/delete/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of user that we want to find",
          type: "string",
        },
      ],
      patch: {
        tags: ["Auth"],
        summary: "Delete User",
        responses: {
          200: {
            description: "OK",
          },
        },
      },
    },
    "/auth/forgot-password/{email}": {
      parameters: [
        {
          name: "email",
          in: "path",
          required: true,
          description: "forgot-password",
          type: "string",
        },
      ],
      post: {
        tags: ["Auth"],
        summary: "Forgot Password",
        responses: {
          200: {
            description: "OK",
          },
        },
      },
    },
    "/auth/change-password": {
      post: {
        tags: ["Auth"],
        summary: "Change Login User Password",
        security: [
          {
            Bearer: [],
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/definitions/changePassword",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
          },
        },
      },
    },
    "/stories/mark-as-seen/{storyId}": {
      parameters: [
        {
          name: "storyId",
          in: "path",
          description: "story",
          required: true,
          type: "string",
        },
      ],
      post: {
        tags: ["Story"],
        summary: "Mark-Story",
        security: [
          {
            Bearer: [],
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/definitions/storyMap",
              },
            },
          },
        },
        responses: {
          200: {
            description: "OK",
            schema: {
              $ref: "#/definitions/storyMap",
            },
          },
        },
      },
    },
    "/stories?language={language}&levels={levels}": {
      parameters: [
        {
          name: "language",
          in: "path",
          description: "Language",
          required: true,
          type: "string",
        },
        {
          name: "levels",
          in: "path",
          description: "Story levels",
          required: true,
          type: "array",
        },
      ],
      get: {
        tags: ["Story"],
        summary: "Get Stories",
        security: [
          {
            Bearer: [],
          },
        ],
        responses: {
          200: {
            description: "OK",
            schema: {
              $ref: "#/definitions/commonResponse",
            },
          },
        },
      },
    },
  },
  definitions: {
    commonResponse: {
      properties: {
        name: {
          type: "string",
          example: "john",
        },
        email: {
          type: "string",
          example: "john@gmail.com",
        },
        password: {
          type: "string",
          example: "john123",
        },
      },
      Users: {
        type: "array",
        $ref: "#/definitions/commonResponse",
      },
    },
    signup: {
      required: ["name", "email", "password"],
      properties: {
        name: {
          type: "string",
          example: "john",
        },
        email: {
          type: "string",
          example: "john@gmail.com",
        },
        password: {
          type: "string",
          example: "john123",
        },
      },
      Users: {
        type: "array",
        $ref: "#/definitions/signup",
      },
    },
    login: {
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          example: "john@gmail.com",
        },
        password: {
          type: "string",
          example: "john123",
        },
      },
      Users: {
        type: "array",
        $ref: "#/definitions/login",
      },
    },
    changePassword: {
      required: ["oldPassword", "newPassword"],
      properties: {
        oldPassword: {
          type: "string",
          example: "john@gmail.com",
        },
        newPassword: {
          type: "string",
          example: "john123",
        },
      },
      Users: {
        type: "array",
        $ref: "#/definitions/changePassword",
      },
    },
    storyMap: {
      required: ["comment", "rating"],
      properties: {
        comment: {
          type: "string",
          example: "hello this is demo comment",
        },
        rating: {
          type: "number",
          example: "1 to 5",
        },
      },
      Users: {
        type: "array",
        $ref: "#/definitions/storyMap",
      },
    },
  },
};
