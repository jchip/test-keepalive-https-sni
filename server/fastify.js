const fastify = require("fastify");

const { devCert, devCertKey } = require("./dev-certs");

const socketCounts = {};

async function start() {
  const server = fastify({
    headersTimeout: 10000,
    keepAliveTimeout: 10000,
    server: { headersTimeout: 10000, keepAliveTimeout: 10000 },
    https: {
      keepAliveTimeout: 50000,
      allowHTTP1: true,
      key: devCertKey,
      cert: devCert
    }
  });

  server.route({
    method: "GET",
    url: "/test1",
    handler: async req => {
      // console.log("------");
      const key = req.socket.remoteAddress + ":" + req.socket.remotePort;
      if (!socketCounts[key]) {
        socketCounts[key] = 0;
      }
      socketCounts[key]++;
      console.log(
        "socket remote address port",
        req.socket.remoteAddress,
        req.socket.remotePort,
        "use count",
        socketCounts[key],
        "total sockets",
        Object.keys(socketCounts).length,
        "SNI servername",
        req.socket.servername,
        "host header",
        req.headers.host
      );

      return req.socket.servername;
    }
  });

  await server.listen(8443);

  console.log("fastify listening");
}

start();
