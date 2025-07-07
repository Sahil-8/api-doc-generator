const fs = require('fs');
const path = require('path');
const SwaggerParser = require('swagger-parser');
const yaml = require('js-yaml');
const marked = require('marked');
const pdf = require('html-pdf');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();

    let parsedData = null;
    let fileContent = fs.readFileSync(filePath, 'utf8');

    if (ext === '.json') {
      // Try Swagger/OpenAPI or Postman JSON
      try {
        parsedData = await SwaggerParser.parse(filePath);
      } catch (e) {
        // Not a Swagger file, try as Postman or plain JSON
        parsedData = JSON.parse(fileContent);
      }
    } else if (ext === '.yaml' || ext === '.yml') {
      const doc = yaml.load(fileContent);
      try {
        parsedData = await SwaggerParser.parse(doc);
      } catch (e) {
        parsedData = doc;
      }
    } else if (ext === '.md') {
      parsedData = marked.parse(fileContent);
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    // You can save parsedData to MongoDB here if you want

    res.json({
      message: 'File uploaded and parsed successfully',
      parsedData
    });
  } catch (err) {
    res.status(500).json({ message: 'Error parsing file', error: err.message });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const { parsedData, fileName } = req.body;
    
    if (!parsedData) {
      return res.status(400).json({ message: 'No data provided for PDF generation' });
    }

    let htmlContent = '';

    // Generate HTML content based on the type of data
    if (typeof parsedData === 'string') {
      // Markdown content
      htmlContent = generateMarkdownHTML(parsedData, fileName);
    } else if (parsedData.info && parsedData.info.schema && parsedData.info.schema.includes("postman")) {
      // Postman Collection
      htmlContent = generatePostmanHTML(parsedData, fileName);
    } else if (parsedData.openapi || parsedData.swagger) {
      // Swagger/OpenAPI
      htmlContent = generateSwaggerHTML(parsedData, fileName);
    } else {
      // Generic JSON
      htmlContent = generateGenericJSONHTML(parsedData, fileName);
    }

    // PDF options
    const options = {
      format: 'A4',
      border: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      header: {
        height: '45px',
        contents: '<div style="text-align: center; font-size: 12px; color: #666; padding: 10px;">API Documentation</div>'
      },
      footer: {
        height: '28px',
        contents: '<div style="text-align: center; font-size: 10px; color: #666; padding: 10px;">Generated on ' + new Date().toLocaleDateString() + '</div>'
      }
    };

    // Generate PDF
    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating PDF', error: err.message });
      }

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName || 'documentation'}.pdf"`);
      res.setHeader('Content-Length', buffer.length);

      // Send the PDF buffer
      res.send(buffer);
    });

  } catch (err) {
    res.status(500).json({ message: 'Error generating PDF', error: err.message });
  }
};

// Helper functions to generate HTML for different content types
function generateMarkdownHTML(content, fileName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${fileName || 'Documentation'}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        h1, h2, h3, h4, h5, h6 { color: #333; margin-top: 20px; margin-bottom: 10px; }
        h1 { font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h3 { font-size: 18px; }
        p { margin-bottom: 10px; }
        code { background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 15px; color: #666; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        ul, ol { margin-bottom: 10px; }
        li { margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <h1>${fileName || 'Documentation'}</h1>
      ${content}
    </body>
    </html>
  `;
}

function generatePostmanHTML(data, fileName) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.info?.name || 'Postman Collection'}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        h1, h2, h3, h4 { color: #333; margin-top: 20px; margin-bottom: 10px; }
        h1 { font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h3 { font-size: 18px; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-right: 10px; }
        .get { background-color: #d4edda; color: #155724; }
        .post { background-color: #cce5ff; color: #004085; }
        .put { background-color: #fff3cd; color: #856404; }
        .delete { background-color: #f8d7da; color: #721c24; }
        .request { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .url { font-family: monospace; background-color: #f5f5f5; padding: 5px; border-radius: 3px; }
        .section { margin-bottom: 20px; }
        .header-item, .body-item { margin: 5px 0; font-size: 14px; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>${data.info?.name || 'Postman Collection'}</h1>
      <p><strong>Collection ID:</strong> ${data.info?._postman_id || 'N/A'}</p>
  `;

  if (data.item && data.item.length > 0) {
    html += '<h2>API Requests</h2>';
    data.item.forEach((item, index) => {
      const method = item.request?.method || 'UNKNOWN';
      const methodClass = method.toLowerCase();
      const url = item.request?.url?.raw || item.request?.url?.host?.join('/') || 'N/A';
      
      html += `
        <div class="request">
          <h3>${item.name}</h3>
          <div class="section">
            <span class="method ${methodClass}">${method}</span>
            <span class="url">${url}</span>
          </div>
      `;

      // Headers
      if (item.request?.header && item.request.header.length > 0) {
        html += '<div class="section"><h4>Headers</h4>';
        item.request.header.forEach(header => {
          html += `<div class="header-item"><strong>${header.key}:</strong> ${header.value}</div>`;
        });
        html += '</div>';
      }

      // Body
      if (item.request?.body) {
        html += '<div class="section"><h4>Request Body</h4>';
        html += `<pre>${item.request.body.raw || JSON.stringify(item.request.body, null, 2)}</pre>`;
        html += '</div>';
      }

      html += '</div>';
    });
  }

  html += '</body></html>';
  return html;
}

function generateSwaggerHTML(data, fileName) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.info?.title || 'API Documentation'}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        h1, h2, h3, h4 { color: #333; margin-top: 20px; margin-bottom: 10px; }
        h1 { font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h3 { font-size: 18px; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-right: 10px; }
        .get { background-color: #d4edda; color: #155724; }
        .post { background-color: #cce5ff; color: #004085; }
        .put { background-color: #fff3cd; color: #856404; }
        .delete { background-color: #f8d7da; color: #721c24; }
        .endpoint { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .path { font-family: monospace; background-color: #f5f5f5; padding: 5px; border-radius: 3px; }
        .section { margin-bottom: 15px; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f5f5f5; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
        .server { background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin: 5px 0; }
      </style>
    </head>
    <body>
      <h1>${data.info?.title || 'API Documentation'}</h1>
      <p><strong>Version:</strong> ${data.info?.version || 'N/A'}</p>
      ${data.info?.description ? `<p>${data.info.description}</p>` : ''}
  `;

  // Servers
  if (data.servers && data.servers.length > 0) {
    html += '<h2>Servers</h2>';
    data.servers.forEach((server, index) => {
      html += `
        <div class="server">
          <strong>${server.url}</strong>
          ${server.description ? `<br><small>${server.description}</small>` : ''}
        </div>
      `;
    });
  }

  // Endpoints
  if (data.paths) {
    html += '<h2>Endpoints</h2>';
    Object.entries(data.paths).forEach(([path, methods]) => {
      html += `<div class="endpoint"><h3 class="path">${path}</h3>`;
      
      Object.entries(methods).forEach(([method, details]) => {
        const methodClass = method.toLowerCase();
        html += `
          <div class="section">
            <span class="method ${methodClass}">${method.toUpperCase()}</span>
            <strong>${details.summary || 'No summary'}</strong>
            ${details.description ? `<p>${details.description}</p>` : ''}
        `;

        // Parameters
        if (details.parameters && details.parameters.length > 0) {
          html += '<h4>Parameters</h4><table><tr><th>Name</th><th>Type</th><th>Location</th><th>Required</th></tr>';
          details.parameters.forEach(param => {
            html += `<tr><td>${param.name}</td><td>${param.schema?.type || 'string'}</td><td>${param.in}</td><td>${param.required ? 'Yes' : 'No'}</td></tr>`;
          });
          html += '</table>';
        }

        // Responses
        if (details.responses) {
          html += '<h4>Responses</h4>';
          Object.entries(details.responses).forEach(([code, response]) => {
            html += `<div><strong>${code}</strong>: ${response.description}</div>`;
          });
        }

        html += '</div>';
      });
      html += '</div>';
    });
  }

  // Schemas
  if (data.components?.schemas) {
    html += '<h2>Data Models</h2>';
    Object.entries(data.components.schemas).forEach(([name, schema]) => {
      html += `
        <div class="endpoint">
          <h3>${name}</h3>
          <pre>${JSON.stringify(schema, null, 2)}</pre>
        </div>
      `;
    });
  }

  html += '</body></html>';
  return html;
}

function generateGenericJSONHTML(data, fileName) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${fileName || 'Data Structure'}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        h1, h2, h3 { color: #333; margin-top: 20px; margin-bottom: 10px; }
        h1 { font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        h2 { font-size: 20px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        h3 { font-size: 18px; }
        .section { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>${fileName || 'Data Structure'}</h1>
  `;

  Object.entries(data).forEach(([key, value]) => {
    html += `
      <div class="section">
        <h3>${key}</h3>
        ${Array.isArray(value) ? 
          `<p>Array with ${value.length} items</p>` : 
          ''
        }
        <pre>${JSON.stringify(value, null, 2)}</pre>
      </div>
    `;
  });

  html += '</body></html>';
  return html;
}
