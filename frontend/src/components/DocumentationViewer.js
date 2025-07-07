import React, { useState } from "react";

export default function DocumentationViewer({ parsedDocs }) {
  const [expandedEndpoints, setExpandedEndpoints] = useState({});

  if (!parsedDocs) return null;

  // Handle Markdown/HTML content
  if (typeof parsedDocs === "string") {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Documentation</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: parsedDocs }}
        />
      </div>
    );
  }

  // Handle Postman Collections
  if (parsedDocs.info && parsedDocs.info.schema && parsedDocs.info.schema.includes("postman")) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {parsedDocs.info?.name || "Postman Collection"}
          </h2>
          <p className="text-gray-600 mb-2">
            Collection ID: {parsedDocs.info?._postman_id}
          </p>
        </div>

        {/* Requests */}
        {parsedDocs.item && parsedDocs.item.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">API Requests</h3>
            <div className="space-y-4">
              {parsedDocs.item.map((item, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.request?.method === "GET"
                            ? "bg-green-100 text-green-800"
                            : item.request?.method === "POST"
                            ? "bg-blue-100 text-blue-800"
                            : item.request?.method === "PUT"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.request?.method === "DELETE"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.request?.method || "UNKNOWN"}
                      </span>
                      <span className="font-mono text-gray-700">
                        {item.request?.url?.raw || item.request?.url?.host?.join("/")}
                      </span>
                    </div>

                    {/* Headers */}
                    {item.request?.header && item.request.header.length > 0 && (
                      <div className="mb-3">
                        <h5 className="font-medium text-gray-700 mb-2">Headers</h5>
                        <div className="bg-gray-50 p-3 rounded">
                          {item.request.header.map((header, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium">{header.key}:</span> {header.value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Body */}
                    {item.request?.body && (
                      <div className="mb-3">
                        <h5 className="font-medium text-gray-700 mb-2">Request Body</h5>
                        <div className="bg-gray-50 p-3 rounded">
                          <pre className="text-sm overflow-auto">
                            {item.request.body.raw || JSON.stringify(item.request.body, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle Swagger/OpenAPI content
  if (parsedDocs.openapi || parsedDocs.swagger) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {parsedDocs.info?.title || "API Documentation"}
          </h2>
          <p className="text-gray-600 mb-2">
            Version: {parsedDocs.info?.version}
          </p>
          {parsedDocs.info?.description && (
            <p className="text-gray-700">{parsedDocs.info.description}</p>
          )}
        </div>

        {/* Servers */}
        {parsedDocs.servers && parsedDocs.servers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Servers</h3>
            <div className="space-y-2">
              {parsedDocs.servers.map((server, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <span className="font-medium">{server.url}</span>
                  {server.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {server.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Endpoints */}
        {parsedDocs.paths && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Endpoints</h3>
            <div className="space-y-4">
              {Object.entries(parsedDocs.paths).map(([path, methods]) => (
                <div key={path} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h4 className="font-mono text-lg font-semibold">{path}</h4>
                  </div>
                  <div className="divide-y">
                    {Object.entries(methods).map(([method, details]) => (
                      <div key={method} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                method === "get"
                                  ? "bg-green-100 text-green-800"
                                  : method === "post"
                                  ? "bg-blue-100 text-blue-800"
                                  : method === "put"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : method === "delete"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {method.toUpperCase()}
                            </span>
                            <span className="font-medium">
                              {details.summary || "No summary"}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setExpandedEndpoints({
                                ...expandedEndpoints,
                                [`${path}-${method}`]: !expandedEndpoints[
                                  `${path}-${method}`
                                ],
                              })
                            }
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {expandedEndpoints[`${path}-${method}`]
                              ? "Hide Details"
                              : "Show Details"}
                          </button>
                        </div>

                        {expandedEndpoints[`${path}-${method}`] && (
                          <div className="space-y-4">
                            {/* Description */}
                            {details.description && (
                              <div>
                                <h5 className="font-medium text-gray-700 mb-1">
                                  Description
                                </h5>
                                <p className="text-gray-600">
                                  {details.description}
                                </p>
                              </div>
                            )}

                            {/* Parameters */}
                            {details.parameters && details.parameters.length > 0 && (
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Parameters
                                </h5>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Name
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Type
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Location
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Required
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {details.parameters.map((param, index) => (
                                        <tr key={index}>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {param.name}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {param.schema?.type || "string"}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {param.in}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {param.required ? "Yes" : "No"}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Request Body */}
                            {details.requestBody && (
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Request Body
                                </h5>
                                <div className="bg-gray-50 p-3 rounded">
                                  <pre className="text-sm overflow-auto">
                                    {JSON.stringify(
                                      details.requestBody,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {/* Responses */}
                            {details.responses && (
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Responses
                                </h5>
                                <div className="space-y-2">
                                  {Object.entries(details.responses).map(
                                    ([code, response]) => (
                                      <div
                                        key={code}
                                        className="flex items-center space-x-3"
                                      >
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium ${
                                            code.startsWith("2")
                                              ? "bg-green-100 text-green-800"
                                              : code.startsWith("4")
                                              ? "bg-red-100 text-red-800"
                                              : "bg-gray-100 text-gray-800"
                                          }`}
                                        >
                                          {code}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                          {response.description}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schemas */}
        {parsedDocs.components?.schemas && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Data Models</h3>
            <div className="space-y-4">
              {Object.entries(parsedDocs.components.schemas).map(
                ([name, schema]) => (
                  <div key={name} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">{name}</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <pre className="text-sm overflow-auto">
                        {JSON.stringify(schema, null, 2)}
                      </pre>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }



  // Handle generic JSON with better formatting
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Data Structure</h2>
      
      {/* Try to identify and display common data patterns */}
      {Object.keys(parsedDocs).length > 0 && (
        <div className="space-y-4">
          {Object.entries(parsedDocs).map(([key, value]) => (
            <div key={key} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 capitalize">{key}</h3>
              
              {Array.isArray(value) ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Array with {value.length} items
                  </p>
                  {value.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded">
                      <pre className="text-sm overflow-auto max-h-48">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : typeof value === 'object' && value !== null ? (
                <div className="bg-gray-50 p-3 rounded">
                  <pre className="text-sm overflow-auto max-h-48">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-gray-700">{String(value)}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Raw JSON for reference */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Raw JSON</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {JSON.stringify(parsedDocs, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
