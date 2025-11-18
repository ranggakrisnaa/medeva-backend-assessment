import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { authRegistry } from "$routes/AuthRoute";
import { modelsRegistry } from "$validations/domain/Models";
import { employeeRegistry } from "$routes/EmployeeRoute";

export type OpenAPIDocument = ReturnType<
  OpenApiGeneratorV3["generateDocument"]
>;

export function generateOpenAPIDocument(): OpenAPIDocument {
  const registry = new OpenAPIRegistry([
    authRegistry,
    modelsRegistry,
    employeeRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const documents = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "API Documentation",
      description: "API Documentation for the Management System",
    },
    externalDocs: {
      description: "View Raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
    servers: [
      {
        url: "/api/v1",
        description: "API Version 1",
      },
    ],
  });

  if (!documents.components) {
    documents.components = {};
  }

  if (!documents.components.securitySchemes) {
    documents.components.securitySchemes = {};
  }

  documents.components.securitySchemes = {
    ...documents.components.securitySchemes,
    bearerAuth: {
      type: "http" as const,
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Enter your JWT Bearer token",
    },
  };

  return documents;
}
