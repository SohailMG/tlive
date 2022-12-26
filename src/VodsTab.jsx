import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import { TwitchAPI } from "./TwitchApi";
import { VscLinkExternal } from "react-icons/vsc";

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

  const formatImageStr = (url) => {
    console.log(url);
    return url;
  };

  const rows = ["Thumbnail", "Title", "Date", "Views", "Time"];

  return (
    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto max-w-[800px]">
      <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
        {vods && (
          <Pagination
            pagination={vods.pagination}
            setPagination={setPagination}
          />
        )}
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {rows.map((row, i) => (
                <th
                  key={i}
                  className="px-5 py-3 border-b-2 border-gray-700 bg-gray-600 text-center text-xs font-semibold text-green-200 uppercase tracking-wider"
                >
                  {row}
                </th>
              ))}
            </tr>
          </thead>
          {vods && (
            <tbody>
              {vods.data.map((vod, index) => (
                <tr
                  key={index}
                  onClick={() =>
                    window.open(
                      `https://sohailmg.github.io/tlive/player.html?id=${vod.id}`,
                      "_blank"
                    )
                  }
                  className="text-center  cursor-pointer hover:bg-gray-900 hover:scale-95 transition-all duration-150 ease-in-out"
                >
                  <td className=" px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm font-semibold text-gray-200">
                    <img
                      src={vod.thumbnail_url.replace(
                        "-%{width}x%{height}",
                        "-500x300"
                      )}
                      className="w-[150px]"
                      onError={(e) => (e.target.src = fallBackImg)}
                      alt=""
                    />
                  </td>
                  <td className=" px-5 py-5 border-b border-gray-700 bg-gray-600 text-[12px] text-left max-w-[200px]font-semibold text-gray-200">
                    {vod.title}
                  </td>
                  <td className=" px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm font-semibold text-gray-200">
                    {daysFrom(vod.created_at)}
                  </td>
                  <td className=" px-5 py-5 border-b border-gray-700 bg-gray-600 text-[15px] font-semibold text-gray-200">
                    <small className="text-red-400 font-semibold ">
                      {readableFormat(Number(vod.view_count))}
                    </small>
                  </td>
                  <td className=" px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm font-semibold text-gray-200">
                    <p className="text-[12px] text-green-200">{vod.duration}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
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
