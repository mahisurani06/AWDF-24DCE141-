const NodeCache = require("node-cache");

// Set CACHE_TTL temporarily for experiments; the normal default is 60 seconds.
const cacheTtl = Number(process.env.CACHE_TTL) || 60;
const cache = new NodeCache({ stdTTL: cacheTtl });

module.exports = cache;