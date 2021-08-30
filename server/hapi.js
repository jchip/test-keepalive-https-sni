const Hapi = require("hapi");

const { devCert, devCertKey } = require("./dev-certs");

async function start() {
  const server = new Hapi.Server();

  const tls = {
    key: devCertKey,
    cert: devCert
  };

  server.connection({ port: 8443, tls });

  server.route({
    method: "get",
    path: "/test1",
    handler: (req, reply) => {
      const socketNames = Object.keys(req.connection._connections);
      const socket = req.connection._connections[socketNames[0]];
      const servername = socket.servername;
      console.log(
        "socket name",
        socketNames[0],
        socket.remoteAddress,
        socket.remotePort
      );
      console.log("SNI servername", servername);
      console.log("host header", req.headers.host);

      const response = reply(servername);
      // response.header("Connection", "close");
    }
  });

  server.start(err => {
    console.log("hapi listening");
  });
}

start();
