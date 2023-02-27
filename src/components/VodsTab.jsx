import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { TwitchAPI } from '../TwitchApi';

const twitchApi = new TwitchAPI();
function VodsTab() {
  const { selectedUuid } = useContext(AppContext);
  const [vods, setVods] = useState();
  const [pagination, setPagination] = useState(false);

  useEffect(() => {
    if (selectedUuid) {
      console.log('fetching vods...');
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
      {vods && vods && <Pagination pagination={vods.pagination} setPagination={setPagination} />}
      <div className="grid grid-cols-3 gap-2">
        {vods &&
          vods.data.map((vod, index) => (
            <div
              key={index}
              onClick={() =>
                window.open(`https://sohailmg.github.io/tlive/player.html?id=${vod.id}`, '_blank')
              }
              title={vod.title}
              className="w-[250px] cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out"
            >
              <img
                src={vod.thumbnail_url.replace('-%{width}x%{height}', '-500x300')}
                className="w-[250px] h-[150px] rounded"
                onError={(e) => (e.target.src = fallBackImg)}
                alt=""
              />
              <div className="p-2 text-red-500 rounded" style={{ background: 'indigo' }}>
                <h3>{daysFrom(vod.created_at)} ago</h3>
                <p className="text-white">{readableFormat(Number(vod.view_count)) + ' views'}</p>
                <p className="text-gray-400 text-[10px]">{vod.duration}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default VodsTab;

export function daysFrom(date, format = 'default') {
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (format === 'hh:mm:ss') {
    let hour = Math.floor(seconds / 3600);
    let minute = Math.floor((seconds % 3600) / 60);
    let second = seconds % 60;

    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
      .toString()
      .padStart(2, '0')}`;
  } else {
    let interval, result;
    for (const key in intervals) {
      interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        result = `${interval} ${key}${interval > 1 ? 's' : ''}`;
        break;
      }
    }
    return result;
  }
}

export function readableFormat(number) {
  if (number >= 1000) {
    // Divide the number by 1000 and add a "k" suffix
    return (number / 1000).toFixed(1) + 'k';
  } else {
    // Return the number as is
    return number;
  }
}
const fallBackImg = 'https://vod-secure.twitch.tv/_404/404_processing_320x180.png';

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
