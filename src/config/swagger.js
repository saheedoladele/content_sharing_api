import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "../docs/openapi.spec.js";
import { logger } from "./logger.js";

export function setupSwagger(app) {
  logger.info(
    { openapi: "/openapi.json", swaggerUi: "/api-docs" },
    "openapi spec & swagger UI mounted"
  );

  app.get("/openapi.json", (req, res) => {
    res.json(openapiSpec);
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpec, {
      customSiteTitle: "Content Sharing API",
    })
  );
}
