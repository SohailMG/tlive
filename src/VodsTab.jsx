import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import { TwitchAPI } from "./TwitchApi";
const twitchApi = new TwitchAPI();
function VodsTab() {
  const { selectedUuid } = useContext(AppContext);
  const [vods, setVods] = useState([]);

  useEffect(() => {
    if (selectedUuid) {
      console.log("fetching vods...");
      (async () => {
        const data = await twitchApi.getVods(selectedUuid);
        setVods(data.data);
      })();
    }
  }, []);

  if (!selectedUuid)
    return (
      <div className="flex items-center justify-center text-white font-semibold">
        Nothing to show
      </div>
    );

  const formatImageStr = (url) => {
    console.log(url);
    return url;
  };
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {vods.length > 0 &&
        vods.map((vod) => (
          <div key={vod.id} className="flex space-x-2">
            <img
              src={vod.thumbnail_url.replace("-%{width}x%{height}", "-500x300")}
              className="w-[150px]"
              alt=""
            />
            <div className="text-white text-[10px]">
              <h3 className="whitespace-nowrap overflow-hidden">
                {vod.title.length > 50 ? vod.title.slice(0, 50) : vod.title}
              </h3>
              <p>{vod.duration}</p>
              <p>{vod.created_at}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default VodsTab;
