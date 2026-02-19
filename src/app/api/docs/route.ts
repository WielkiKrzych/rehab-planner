import { NextRequest, NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rehab Planner API',
      version: '1.0.0',
      description: 'API do zarządzania planami rehabilitacji dla fizjoterapeutów',
      contact: {
        name: 'Rehab Planner',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Patient: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            birthDate: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            notes: { type: 'string' },
          },
        },
        Plan: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['template', 'active', 'completed'] },
            patientId: { type: 'string' },
          },
        },
        Exercise: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            bodyPart: { type: 'string' },
            difficulty: { type: 'number' },
          },
        },
        Diagnosis: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            date: { type: 'string' },
            notes: { type: 'string' },
            patientId: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'],
};

export async function GET(request: NextRequest) {
  try {
    const specs = swaggerJsdoc(options);
    return NextResponse.json(specs);
  } catch (error) {
    console.error('Failed to generate swagger specs:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}
