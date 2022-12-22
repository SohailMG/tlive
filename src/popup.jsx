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
import ContentTabs from "./ContentTabs";
import FollowingTab from "./FollowingTab";
import { TwitchAPI } from "./TwitchApi";
import VodsTab from "./VodsTab";
import { Switch } from "@blueprintjs/core";

const twitchApi = new TwitchAPI();
export const _envs = {
  CLIENT_ID: "glyuelrdyfb5jf5qejh4mwsucwrqhq",
  CLIENT_SECRET: "jhoxxp7j1vkwdz7qqa0t5h5yfs20td",
  ACCESS_TOKEN: "8uhzngjj8p88lo20achk8lm6rbo4p7",
};

const UPDATE_DELAY = 30000;
const cachedList = window.localStorage.getItem("saved_channels");
if (!cachedList) localStorage.setItem("saved_channels", JSON.stringify([]));

// chrome.runtime.sendMessage({ cachedList: cachedList }, function (response) {
//   console.log(response.message);
// });

const vodId = new URLSearchParams(window.location.search).get("id");

function Popup() {
  const [selectedPage, setSelectedPage] = useState("popup");

  function renderPage(page) {
    switch (page) {
      case "popup":
        return <PopupPage />;
    }
  }

  return <AppProvider>{renderPage(selectedPage)}</AppProvider>;
}

render(<Popup />, document.getElementById("root"));

function SavedPanel({ loading, liveChannels }) {
  const [hideOffline, setHideOffline] = useState(true);
  return (
    <>
      <SearchField />
      <Switch
        className="ml-4 text-gray-200 font-semibold outline-none"
        checked={hideOffline}
        label={!hideOffline ? "Hide offline" : "Show offline"}
        onChange={() => setHideOffline(!hideOffline)}
      />
      {loading && <LoadingSpinner text={"updating..."} />}
      {liveChannels && (
        <Channels
          channels={
            hideOffline
              ? liveChannels.filter((channel) => channel.is_live)
              : liveChannels
          }
        />
      )}
    </>
  );
}

export async function getLiveChannels(channels) {
  console.log("fetching live channels");
  // const bearer = await twitchApi.getToken();
  const liveChannels = await Promise.all(
    channels.map(async (channel) => {
      const channelData = await twitchApi.isLive({ channelName: channel });
      const streamData = await twitchApi.isLive({ userId: channelData.id });
      return { channelData, streamData };
    })
  );
  return liveChannels;
}

function PopupPage() {
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
              id: ch.channelData.id,
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
    <div className="bg-gray-700 min-w-[800px] px-4 min-h-screen">
      <div className="flex items-center ">
        <ToggleButton
          pauseUpdates={pauseUpdates}
          setPauseUpdates={setPauseUpdates}
        />
        <small className="text-gray-400 m-4">
          {!pauseUpdates ? `updating in ${countdown}` : "Updates paused"}
        </small>
      </div>
      <ContentTabs
        tabs={[
          {
            id: "saved",
            title: "Saved",
            panel: <SavedPanel liveChannels={liveChannels} loading={loading} />,
          },
          {
            id: "following",
            title: "Following",
            panel: <FollowingTab />,
            disabled: true,
          },
          {
            id: "vods",
            title: "Vods",
            panel: <VodsTab />,
          },
        ]}
      />
    </div>
  );
}
