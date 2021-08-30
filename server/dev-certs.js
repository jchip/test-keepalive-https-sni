"use strict";

const Fs = require("fs");
const Path = require("path");
const zlib = require("zlib");

/**
 * Read z64 file
 * @remark to create:
 * ```js
 * console.log(zlib.deflateSync(input).toString("base64").match(/.{1,70}/g).join("\n"))
 * ```
 *
 * @param filename
 * @returns
 */
function readZ64File(filename) {
  const input = Fs.readFileSync(filename, "utf-8");
  return zlib.inflateSync(Buffer.from(input, "base64")).toString();
}

exports.devCertKey = readZ64File(Path.join(__dirname, "certs/dev.key.z64"));

exports.devCert = readZ64File(Path.join(__dirname, "certs/dev.cer.z64"));
