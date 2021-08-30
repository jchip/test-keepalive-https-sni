const dns = require("dns");
const https = require("https");

function interceptDns() {
  dns.lookup = (domain, options, callback) => {
    if (!callback) {
      callback = options;
    }
    if (domain === "0.0.0.0") {
      callback(null, domain, 4);
    } else {
      callback(null, "127.0.0.1", 4);
    }
  };
}

async function testTlsSni() {
  interceptDns();

  const testFetch = async (hostname, port, keepAlive) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname,
        port,
        path: "/test1",
        method: "GET",
        agent: new https.Agent({
          keepAlive,
          rejectUnauthorized: false
          // servername: "wooo"
        })
      };

      const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on("data", d => {
          process.stdout.write(d);
          resolve();
        });
      });

      req.on("error", error => {
        console.error(error);
      });

      req.end();
    });
  };

  const keepAlive = true;

  await testFetch(`blah`, 8443, keepAlive);
  await testFetch(`foo`, 8443, keepAlive);
}

testTlsSni();
