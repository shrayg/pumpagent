// grinderWorker.js
self.importScripts(
  "https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"
);

const { Keypair } = solanaWeb3;

self.onmessage = function (e) {
  const { prefix, suffix, prefixCaseSensitive, suffixCaseSensitive } = e.data;

  function isMatch(pubKey) {
    const testKeyPrefix = prefixCaseSensitive ? pubKey : pubKey.toLowerCase();
    const testKeySuffix = suffixCaseSensitive ? pubKey : pubKey.toLowerCase();

    const testPrefix = prefixCaseSensitive ? prefix : prefix.toLowerCase();
    const testSuffix = suffixCaseSensitive ? suffix : suffix.toLowerCase();

    const startsOk = !prefix || testKeyPrefix.startsWith(testPrefix);
    const endsOk = !suffix || testKeySuffix.endsWith(testSuffix);

    return startsOk && endsOk;
  }

  let attempts = 0;

  while (true) {
    const keypair = Keypair.generate();
    const pubkey = keypair.publicKey.toBase58();
    attempts++;

    if (isMatch(pubkey)) {
      self.postMessage({
        pubkey,
        secretKey: Array.from(keypair.secretKey),
      });
      // Keep going to find more matches
    }

    if (attempts % 10000 === 0) {
      self.postMessage({
        status: `Tried ${attempts} keys...`,
      });
    }
  }
};
