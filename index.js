const https = require("https");
const fs = require("fs");

const PORT = process.env.port || 8080;

https
  .createServer((request, response) => {
    const url = new URL(request.url, `https://${request.headers.host}`);
    let path = url.pathname;

    if (path.indexOf(".css") !== -1) {
      grabRequestedFile("pages/styles.css", "text/css", response);
    } else if (path === "/") {
      const initialPath = "pages/index.html";
      grabRequestedFile(initialPath, "text/html", response);
    } else {
      const pagePath = `pages${path}`;
      grabRequestedFile(pagePath, "text/html", response);
    }
  })
  .listen(PORT);

function grabRequestedFile(pathName, mimeType, response) {
  fs.readFile(pathName, (error, data) => {
    switch (mimeType) {
      case "text/html":
        if (error) {
          show404Page(response);
          return;
        }

        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(data);

        response.end();
        break;
      case "text/css":
        if (error) {
          throw new Error(error);
        }

        response.writeHead(200, { "Content-Type": "text/css" });
        response.write(data);
        response.end();

        break;
      default:
        throw new Error(`${mimeType} does not exist`);
    }
  });
}

function show404Page(response) {
  const errorPagePath = "pages/404.html";

  fs.readFile(errorPagePath, (error, data) => {
    if (error) {
      throw new Error(`${errorPagePath} does not exist: ${error}`);
    }

    response.writeHead(404, { "Content-Type": "text/html" });
    response.write(data);
    response.end();
  });
}
