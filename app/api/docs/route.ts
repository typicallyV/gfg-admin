import { NextResponse } from "next/server";
import swaggerJSDoc from "swagger-jsdoc";

export async function GET() {
  const spec = swaggerJSDoc({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Admin API",
        version: "1.0.0",
      },
    },
    apis: ["./controllers/**/*.ts", "./app/api/**/*.ts"],
  });

  return NextResponse.json(spec);
}