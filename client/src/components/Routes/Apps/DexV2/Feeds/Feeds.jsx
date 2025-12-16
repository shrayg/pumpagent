import NewCreationsFeed from "./NewCreationsFeed";
import NewPoolsFeed from "./NewPoolsFeed";
import KOLTradesFeed from "./KOLTradesFeed";

const Feeds = ({
  newTokenMints,
  trackedHolders,
  solPrice,
  newPools,
  apiKey,
  kolTrades,
  trackedPoolTrades,
  migratedMints,
  setCurrentTrade,
}) => {
  return (
    <div className="w-[500px] border-r border-gray-900 flex">
      <NewCreationsFeed
        newTokenMints={newTokenMints}
        trackedHolders={trackedHolders}
        solPrice={solPrice}
        setCurrentTrade={setCurrentTrade}
      />
      <NewPoolsFeed
        solPrice={solPrice}
        newPools={newPools}
        apiKey={apiKey}
        trackedPoolTrades={trackedPoolTrades}
        migratedMints={migratedMints}
        setCurrentTrade={setCurrentTrade}
      />
      <KOLTradesFeed
        trackedHolders={trackedHolders}
        solPrice={solPrice}
        kolTrades={kolTrades}
        setCurrentTrade={setCurrentTrade}
      />
    </div>
  );
};

export default Feeds;
