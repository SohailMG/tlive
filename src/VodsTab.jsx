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
        const data = await twitchApi.getVods(String(selectedUuid));
        console.log(data);
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
    <div className="p-4 grid grid-cols-2 gap-4 m-2 overflow-hidden">
      {vods.length > 0 &&
        vods.map((vod) => (
          <div
            onClick={() =>
              window.open(
                `https://sohailmg.github.io/tlive/player.html?id=${vod.id}`,
                "_blank"
              )
            }
            key={vod.id}
            className="flex space-x-2 hover:bg-gray-600 cursor-pointer p-2 transition-all transform duration-150 ease-in-out"
          >
            <img
              src={vod.thumbnail_url.replace("-%{width}x%{height}", "-500x300")}
              className="w-[150px]"
              onError={(e) => (e.target.src = fallBackImg)}
              alt=""
            />
            <div className="text-white text-sm ">
              <h3 className="line-clamp-1 text-[12px]">{vod.title}</h3>
              <p className="text-[12px] text-gray-400">{vod.duration}</p>
              <p className="text-[12px] text-green-400">
                {daysFrom(vod.created_at)}
              </p>
              <small className="text-red-600 font-semibold ">
                {readableFormat(Number(vod.view_count))} views
              </small>
            </div>
          </div>
        ))}
    </div>
  );
}

export default VodsTab;

function daysFrom(str) {
  const date = new Date(str);
  // Get the current date
  const currentDate = new Date();

  // Calculate the difference between the two dates in milliseconds
  const diff = currentDate - date;

  // Convert the difference to days by dividing it by the number of milliseconds in a day
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function readableFormat(number) {
  if (number >= 1000) {
    // Divide the number by 1000 and add a "k" suffix
    return (number / 1000).toFixed(1) + "k";
  } else {
    // Return the number as is
    return number;
  }
}
const fallBackImg =
  "https://imgs.search.brave.com/CYnhSvdQcm9aZe3wG84YY0B19zT2wlAuAkiAGu0mcLc/rs:fit:640:400:1/g:ce/aHR0cDovL3d3dy5m/cmVtb250Z3VyZHdh/cmEub3JnL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIwLzA2L25v/LWltYWdlLWljb24t/Mi5wbmc";
