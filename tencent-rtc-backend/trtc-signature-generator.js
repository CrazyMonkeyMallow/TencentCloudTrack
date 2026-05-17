const TLSSigAPIv2 = require('tls-sig-api-v2');

function genUserSig({ SDKAPPID, SDKSECRETKEY, userId, expire = 3600 }) {
  const api = new TLSSigAPIv2.Api(Number(SDKAPPID), SDKSECRETKEY);
  return api.genSig(String(userId), expire);
}

module.exports = genUserSig;
