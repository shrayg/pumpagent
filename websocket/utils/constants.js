import {
  struct,
  publicKey,
  i64,
  u8,
  u16,
  str,
  u64,
  bool,
} from "@coral-xyz/borsh";

const CompleteEventLayout = struct([
  publicKey("user"),
  publicKey("mint"),
  publicKey("bonding_curve"),
  i64("timestamp"),
]);

const CreateEventLayout = struct([
  str("name"),
  str("symbol"),
  str("uri"),
  publicKey("mint"),
  publicKey("bonding_curve"),
  publicKey("user"),
  publicKey("creator"),
  i64("timestamp"),
  u64("virtual_token_reserves"),
  u64("virtual_sol_reserves"),
  u64("real_token_reserves"),
  u64("token_total_supply"),
]);

// Layout for TradeEvent
const TradeEventLayout = struct([
  publicKey("mint"),
  u64("sol_amount"),
  u64("token_amount"),
  bool("is_buy"),
  publicKey("user"),
  i64("timestamp"),
  u64("virtual_sol_reserves"),
  u64("virtual_token_reserves"),
  u64("real_sol_reserves"),
  u64("real_token_reserves"),
  publicKey("fee_recipient"),
  u64("fee_basis_points"),
  u64("fee"),
  publicKey("creator"),
  u64("creator_fee_basis_points"),
  u64("creator_fee"),
]);

const CreatePoolEventLayout = struct([
  i64("timestamp"),
  u16("index"),
  publicKey("creator"),
  publicKey("base_mint"),
  publicKey("quote_mint"),
  u8("base_mint_decimals"),
  u8("quote_mint_decimals"),
  u64("base_amount_in"),
  u64("quote_amount_in"),
  u64("pool_base_amount"),
  u64("pool_quote_amount"),
  u64("minimum_liquidity"),
  u64("initial_liquidity"),
  u64("lp_token_amount_out"),
  u8("pool_bump"),
  publicKey("pool"),
  publicKey("lp_mint"),
  publicKey("user_base_token_account"),
  publicKey("user_quote_token_account"),
]);

const BuyEventLayout = struct([
  i64("timestamp"),
  u64("base_amount_out"),
  u64("max_quote_amount_in"),
  u64("user_base_token_reserves"),
  u64("user_quote_token_reserves"),
  u64("pool_base_token_reserves"),
  u64("pool_quote_token_reserves"),
  u64("quote_amount_in"),
  u64("lp_fee_basis_points"),
  u64("lp_fee"),
  u64("protocol_fee_basis_points"),
  u64("protocol_fee"),
  u64("quote_amount_in_with_lp_fee"),
  u64("user_quote_amount_in"),
  publicKey("pool"),
  publicKey("user"),
  publicKey("user_base_token_account"),
  publicKey("user_quote_token_account"),
  publicKey("protocol_fee_recipient"),
  publicKey("protocol_fee_recipient_token_account"),
]);

const SellEventLayout = struct([
  i64("timestamp"),
  u64("base_amount_in"),
  u64("min_quote_amount_out"),
  u64("user_base_token_reserves"),
  u64("user_quote_token_reserves"),
  u64("pool_base_token_reserves"),
  u64("pool_quote_token_reserves"),
  u64("quote_amount_out"),
  u64("lp_fee_basis_points"),
  u64("lp_fee"),
  u64("protocol_fee_basis_points"),
  u64("protocol_fee"),
  u64("quote_amount_out_without_lp_fee"),
  u64("user_quote_amount_out"),
  publicKey("pool"),
  publicKey("user"),
  publicKey("user_base_token_account"),
  publicKey("user_quote_token_account"),
  publicKey("protocol_fee_recipient"),
  publicKey("protocol_fee_recipient_token_account"),
]);

const pumpEvents = [
  {
    name: "CompleteEvent",
    discriminator: [95, 114, 97, 156, 212, 46, 152, 8],
  },
  {
    name: "CreateEvent",
    discriminator: [27, 114, 169, 77, 222, 235, 99, 118],
  },
  {
    name: "TradeEvent",
    discriminator: [189, 219, 127, 211, 78, 230, 97, 238],
  },
];

const pumpSwapEvents = [
  {
    name: "CreatePoolEvent",
    discriminator: [177, 49, 12, 210, 160, 118, 167, 116],
  },
  {
    name: "BuyEvent",
    discriminator: [103, 244, 82, 31, 44, 245, 119, 119],
  },
  { name: "SellEvent", discriminator: [62, 47, 55, 10, 165, 3, 220, 42] },
];

const pumpLogsMsg = {
  jsonrpc: "2.0",
  id: 1,
  method: "logsSubscribe",
  params: [
    {
      mentions: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
    },
    {
      commitment: "confirmed",
    },
  ],
};

const pumpSwapLogsMsg = {
  jsonrpc: "2.0",
  id: 1,
  method: "logsSubscribe",
  params: [
    {
      mentions: ["pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA"],
    },
    {
      commitment: "confirmed",
    },
  ],
};

export {
  CompleteEventLayout,
  CreateEventLayout,
  TradeEventLayout,
  pumpEvents,
  pumpLogsMsg,
  pumpSwapLogsMsg,
  pumpSwapEvents,
  CreatePoolEventLayout,
  BuyEventLayout,
  SellEventLayout,
};
