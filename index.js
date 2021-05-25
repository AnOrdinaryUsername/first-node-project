const http = require("http");
const fs = require("fs");

const PORT = process.env.PORT || 8080;

http
  .createServer((request, response) => {
    const url = new URL(request.url, `https://${request.headers.host}`);
    let path = url.pathname;

    if (path.indexOf(".css") !== -1) {
      grabRequestedFile("pages/styles.css", "text/css", response);
    } else {
      grabRequestedFile(path, "text/html", response);
    }
  })
  .listen(PORT);

function grabRequestedFile(pathName, mimeType, response) {
  let pagePath = null;
  if (mimeType === "text/html") {
    switch (pathName) {
      case "/":
        pagePath = "pages/index.html";
        break;
      case "/about":
        pagePath = "pages/about.html";
        break;
      case "/contact-me":
        pagePath = "pages/contact-me.html";
        break;
      default:
        pagePath = "pages/404.html";
        break;
    }
  } else {
    pagePath = pathName;
  }

  fs.readFile(pagePath, (error, data) => {
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
