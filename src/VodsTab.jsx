import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import { TwitchAPI } from "./TwitchApi";

const twitchApi = new TwitchAPI();
function VodsTab() {
  const { selectedUuid } = useContext(AppContext);
  const [vods, setVods] = useState();
  const [pagination, setPagination] = useState(false);

  useEffect(() => {
    if (selectedUuid) {
      console.log("fetching vods...");
      (async () => {
        const data = await twitchApi.getVods(String(selectedUuid), pagination);
        console.log(data);
        setVods(data);
      })();
    }
  }, [pagination]);

  if (!selectedUuid)
    return (
      <div className="flex items-center justify-center text-white font-semibold">
        Nothing to show
      </div>
    );

  return (
    <div>
      {vods && vods && (
        <Pagination
          pagination={vods.pagination}
          setPagination={setPagination}
        />
      )}
      <div className="grid grid-cols-3 gap-2">
        {vods &&
          vods.data.map((vod, index) => (
            <div
              key={index}
              onClick={() =>
                window.open(
                  `https://sohailmg.github.io/tlive/player.html?id=${vod.id}`,
                  "_blank"
                )
              }
              title={vod.title}
              className="w-[250px] cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
            >
              <img
                src={vod.thumbnail_url.replace(
                  "-%{width}x%{height}",
                  "-500x300"
                )}
                className="w-[250px] h-[150px] rounded"
                onError={(e) => (e.target.src = fallBackImg)}
                alt=""
              />
              <div
                className="p-2 text-red-500 rounded"
                style={{ background: "indigo" }}
              >
                <h3>{daysFrom(vod.created_at)}</h3>
                <p className="text-white">
                  {readableFormat(Number(vod.view_count)) + " views"}
                </p>
                <p className="text-gray-400 text-[10px]">{vod.duration}</p>
              </div>
            </div>
          ))}
      </div>
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

export function readableFormat(number) {
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

function Pagination({ pagination, setPagination }) {
  const [page, setPage] = useState(0);
  return (
    <div className="flex items-center">
      <button
        disabled={page === 0}
        onClick={() => {
          setPage(page - 1);
          setPagination(`&before=${pagination.cursor}`);
        }}
        className="px-2 py-1 text-gray-600 bg-green-200"
      >
        Prev
      </button>
      <button
        onClick={() => {
          setPage(page + 1);
          setPagination(`&after=${pagination.cursor}`);
        }}
        className="px-2 py-1 text-gray-600 bg-green-200"
      >
        Next
      </button>
    </div>
  );
}
