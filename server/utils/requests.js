import supabase from "./supabase.js";
export const requestTracker = {
  totalRequests: 0,
};

export async function loadTotalRequests() {
  const { data } = await supabase
    .from("requesttracking")
    .select("count")
    .eq("id", "0");

  // Update server memory using DB state
  requestTracker.totalRequests = data ? data[0].count : 34013;

  // Update DB using server state every 4 hours
  setInterval(async () => {
    await supabase
      .from("requesttracking")
      .update({ count: requestTracker.totalRequests })
      .eq("id", "0");
  }, 4 * 60 * 60_000);
}
