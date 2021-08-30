const fastify = require("fastify");

const { devCert, devCertKey } = require("./dev-certs");

const socketTracker = {};

setInterval(() => {
  let count = 0;
  const now = Date.now();
  const keys = Object.keys(socketTracker);
  keys.forEach(key => {
    if (now - socketTracker[key].ts > 30 * 1000) {
      delete socketTracker[key];
      count++;
    }
  });
  console.log("removed", count, "of", keys.length, "sockets");
}, 15 * 1000).unref();

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
      if (!socketTracker[key]) {
        socketTracker[key] = { count: 0, ts: 0 };
      }
      socketTracker[key].count++;
      socketTracker[key].ts = Date.now();
      console.log(
        "socket remote address port",
        req.socket.remoteAddress,
        req.socket.remotePort,
        "use count",
        socketTracker[key].count,
        "total sockets",
        Object.keys(socketTracker).length,
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
