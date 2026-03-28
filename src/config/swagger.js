import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "../docs/openapi.spec.js";

export function setupSwagger(app) {
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
