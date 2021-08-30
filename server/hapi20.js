const Hapi = require("@hapi/hapi");
const { devCert, devCertKey } = require("./dev-certs");

async function start() {
  const tls = {
    key: devCertKey,
    cert: devCert
  };

  const server = new Hapi.Server({
    port: 8443,
    host: "localhost",
    tls
  });

  server.route({
    method: "get",
    path: "/test1",
    handler: (req, h) => {
      const socket = req.raw.req.socket;
      const servername = socket.servername;
      console.log("socket name", socket.remoteAddress, socket.remotePort);
      console.log("SNI servername", servername);
      console.log("host header", req.headers.host);

      // const response = reply(servername);
      // response.header("Connection", "close");
      return servername;
    }
  });

  await server.start();
}

start();
