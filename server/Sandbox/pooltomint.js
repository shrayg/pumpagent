import { getMintAddressesFromPool } from "../../client/src/utils/functions.js";
import { getMintFromPool } from "../utils/helpers.js";

const pool = "FJGvXzfwuJzHcGNfMFknmZ5M3QTsLBAabc7gJ6Gv28VE";

const result = await getMintAddressesFromPool(pool);
// const result = await getMintFromPool(pool);
console.log("Pool-> Mint Result: ", result);
