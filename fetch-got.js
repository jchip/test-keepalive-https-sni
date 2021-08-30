const dns = require("dns");
const got = require("got");
const ElectrodeKeepAlive = require("electrode-keepalive");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function interceptDns() {
  dns.lookup = (domain, options, callback) => {
    if (!callback) {
      callback = options;
    }
    if (domain === "0.0.0.0") {
      callback(null, domain, 4);
    } else {
      // console.log("domain", domain);
      callback(null, "127.0.0.1", 4);
    }
  };
}

interceptDns();

let kaAgent;

const eka = new ElectrodeKeepAlive({
  expiry: 500000,
  https: true,
  rejectUnauthorized: false
});

kaAgent = eka.agent;

console.log("Agent has scheduling", kaAgent.hasScheduling);
// console.log("fetching", url, "keepAlive", Boolean(keepAlive));

let fetchCount = 0;

async function testTlsSni() {
  // kaAgent = new https.Agent({
  //   keepAlive: true,
  //   rejectUnauthorized: false
  //   // servername: "wooo"
  // });

  // kaAgent = new HttpsAgent({
  //   maxSockets: 100,
  //   maxFreeSockets: 10,
  //   timeout: 60000, // active socket keepalive for 60 seconds
  //   freeSocketTimeout: 30000, // free socket keepalive for 30 seconds
  //   rejectUnauthorized: false
  // });

  const testFetch = async (host, keepAlive) => {
    const options = {
      agent: { https: kaAgent }
      // https://github.com/nodejs/node/issues/37104
      // headers: { host: "woooo" }
    };
    const url = `https://${host}/test1`;
    const r = await got(url, options);
    fetchCount++;
    // console.log(r.headers);
  };

  const keepAlive = true;

  await testFetch(`localhost1:8443`, keepAlive);
  await delay(10);

  await testFetch(`localhost2:8443`, keepAlive);
  await delay(10);
  await testFetch(`localhost1:8443`, keepAlive);
}

// testTlsSni();

const MB = 1024 * 1024;
setInterval(() => {
  const mem = process.memoryUsage();
  console.log(
    "fetched",
    fetchCount,
    "rss",
    mem.rss / MB,
    "heap",
    mem.heapTotal / MB,
    "used",
    mem.heapUsed / MB
  );
}, 1000);

const xaa = require("xaa");

async function massTest() {
  const run = Array.from({ length: 50 }, (a, b) => b);
  for (let i = 0; i < 2000; i++) {
    await xaa.map(run, () => testTlsSni(), { concurrency: run.length });
  }
}

massTest().then(async () => {
  console.log("waiting 2 min");
  await delay(2 * 60 * 1000);
  return massTest();
});
