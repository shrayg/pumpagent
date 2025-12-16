import { PublicKey } from "@solana/web3.js";

const tradeEventPayloadBuilder = (trade) => {
  const type = trade.is_buy ? "Buy" : "Sell";

  const payload = {
    mint: new PublicKey(trade.mint).toBase58(),
    type,

    timestamp: trade.timestamp.toNumber(),
    sol_in_bondingcurve: Number((trade.real_sol_reserves / 1e9).toFixed(2)),
    recipient: new PublicKey(trade.user).toBase58(),
    real_sol_reserves: trade.real_sol_reserves.toNumber(),
    virtual_sol_reserves: trade.virtual_sol_reserves.toNumber(),
    virtual_token_reserves: trade.virtual_token_reserves.toNumber(),
    real_token_reserves: trade.real_token_reserves.toNumber(),
  };

  const parsedSol = Number(trade.sol_amount);
  const parsedTokens = Number(trade.token_amount);

  if (type === "Buy") {
    payload.sol_buy = parsedSol;
    payload.tokens_received = parsedTokens;
  } else {
    payload.sol_received = parsedSol;
    payload.tokens_sold = parsedTokens;
  }

  return payload;
};

const completeEventPayloadBuildler = (complete) => ({
  creator: new PublicKey(complete.user).toBase58(),
  mint: new PublicKey(complete.mint).toBase58(),
  timestamp: complete.timestamp.toNumber(),
});

const createEventPayloadBuilder = (create) => ({
  name: create.name,
  symbol: create.symbol,
  uri: create.uri,
  mint: new PublicKey(create.mint).toBase58(),
  creator: new PublicKey(create.creator).toBase58(),
  timestamp: create.timestamp.toNumber(),
});

// PumpSwap
const createPoolEventPayloadBuilder = (create) => ({
  timestamp: create.timestamp.toNumber(),
  index: create.index,
  creator: new PublicKey(create.creator).toBase58(),
  base_mint: new PublicKey(create.base_mint).toBase58(),
  quote_mint: new PublicKey(create.quote_mint).toBase58(),
  base_mint_decimals: create.base_mint_decimals,
  quote_mint_decimals: create.quote_mint_decimals,
  base_amount_in: create.base_amount_in.toString(),
  quote_amount_in: create.quote_amount_in.toString(),
  pool_base_amount: create.pool_base_amount.toString(),
  pool_quote_amount: create.pool_quote_amount.toString(),
  minimum_liquidity: create.minimum_liquidity.toString(),
  initial_liquidity: create.initial_liquidity.toString(),
  lp_token_amount_out: create.lp_token_amount_out.toString(),
  pool_bump: create.pool_bump,
  pool: new PublicKey(create.pool).toBase58(),
  lp_mint: new PublicKey(create.lp_mint).toBase58(),
  user_base_token_account: new PublicKey(
    create.user_base_token_account
  ).toBase58(),
  user_quote_token_account: new PublicKey(
    create.user_quote_token_account
  ).toBase58(),
});

const buyEventPayloadBuilder = (buy) => {
  const toStr = (v) => v.toString();
  const toBase58 = (v) => new PublicKey(v).toBase58();

  return {
    timestamp: toStr(buy.timestamp),
    base_amount_out: toStr(buy.base_amount_out),
    max_quote_amount_in: toStr(buy.max_quote_amount_in),
    user_base_token_reserves: toStr(buy.user_base_token_reserves),
    user_quote_token_reserves: toStr(buy.user_quote_token_reserves),
    pool_base_token_reserves: toStr(buy.pool_base_token_reserves),
    pool_quote_token_reserves: toStr(buy.pool_quote_token_reserves),
    quote_amount_in: toStr(buy.quote_amount_in),
    lp_fee_basis_points: toStr(buy.lp_fee_basis_points),
    lp_fee: toStr(buy.lp_fee),
    protocol_fee_basis_points: toStr(buy.protocol_fee_basis_points),
    protocol_fee: toStr(buy.protocol_fee),
    quote_amount_in_with_lp_fee: toStr(buy.quote_amount_in_with_lp_fee),
    user_quote_amount_in: toStr(buy.user_quote_amount_in),
    pool: toBase58(buy.pool),
    user: toBase58(buy.user),
    user_base_token_account: toBase58(buy.user_base_token_account),
    user_quote_token_account: toBase58(buy.user_quote_token_account),
    protocol_fee_recipient: toBase58(buy.protocol_fee_recipient),
    protocol_fee_recipient_token_account: toBase58(
      buy.protocol_fee_recipient_token_account
    ),
    type: "Buy",
  };
};

const sellEventPayloadBuilder = (sell) => {
  const toStr = (v) => v.toString();
  const toBase58 = (v) => new PublicKey(v).toBase58();

  return {
    timestamp: toStr(sell.timestamp),
    base_amount_in: toStr(sell.base_amount_in),
    min_quote_amount_out: toStr(sell.min_quote_amount_out),
    user_base_token_reserves: toStr(sell.user_base_token_reserves),
    user_quote_token_reserves: toStr(sell.user_quote_token_reserves),
    pool_base_token_reserves: toStr(sell.pool_base_token_reserves),
    pool_quote_token_reserves: toStr(sell.pool_quote_token_reserves),
    quote_amount_out: toStr(sell.quote_amount_out),
    lp_fee_basis_points: toStr(sell.lp_fee_basis_points),
    lp_fee: toStr(sell.lp_fee),
    protocol_fee_basis_points: toStr(sell.protocol_fee_basis_points),
    protocol_fee: toStr(sell.protocol_fee),
    quote_amount_out_without_lp_fee: toStr(
      sell.quote_amount_out_without_lp_fee
    ),
    user_quote_amount_out: toStr(sell.user_quote_amount_out),
    pool: toBase58(sell.pool),
    user: toBase58(sell.user),
    user_base_token_account: toBase58(sell.user_base_token_account),
    user_quote_token_account: toBase58(sell.user_quote_token_account),
    protocol_fee_recipient: toBase58(sell.protocol_fee_recipient),
    protocol_fee_recipient_token_account: toBase58(
      sell.protocol_fee_recipient_token_account
    ),
    type: "Sell",
  };
};

const safeParseArray = (input) => {
  if (Array.isArray(input)) return input;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const kolPumpSwapTradeMessageBuilder = (kol, payload) => {
  const data = { ...payload };
  data.kol = kol.name;
  data.kol_twitter = kol.twitter;

  data.message = `${kol.name} ${payload.type === "Buy" ? "bought" : "sold"} ${
    payload.type === "Buy"
      ? `${payload.base_amount_out / 1e6} tokens for ${
          payload.quote_amount_in / 1e9
        } SOL`
      : `${payload.base_amount_in / 1e6} tokens for ${
          payload.quote_amount_out / 1e9
        } SOL`
  }`;
  data.pool = payload.pool;
  data.virtual_token_reserves = payload.pool_base_token_reserves;
  data.virtual_sol_reserves = payload.pool_quote_token_reserves;
  if (payload.type === "Buy") {
    data.sol_spent = payload.quote_amount_in;
    data.sol_buy = payload.quote_amount_in;
    data.tokens_received = payload.base_amount_out;
  } else {
    data.sol_received = payload.quote_amount_out;
    data.tokens_sold = payload.base_amount_in;
    data.tokens_received = payload.base_amount_in;
  }
  return data;
};

export {
  tradeEventPayloadBuilder,
  completeEventPayloadBuildler,
  createEventPayloadBuilder,
  safeParseArray,
  buyEventPayloadBuilder,
  sellEventPayloadBuilder,
  createPoolEventPayloadBuilder,
  kolPumpSwapTradeMessageBuilder,
};
