'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <h1 className="text-3xl font-bold text-white mb-8">API Documentation</h1>
      <div className="bg-white rounded-lg p-4">
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  );
}
