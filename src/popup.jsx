import React, { useState, useEffect, useContext } from "react";
import { render } from "react-dom";
import "./tailwind.css";
import Channels from "./Channels";
import ToggleButton from "./Toggle";
import SearchField from "./SearchField";
import { useLocalStorageArray } from "./hooks/useLocalStorageArray";
import { useInterval } from "./hooks/useInterval";
import { AppContext, AppProvider } from "./context/AppContext";
import LoadingSpinner from "./LoadingSpinner";
const UPDATE_DELAY = 30000;
const cachedList = window.localStorage.getItem("saved_channels");
if (!cachedList) localStorage.setItem("saved_channels", JSON.stringify([]));

function Popup() {
  const [liveChannels, setLiveChannels] = React.useState([]);
  const [pauseUpdates, setPauseUpdates] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [items] = useLocalStorageArray("saved_channels");
  const [countdown, resetCountdown] = useInterval(
    async () => {
      setLoading(true);
      console.log("updating channels");
      const data = await getLiveChannels(items ?? []);

      setLiveChannels(
        Array.from(
          new Set(
            data.map((ch) => ({
              ...ch.channelData,
              ...ch.streamData,
              thumbnail_url: ch.channelData.thumbnail_url,
            }))
          )
        )
      );
      setLoading(false);
    },
    UPDATE_DELAY,
    pauseUpdates,
    items
  );

  return (
    <div className="bg-gray-700 min-w-[600px] px-4 min-h-screen">
      <div className="flex items-center ">
        <ToggleButton
          pauseUpdates={pauseUpdates}
          setPauseUpdates={setPauseUpdates}
        />
        <small className="text-gray-400 m-4">
          {!pauseUpdates ? `updating in ${countdown}` : "Updates paused"}
        </small>
      </div>
      <SearchField />
      {loading && <LoadingSpinner text={"updating..."} />}
      {liveChannels && <Channels channels={liveChannels} />}
    </div>
  );
}

render(<Popup />, document.getElementById("root"));

export const _envs = {
  CLIENT_ID: "glyuelrdyfb5jf5qejh4mwsucwrqhq",
  CLIENT_SECRET: "jhoxxp7j1vkwdz7qqa0t5h5yfs20td",
};

export async function getBearerToken() {
  const response = await fetch(`https://id.twitch.tv/oauth2/token`, {
    method: "POST",
    body: new URLSearchParams({
      client_id: _envs.CLIENT_ID,
      client_secret: _envs.CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  const data = await response.json();
  return data.access_token;
}

async function getLiveChannels(channels) {
  console.log("fetching live channels");
  const bearer = await getBearerToken();
  const liveChannels = await Promise.all(
    channels.map(async (channel) => {
      const channelData = await isLive({ channelName: channel, bearer });
      const streamData = await isLive({ userId: channelData.id, bearer });
      return { channelData, streamData };
    })
  );
  return liveChannels;
}

async function isLive({ channelName, bearer, userId }) {
  const streamsEndpoint = `https://api.twitch.tv/helix/streams?user_id=${userId}`;
  const channelEndpoint = `https://api.twitch.tv/helix/search/channels?query=${channelName}`;

  const requestUrl = userId ? streamsEndpoint : channelEndpoint;
  const response = await fetch(requestUrl, {
    headers: {
      "Client-Id": _envs.CLIENT_ID,
      Authorization: "Bearer " + bearer,
    },
  });
  const data = await response.json();
  if (!channelName) return data.data[0];
  return (
    data.data.filter(
      (ch) => ch.display_name.toLowerCase() === channelName.toLowerCase()
    )[0] ?? false
  );
}
