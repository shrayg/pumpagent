export const httpsIntroductionMetadata = {
  parameters: [
    {
      title: "recipient",
      type: "object",
      required: "required",
      copy: ["Public key object of the token recipient."],
      list: [],
    },
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token to buy."],
      list: [],
    },
    {
      title: "solIn",
      type: "string",
      required: "required",
      copy: ["SOL amount to buy."],
      list: [],
    },
    {
      title: "prioFee",
      type: "string",
      required: "optional",
      copy: [
        "Dynamically calculated priority fee: 'Low' | 'Medium' | 'High' | 'VeryHigh'",
      ],
      list: [],
    },
    {
      title: "optionalFeeCharge",
      type: "string",
      required: "optional",
      copy: ["Percentage of fees to charge. Min: 0.1% Max: 90%"],
      list: [],
    },
  ],
  response: [
    {
      title: "serializedTransaction ",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
};

export const httpsGenerateWalletsMetadata = {
  parameters: [
    {
      title: "amount",
      type: "string",
      required: "required",
      copy: ["Amount of wallets to generate."],
      list: ['Value between: "1" | "1000"'],
    },
  ],
  response: [
    {
      title: "walletArray",
      type: "array",
      copy: ["Array of wallet objects."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "publicKey: Public key of the generated wallet.",
            type: "string",
          },
          {
            copy: "privateKey: Private key of the generated wallet.",
            type: "string",
          },
        ],
      },
    },
  ],
};

export const httpsFundWalletsMetadata = {
  parameters: [
    {
      title: "funderPubKey",
      type: "object",
      required: "required",
      copy: ["Public key object of the transaction funder."],
      list: [],
    },

    {
      title: "wallets",
      type: "array",
      required: "required",
      copy: ["Array of wallet objects to be funded."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "publicKey: Fund recipient wallet address.",
            type: "string",
          },
          {
            copy: "amount: SOL amount to receive.",
            type: "string",
          },
        ],
      },
    },
  ],
  response: [
    {
      title: "serializedTransaction ",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
};

export const httpsClaimProfitsMetadata = {
  parameters: [
    {
      title: "funderPubKey",
      type: "object",
      required: "required",
      copy: ["Public key object of the transaction funder."],
      list: [],
    },
    {
      title: "solIn",
      type: "string",
      required: "required",
      copy: ["SOL amount to claim."],
      list: [],
    },
  ],
  response: [
    {
      title: "serializedTransaction ",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
};

export const httpsCreateIPFSMetadata = {
  parameters: [
    {
      title: "image",
      type: "string",
      required: "required",
      copy: "Base64-encoded Data URL.",
      list: [],
    },
    {
      title: "name",
      type: "string",
      required: "required",
      copy: ["Name of the token."],
      list: [],
    },
    {
      title: "symbol",
      type: "string",
      required: "required",
      copy: ["Symbol of the token."],
      list: [],
    },
    {
      title: "description",
      type: "string",
      required: "optional",
      copy: ["Token description."],
    },
    {
      title: "twitter",
      type: "string",
      required: "optional",
      copy: ["Twitter URL associated with the token."],
      list: [],
    },
    {
      title: "telegram",
      type: "string",
      required: "optional",
      copy: ["Telegram URL associated with the token."],
      list: [],
    },
    {
      title: "website",
      type: "string",
      required: "optional",
      copy: ["Website URL associated with the token."],
      list: [],
    },
  ],
  response: [
    {
      title: "metadata",
      type: "object",
      copy: ["Object containing metadata."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "createdOn: Source of token creation.",
            type: "string",
          },
          {
            copy: "description: Token description.",
            type: "string",
          },
          {
            copy: "image: IPFS image URL.",
            type: "string",
          },
          {
            copy: "uri: IPFS metadata URI.",
            type: "string",
          },
          {
            copy: "name: Token name.",
            type: "string",
          },
          {
            copy: "showName: Indicating whether name is shown.",
            type: "boolean",
          },
          {
            copy: "symbol: Token symbol.",
            type: "string",
          },
          {
            copy: "telegram: Token associated telegram URL.",
            type: "string",
          },
          {
            copy: "twitter: Token associated twitter URL.",
            type: "string",
          },
          {
            copy: "website: Token associated website URL.",
            type: "string",
          },
        ],
      },
    },
  ],
};

export const httpsPumpChartMetadata = {
  parameters: [
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: "Contract address of the pump.fun token.",
      list: [],
    },
  ],
  response: [
    {
      title: "chartData",
      type: "array",
      copy: ["Array of formatted OHLC data objects."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "time: Candlestick timestamp.",
            type: "number",
          },
          {
            copy: "open: Candlestick open price.",
            type: "number",
          },
          {
            copy: "high: Candlestick high price.",
            type: "number",
          },
          {
            copy: "low: Candlestick low price.",
            type: "number",
          },
          {
            copy: "close: Candlestick close price.",
            type: "number",
          },
        ],
      },
    },
  ],
};

export const httpsCreateLookupTableMetadata = {
  parameters: [
    {
      title: "creator",
      type: "object",
      required: "required",
      copy: ["Public key object of the lookup table creator."],
      list: [],
    },
    {
      title: "prioFee",
      type: "string",
      required: "optional",
      copy: [
        "Dynamically calculated priority fee: 'Low' | 'Medium' | 'High' | 'VeryHigh'",
      ],
      list: [],
    },
  ],
  response: [
    {
      title: "serializedTransaction",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
  response2: [
    {
      title: "lut",
      type: "string",
      copy: ["Lookup table address."],
      list: [],
    },
  ],
};

export const httpsExtendLookupTableMetadata = {
  parameters: [
    {
      title: "creator",
      type: "object",
      required: "required",
      copy: ["Public key object of the lookup table creator."],
      list: [],
    },
    {
      title: "wallets",
      type: "array",
      required: "required",
      copy: ["Array of up to 20 wallet addresses to add to the lookup table."],
      list: {
        type: "array",
        value: "array []",
        properties: [
          {
            copy: "Wallet address.",
            type: "string",
          },
        ],
      },
    },
    {
      title: "lut",
      type: "string",
      required: "required",
      copy: ["Look up table address."],
      list: [],
    },
    {
      title: "prioFee",
      type: "string",
      required: "optional",
      copy: [
        "Dynamically calculated priority fee: 'Low' | 'Medium' | 'High' | 'VeryHigh'",
      ],
      list: [],
    },
  ],
  response: [
    {
      title: "serializedTransaction ",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
};

export const httpsPumpBondingCurveMetadata = {
  parameters: [
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token you wish to analyze."],
      list: [],
    },
  ],
  response: [
    {
      title: "curveProgress",
      type: "number",
      copy: ["Bonding curve progress as percentage."],
      list: [],
    },
  ],
};

export const httpsPumpTokenInfoMetadata = {
  parameters: [
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token you wish to analyze."],
      list: [],
    },
  ],
  response: [
    {
      title: "response",
      type: "object",
      copy: ["Token information for the provided contract address."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "mint: Token mint address.",
            type: "string",
          },
          {
            copy: "name: Token name.",
            type: "string",
          },
          {
            copy: "symbol: Token symbol.",
            type: "string",
          },
          {
            copy: "description: Token description.",
            type: "string",
          },
          {
            copy: "image_uri: URI to the token image.",
            type: "string",
          },
          {
            copy: "metadata_uri: URI to the token metadata.",
            type: "string",
          },
          {
            copy: "twitter: Token project Twitter handle, if available.",
            type: "string",
          },
          {
            copy: "telegram: Token project Telegram link, if available.",
            type: "string",
          },
          {
            copy: "website: Token website, if provided.",
            type: "string",
          },
          {
            copy: "creator: Public key of the token creator.",
            type: "string",
          },
          {
            copy: "created_timestamp: Timestamp when token was created.",
            type: "number",
          },
          {
            copy: "raydium_pool: Associated Raydium pool, if any.",
            type: "string",
          },
          {
            copy: "bonding_curve: Bonding curve address.",
            type: "string",
          },
          {
            copy: "associated_bonding_curve: Associated bonding curve address.",
            type: "string",
          },
          {
            copy: "virtual_sol_reserves: Virtual SOL reserves in the pool.",
            type: "number",
          },
          {
            copy: "virtual_token_reserves: Virtual token reserves in the pool.",
            type: "number",
          },
          {
            copy: "real_sol_reserves: Actual SOL reserves in the pool.",
            type: "number",
          },
          {
            copy: "real_token_reserves: Actual token reserves in the pool.",
            type: "number",
          },
          {
            copy: "total_supply: Total token supply.",
            type: "number",
          },
          {
            copy: "market_cap: Market cap in SOL.",
            type: "number",
          },
          {
            copy: "usd_market_cap: Market cap in USD.",
            type: "number",
          },
          {
            copy: "ath_market_cap: All-time-high market cap in SOL.",
            type: "number",
          },
          {
            copy: "ath_market_cap_timestamp: Timestamp of ATH market cap.",
            type: "number",
          },
          {
            copy: "last_trade_timestamp: Timestamp of last trade.",
            type: "number",
          },
          {
            copy: "last_reply: Timestamp of last reply.",
            type: "number",
          },
          {
            copy: "reply_count: Total number of replies.",
            type: "number",
          },
          {
            copy: "banner_uri: URI of the banner image, if available.",
            type: "string",
          },
          {
            copy: "video_uri: URI of any video content linked to the token.",
            type: "string",
          },
          {
            copy: "pump_swap_pool: Address of the pump.fun swap pool, if any.",
            type: "string",
          },
          {
            copy: "market_id: ID of the token's market (if listed).",
            type: "string",
          },
          {
            copy: "king_of_the_hill_timestamp: Timestamp of most recent KOTH win.",
            type: "number",
          },
          {
            copy: "livestream_ban_expiry: Timestamp when livestream ban expires.",
            type: "number",
          },
          {
            copy: "livestream_downrank_score: Downrank score for livestream.",
            type: "number",
          },
          {
            copy: "show_name: Whether token name should be displayed.",
            type: "boolean",
          },
          {
            copy: "hide_banner: Whether the banner should be hidden.",
            type: "boolean",
          },
          {
            copy: "is_banned: Whether token is banned.",
            type: "boolean",
          },
          {
            copy: "is_currently_live: Whether token is live on stream.",
            type: "boolean",
          },
          {
            copy: "initialized: Whether token is fully initialized.",
            type: "boolean",
          },
          {
            copy: "complete: Whether the token migration is complete.",
            type: "boolean",
          },
          {
            copy: "nsfw: Whether the token is marked NSFW.",
            type: "boolean",
          },
          {
            copy: "inverted: Whether chart or pricing is inverted.",
            type: "boolean",
          },
          {
            copy: "updated_at: Last updated timestamp.",
            type: "number",
          },
        ],
      },
    },
  ],
};

export const httpsPumpTokenBumpMetadata = {
  parameters: [
    {
      title: "recipient",
      type: "object",
      required: "required",
      copy: ["Public key object of the token recipient."],
      list: [],
    },
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token to buy."],
      list: [],
    },
    {
      title: "solIn",
      type: "string",
      required: "required",
      copy: ["SOL amount to use per bump."],
      list: [],
    },
    {
      title: "prioFee",
      type: "string",
      required: "optional",
      copy: [
        "Dynamically calculated priority fee: 'Low' | 'Medium' | 'High' | 'VeryHigh'",
      ],
      list: [],
    },
    {
      title: "optionalFeeCharge",
      type: "string",
      required: "optional",
      copy: ["Percentage of fees to charge. Min: 0.1% Max: 90%"],
      list: [],
    },
  ],
  response: [
    {
      title: "serializedTransaction ",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
};

export const httpsPumpMultiBuyMetadata = {
  parameters: [
    {
      title: "feePayer",
      type: "object",
      required: "required",
      copy: ["Public key object of the fee payer."],
      list: [],
    },
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token to buy."],
      list: [],
    },
    {
      title: "wallets",
      type: "array",
      required: "required",
      copy: ["Array of up to 20 wallet address objects."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "publicKey: Wallet address of buyer.",
            type: "string",
          },
          {
            copy: "solBuy: SOL amount to buy.",
            type: "string",
          },
        ],
      },
    },
    {
      title: "optionalFeeCharge",
      type: "string",
      required: "optional",
      copy: ["Percentage of fees to charge. Min: 0.1% Max: 90%"],
      list: [],
    },
    {
      title: "tip",
      type: "string",
      required: "optional",
      copy: ["Bundle tip. Default is 0.0001 SOL"],
      list: [],
    },
  ],
  response: [
    {
      title: "versionedTxs",
      type: "array",
      copy: ["Array of base64 encoded unsigned transactions."],
      list: [],
    },
  ],
};

export const httpsPumpMultiSellMetadata = {
  parameters: [
    {
      title: "feePayer",
      type: "object",
      required: "required",
      copy: ["Public key object of the fee payer."],
      list: [],
    },
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token that you wish to sell."],
      list: [],
    },
    {
      title: "wallets",
      type: "array",
      required: "required",
      copy: ["Array of up to 20 wallet address objects."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "publicKey: Wallet address of seller.",
            type: "string",
          },
          {
            copy: "tokenAmount: Token amount to sell.",
            type: "string",
          },
        ],
      },
    },
    {
      title: "optionalFeeCharge",
      type: "string",
      required: "optional",
      copy: ["Percentage of fees to charge. Min: 0.1% Max: 90%"],
      list: [],
    },
    {
      title: "tip",
      type: "string",
      required: "optional",
      copy: ["Bundle tip. Default is 0.0001 SOL"],
      list: [],
    },
  ],
  response: [
    {
      title: "versionedTxs",
      type: "array",
      copy: ["Array of base64 encoded unsigned transactions."],
      list: [],
    },
  ],
};

export const httpsPumpDumpAllMetadata = {
  parameters: [
    {
      title: "receiver",
      type: "object",
      required: "required",
      copy: ["Public key object of funds receiver."],
      list: [],
    },
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token that you wish to sell."],
      list: [],
    },
    {
      title: "wallets",
      type: "array",
      required: "required",
      copy: ["Array of up to 20 wallet address objects."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "publicKey: Wallet address of seller.",
            type: "string",
          },
        ],
      },
    },
    {
      title: "optionalFeeCharge",
      type: "string",
      required: "optional",
      copy: ["Percentage of fees to charge. Min: 0.1% Max: 90%"],
      list: [],
    },
    {
      title: "tip",
      type: "string",
      required: "optional",
      copy: ["Bundle tip. Default is 0.0001 SOL"],
      list: [],
    },
  ],
  response: [
    {
      title: "versionedTxs",
      type: "array",
      copy: ["Array of base64 encoded unsigned transactions."],
      list: [],
    },
  ],
};

export const httpsPumpSingleSellMetadata = {
  parameters: [
    {
      title: "recipient",
      type: "object",
      required: "required",
      copy: ["Public key object of the token recipient."],
      list: [],
    },
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token to buy."],
      list: [],
    },
    {
      title: "tokenAmount",
      type: "string",
      required: "required",
      copy: ["Token amount to sell."],
      list: [],
    },
    {
      title: "prioFee",
      type: "string",
      required: "optional",
      copy: [
        "Dynamically calculated priority fee: 'Low' | 'Medium' | 'High' | 'VeryHigh'",
      ],
      list: [],
    },
    {
      title: "optionalFeeCharge",
      type: "string",
      required: "optional",
      copy: ["Percentage of fees to charge. Min: 0.1% Max: 90%"],
      list: [],
    },
  ],
  response: [
    {
      title: "serializedTransaction ",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
};

export const httpsPumpLaunchTokenMetadata = {
  parameters: [
    {
      title: "developer",
      type: "object",
      required: "required",
      copy: ["Public key object of the token developer."],
      list: [],
    },
    {
      title: "solIn",
      type: "string",
      required: "required",
      copy: ["SOL amount of the initial developer buy."],
      list: [],
    },
    {
      title: "name",
      type: "string",
      required: "required",
      copy: ["Name of the token."],
      list: [],
    },
    {
      title: "symbol",
      type: "string",
      required: "required",
      copy: ["Symbol of the token."],
      list: [],
    },
    {
      title: "uri",
      type: "string",
      required: "required",
      copy: ["metadataUri received by creating an IPFS storage object."],
      list: [],
    },
    {
      title: "vanityPriv",
      type: "string",
      required: "optional",
      copy: [
        "Vanity private key (as Base58) to create a custom token address.",
      ],
      list: [],
    },
    {
      title: "optionalFeeCharge",
      type: "string",
      required: "optional",
      copy: ["Optional launch fee in SOL."],
      list: [],
    },
  ],
  response: [
    {
      title: "serializedTransaction",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
  response2: [
    {
      title: "ca",
      type: "string",
      copy: ["Contract address of your new token."],
      list: [],
    },
  ],
};

export const httpsPumpLaunchBundleMetadata = {
  parameters: [
    {
      title: "funderPubKey",
      type: "object",
      required: "required",
      copy: ["Public key object of the transaction funder."],
      list: [],
    },
    {
      title: "sanitizedWallets",
      type: "array",
      required: "required",
      copy: [
        "Array of wallet objects to be bundled. First entry is the developer.",
      ],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "publicKey: Wallet address of token recipient.",
            type: "string",
          },
          {
            copy: "solBuy: SOL amount to buy.",
            type: "string",
          },
        ],
      },
    },
    {
      title: "name",
      type: "string",
      required: "required",
      copy: ["Name of the token."],
      list: [],
    },
    {
      title: "symbol",
      type: "string",
      required: "required",
      copy: ["Symbol of the token."],
      list: [],
    },
    {
      title: "lut",
      type: "string",
      required: "required",
      copy: ["Look up table address."],
      list: [],
    },
    {
      title: "uri",
      type: "string",
      required: "required",
      copy: ["metadataUri received by creating an IPFS storage object."],
      list: [],
    },
    {
      title: "vanityPriv",
      type: "string",
      required: "optional",
      copy: [
        "Vanity private key (as Base58) to create a custom token address.",
      ],
      list: [],
    },
    {
      title: "optionalFeeCharge",
      type: "string",
      required: "optional",
      copy: ["Optional launch fee in SOL."],
      list: [],
    },
    {
      title: "tip",
      type: "string",
      required: "optional",
      copy: ["Bundle tip. Default is 0.0005 SOL"],
      list: [],
    },
  ],
  response: [
    {
      title: "unsigned",
      type: "Array",
      copy: ["Array of base64 encoded unsigned transactions."],
      list: [],
    },
  ],
  response2: [
    {
      title: "ca",
      type: "string",
      copy: ["Contract address of your new token."],
      list: [],
    },
  ],
};

export const httpsDexSingleBuyMetadata = {
  parameters: [
    {
      title: "recipient",
      type: "object",
      required: "required",
      copy: ["Public key object of the token recipient."],
      list: [],
    },
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token to buy."],
      list: [],
    },
    {
      title: "solIn",
      type: "string",
      required: "required",
      copy: ["SOL amount to buy."],
      list: [],
    },

    {
      title: "prioFee",
      type: "string",
      required: "optional",
      copy: ["Priority fee to speed up transactions. Default is medium."],
      list: {
        properties: [
          {
            copy: "Accepted values: 'medium' | 'high' | 'veryHigh'",
            type: "string",
          },
        ],
      },
    },
  ],
  response: [
    {
      title: "serializedTransaction ",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
};

export const httpsDexSingleSellMetadata = {
  parameters: [
    {
      title: "recipient",
      type: "object",
      required: "required",
      copy: ["Public key object of the token recipient."],
      list: [],
    },
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the pump.fun token to buy."],
      list: [],
    },
    {
      title: "tokenAmount",
      type: "string",
      required: "required",
      copy: ["Token amount to sell."],
      list: [],
    },
    {
      title: "prioFee",
      type: "string",
      required: "optional",
      copy: ["Priority fee to speed up transactions. Default is medium."],
      list: {
        properties: [
          {
            copy: "Accepted values: 'medium' | 'high' | 'veryHigh'",
            type: "string",
          },
        ],
      },
    },
  ],
  response: [
    {
      title: "serializedTransaction ",
      type: "string",
      copy: ["Unsigned base64 encoded transaction."],
      list: [],
    },
  ],
};

export const httpsDexPaidMetadata = {
  parameters: [
    {
      title: "ca",
      type: "string",
      required: "required",
      copy: ["Contract address of the Solana token to check."],
      list: [],
    },
  ],
  response: [
    {
      title: "dexPaid ",
      type: "boolean",
      copy: ["Indicating whether dex was paid or not."],
      list: [],
    },
  ],
};

export const webSocketTokenMigrationMetadata = {
  parameters: [
    {
      title: "amount",
      type: "string",
      required: "required",
      copy: ["Amount of wallets to generate."],
      list: ['Value between: "1" | "1000"'],
    },
  ],
  response: [
    {
      title: "migration",
      type: "object",
      copy: ["Token migration information."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "creator: Token creator wallet address.",
            type: "string",
          },
          {
            copy: "mint: Contract address of the migrated token.",
            type: "string",
          },
          {
            copy: "timestamp: Token migration timestamp.",
            type: "number",
          },
        ],
      },
    },
  ],
};

export const webSocketTokenLaunchMetadata = {
  parameters: [
    {
      title: "amount",
      type: "string",
      required: "required",
      copy: ["Amount of wallets to generate."],
      list: ['Value between: "1" | "1000"'],
    },
  ],
  response: [
    {
      title: "launch",
      type: "object",
      copy: ["Token launch information."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "name: Token name.",
            type: "string",
          },
          {
            copy: "symbol: Token symbol.",
            type: "string",
          },
          {
            copy: "uri: IPFS metadata URI.",
            type: "string",
          },
          {
            copy: "mint: Contract address of the new token.",
            type: "string",
          },
          {
            copy: "creator: Creator wallet address.",
            type: "string",
          },
          {
            copy: "timestamp: Token creation timestamp.",
            type: "number",
          },
        ],
      },
    },
  ],
};

export const webSocketTokenTradesMetadata = {
  parameters: [
    {
      title: "mints",
      type: "array",
      required: "required",
      copy: ["Array of pump.fun contract addresses."],
      list: ['Value between: "1" | "1000"'],
    },
  ],
  response: [
    {
      title: "trade",
      type: "object",
      copy: ["Token trade information."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "mint: Contract address of the traded token.",
            type: "string",
          },
          {
            copy: "type: Transaction type: 'Buy' | 'Sell'.",
            type: "string",
          },
          {
            copy: "timestamp: Trade timestamp.",
            type: "number",
          },
          {
            copy: "sol_in_bondingcurve: Current SOL in the token's bondingcurve.",
            type: "number",
          },
          {
            copy: "recipient: Trade recipient.",
            type: "string",
          },
          {
            copy: "sol_buy: Sol buy amount if trade is buy.",
            type: "number",
          },
          {
            copy: "tokens_received: Token amount received if trade is buy.",
            type: "number",
          },
          {
            copy: "sol_received: SOL amount received if trade is sell.",
            type: "number",
          },
          {
            copy: "tokens_sold: Token amount sold if trade is sell.",
            type: "number",
          },
        ],
      },
    },
  ],
};

export const webSocketPoolTradesMetadata = {
  parameters: [
    {
      title: "pools",
      type: "array",
      required: "required",
      copy: ["Array of PumpSwap pool addresses."],
      list: ['Value between: "1" | "1000"'],
    },
  ],
  response: [
    {
      title: "trade",
      type: "object",
      copy: ["Pool trade information."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "timestamp: Trade UNIX timestamp.",
            type: "string",
          },
          {
            copy: "type: 'Buy' or 'Sell' trade type.",
            type: "string",
          },
          {
            copy: "base_amount_out: Amount of base token received in Buy. (only for Buy)",
            type: "string",
          },
          {
            copy: "max_quote_amount_in: Maximum quote tokens to spend in Buy. (only for Buy)",
            type: "string",
          },
          {
            copy: "base_amount_in: Amount of base token sold. (only for Sell)",
            type: "string",
          },
          {
            copy: "min_quote_amount_out: Minimum quote tokens expected out. (only for Sell)",
            type: "string",
          },
          {
            copy: "quote_amount_in: Actual quote tokens used in Buy. (only for Buy)",
            type: "string",
          },
          {
            copy: "quote_amount_out: Quote tokens received in Sell. (only for Sell)",
            type: "string",
          },
          {
            copy: "quote_amount_in_with_lp_fee: Quote input including LP fee. (only for Buy)",
            type: "string",
          },
          {
            copy: "quote_amount_out_without_lp_fee: Gross quote output before fees. (only for Sell)",
            type: "string",
          },
          {
            copy: "user_quote_amount_in: Actual quote tokens from user. (only for Buy)",
            type: "string",
          },
          {
            copy: "user_quote_amount_out: Quote tokens user receives. (only for Sell)",
            type: "string",
          },
          {
            copy: "user_base_token_reserves: User's base token balance before/after.",
            type: "string",
          },
          {
            copy: "user_quote_token_reserves: User's quote token balance before/after.",
            type: "string",
          },
          {
            copy: "pool_base_token_reserves: Pool base token balance before/after.",
            type: "string",
          },
          {
            copy: "pool_quote_token_reserves: Pool quote token balance before/after.",
            type: "string",
          },
          {
            copy: "lp_fee_basis_points: LP fee rate in basis points.",
            type: "string",
          },
          {
            copy: "lp_fee: Fee paid to LPs in quote tokens.",
            type: "string",
          },
          {
            copy: "protocol_fee_basis_points: Protocol fee rate in basis points.",
            type: "string",
          },
          {
            copy: "protocol_fee: Fee paid to protocol in quote tokens.",
            type: "string",
          },
          {
            copy: "pool: Public key of the pool.",
            type: "string",
          },
          {
            copy: "user: Public key of the user who executed the trade.",
            type: "string",
          },
          {
            copy: "user_base_token_account: User's base token account address.",
            type: "string",
          },
          {
            copy: "user_quote_token_account: User's quote token account address.",
            type: "string",
          },
          {
            copy: "protocol_fee_recipient: Address receiving protocol fee.",
            type: "string",
          },
          {
            copy: "protocol_fee_recipient_token_account: Token account receiving the protocol fee.",
            type: "string",
          },
        ],
      },
    },
  ],
};

export const webSocketUserTradesMetadata = {
  parameters: [
    {
      title: "users",
      type: "array",
      required: "required",
      copy: ["Array of Solana user wallet addresses."],
      list: ['Value between: "1" | "1000"'],
    },
  ],
  response: [
    {
      title: "trade",
      type: "object",
      copy: ["Token trade information."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "mint: Contract address of the traded token.",
            type: "string",
          },
          {
            copy: "type: Transaction type: 'Buy' | 'Sell'.",
            type: "string",
          },
          {
            copy: "timestamp: Trade timestamp.",
            type: "number",
          },
          {
            copy: "sol_in_bondingcurve: Current SOL in the token's bondingcurve.",
            type: "number",
          },
          {
            copy: "recipient: Trade recipient.",
            type: "string",
          },
          {
            copy: "sol_buy: Sol buy amount if trade is buy.",
            type: "number",
          },
          {
            copy: "tokens_received: Token amount received if trade is buy.",
            type: "number",
          },
          {
            copy: "sol_received: SOL amount received if trade is sell.",
            type: "number",
          },
          {
            copy: "tokens_sold: Token amount sold if trade is sell.",
            type: "number",
          },
        ],
      },
    },
  ],
};

export const webSocketPoolCreationMetadata = {
  parameters: [
    {
      title: "users",
      type: "array",
      required: "required",
      copy: ["Array of Solana user wallet addresses."],
      list: ['Value between: "1" | "1000"'],
    },
  ],
  response: [
    {
      title: "pool",
      type: "object",
      copy: ["Pool creation data."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "timestamp: Pool creation UNIX timestamp.",
            type: "number",
          },
          {
            copy: "index: Transaction type: 'Buy' | 'Sell'.",
            type: "number",
          },
          {
            copy: "creator: Public key of the pool creator.",
            type: "string",
          },
          {
            copy: "base_mint: Base token mint address.",
            type: "string",
          },
          {
            copy: "quote_mint: Quote token mint address.",
            type: "string",
          },
          {
            copy: "base_mint_decimals: Decimal precision of base token.",
            type: "number",
          },
          {
            copy: "quote_mint_decimals: Decimal precision of quote token.",
            type: "number",
          },
          {
            copy: "base_amount_in: Initial amount of base token provided.",
            type: "string",
          },
          {
            copy: "quote_amount_in: Initial amount of quote token provided.",
            type: "string",
          },
          {
            copy: "pool_base_amount: Base token amount in the pool after creation.",
            type: "string",
          },
          {
            copy: "pool_quote_amount: Quote token amount in the pool after creation.",
            type: "string",
          },
          {
            copy: "minimum_liquidity: Minimum LP token liquidity locked.",
            type: "string",
          },
          {
            copy: "initial_liquidity: Initial LP token supply minted.",
            type: "string",
          },
          {
            copy: "lp_token_amount_out: LP tokens minted to user.",
            type: "string",
          },
          {
            copy: "pool_bump: Pool PDA bump seed.",
            type: "number",
          },
          {
            copy: "pool: Public key of the newly created pool.",
            type: "string",
          },
          {
            copy: "lp_mint: Mint address of the LP token.",
            type: "string",
          },
          {
            copy: "user_base_token_account: User's base token account.",
            type: "string",
          },
          {
            copy: "user_quote_token_account: User's quote token account.",
            type: "string",
          },
        ],
      },
    },
  ],
};

export const webSocketKOLTradesMetadata = {
  parameters: [
    {
      title: "users",
      type: "array",
      required: "required",
      copy: ["Array of user Solana wallet addresses."],
      list: ['Value between: "1" | "1000"'],
    },
  ],
  response: [
    {
      title: "trade",
      type: "object",
      copy: ["KOL trade information."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "mint: Contract address of the traded token.",
            type: "string",
          },
          {
            copy: "type: Transaction type: 'Buy' | 'Sell'.",
            type: "string",
          },
          {
            copy: "timestamp: Trade timestamp.",
            type: "number",
          },
          {
            copy: "sol_in_bondingcurve: Current SOL in the token's bondingcurve.",
            type: "number",
          },
          {
            copy: "kol: KOL name.",
            type: "string",
          },
          {
            copy: "kol_twitter: KOL associated Twitter URL.",
            type: "string",
          },
          {
            copy: "message: Formatted trade message.",
            type: "string",
          },
          {
            copy: "sol_buy: Sol buy amount if trade is buy.",
            type: "number",
          },
          {
            copy: "tokens_received: Token amount received if trade is buy.",
            type: "number",
          },
          {
            copy: "sol_received: SOL amount received if trade is sell.",
            type: "number",
          },
          {
            copy: "tokens_sold: Token amount sold if trade is sell.",
            type: "number",
          },
        ],
      },
    },
  ],
};

export const webSocketPoolKOLTradesMetadata = {
  parameters: [
    {
      title: "users",
      type: "array",
      required: "required",
      copy: ["Array of user Solana wallet addresses."],
      list: ['Value between: "1" | "1000"'],
    },
  ],
  response: [
    {
      title: "trade",
      type: "object",
      copy: ["Pool KOL trade information."],
      list: {
        type: "object",
        value: "object { }",
        properties: [
          {
            copy: "kol: Name of the Key Opinion Leader (KOL) who made the trade.",
            type: "string",
          },
          {
            copy: "kol_twitter: Twitter handle of the KOL.",
            type: "string",
          },
          {
            copy: "timestamp: Trade UNIX timestamp.",
            type: "string",
          },
          {
            copy: "type: 'Buy' or 'Sell' trade type.",
            type: "string",
          },
          {
            copy: "message: Human-readable summary of the KOL trade.",
            type: "string",
          },
          {
            copy: "base_amount_out: Tokens received in Buy. (only for Buy)",
            type: "string",
          },
          {
            copy: "max_quote_amount_in: Max SOL spent in Buy. (only for Buy)",
            type: "string",
          },
          {
            copy: "base_amount_in: Tokens sold in Sell. (only for Sell)",
            type: "string",
          },
          {
            copy: "quote_amount_out: SOL received in Sell. (only for Sell)",
            type: "string",
          },
          {
            copy: "quote_amount_in: Actual SOL spent in Buy. (only for Buy)",
            type: "string",
          },
          {
            copy: "quote_amount_in_with_lp_fee: SOL input including LP fee. (only for Buy)",
            type: "string",
          },
          {
            copy: "user_quote_amount_in: Quote tokens sent from user. (only for Buy)",
            type: "string",
          },
          {
            copy: "lp_fee_basis_points: LP fee rate in basis points.",
            type: "string",
          },
          {
            copy: "lp_fee: Fee paid to LPs in quote tokens.",
            type: "string",
          },
          {
            copy: "protocol_fee_basis_points: Protocol fee rate in basis points.",
            type: "string",
          },
          {
            copy: "protocol_fee: Fee paid to protocol in quote tokens.",
            type: "string",
          },
          {
            copy: "user_base_token_reserves: User's base token balance before/after.",
            type: "string",
          },
          {
            copy: "user_quote_token_reserves: User's quote token balance before/after.",
            type: "string",
          },
          {
            copy: "virtual_token_reserves: Pool's base token reserves after trade.",
            type: "string",
          },
          {
            copy: "virtual_sol_reserves: Pool's quote token reserves after trade.",
            type: "string",
          },
          {
            copy: "sol_spent: SOL spent in Buy. (only for Buy)",
            type: "string",
          },
          {
            copy: "sol_buy: Alias for sol_spent. (only for Buy)",
            type: "string",
          },
          {
            copy: "sol_received: SOL received in Sell. (only for Sell)",
            type: "string",
          },
          {
            copy: "tokens_received: Tokens received (Buy) or sold (Sell).",
            type: "string",
          },
          {
            copy: "tokens_sold: Tokens sold in Sell. (only for Sell)",
            type: "string",
          },
          {
            copy: "pool: Public key of the pool.",
            type: "string",
          },
          {
            copy: "user: Public key of the user (KOL) who made the trade.",
            type: "string",
          },
          {
            copy: "user_base_token_account: User's base token account address.",
            type: "string",
          },
          {
            copy: "user_quote_token_account: User's quote token account address.",
            type: "string",
          },
          {
            copy: "protocol_fee_recipient: Address receiving protocol fee.",
            type: "string",
          },
          {
            copy: "protocol_fee_recipient_token_account: Token account for protocol fee.",
            type: "string",
          },
        ],
      },
    },
  ],
};
