const https = require("https");
const { devCert, devCertKey } = require("./dev-certs");

async function start() {
  const server = https.createServer(
    {
      // https://nodejs.org/api/tls.html#tls_session_resumption
      sessionTimeout: 1000, // TLS session timeout,
      SNICallback: (servername, callback) => {
        console.log("SNICallback", servername);
        callback();
      },
      timeout: 5000,
      keepAliveTimeout: 100000,
      key: devCertKey,
      cert: devCert
    },
    (req, res) => {
      console.log("------", req.url);
      console.log(
        "socket remote address port",
        req.socket.remoteAddress,
        req.socket.remotePort
      );
      console.log("SNI servername", req.socket.servername);
      console.log("host header", req.headers.host);
      // res.setHeader("Connection", "close");
      res.writeHead(200);
      res.end(req.socket.servername);
    }
  );

  server.listen(8443, () => {
    console.log("node.js listening");
  });
}

start();
