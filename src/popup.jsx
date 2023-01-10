import React, { useState, useEffect, useContext } from "react";
import { render } from "react-dom";
import "./tailwind.css";
import Channels from "./Channels";
import ToggleButton from "./Toggle";
import SearchField from "./SearchField";
import { useInterval } from "./hooks/useInterval";
import { AppContext, AppProvider } from "./context/AppContext";
import LoadingSpinner from "./LoadingSpinner";
import ContentTabs from "./ContentTabs";
import FollowingTab from "./FollowingTab";
import { TwitchAPI } from "./TwitchApi";
import VodsTab from "./VodsTab";
import { Switch } from "@blueprintjs/core";
import {
  auth,
  app,
  removeChannelFromDb,
  db,
  removeChannelsFromDb,
} from "./firebase";
import { onAuthStateChanged, signInAnonymously, signOut } from "firebase/auth";
import AuthWrapper from "./AuthWrapper";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { FaUserAlt } from "react-icons/fa";

const twitchApi = new TwitchAPI();
export const _envs = {
  CLIENT_ID: "glyuelrdyfb5jf5qejh4mwsucwrqhq",
  CLIENT_SECRET: "jhoxxp7j1vkwdz7qqa0t5h5yfs20td",
  ACCESS_TOKEN: "8uhzngjj8p88lo20achk8lm6rbo4p7",
};

// chrome.runtime.sendMessage({ cachedList: cachedList }, function (response) {
//   console.log(response.message);
// });

const vodId = new URLSearchParams(window.location.search).get("id");

function Popup() {
  const [selectedPage, setSelectedPage] = useState("popup");
  const [user, setUser] = useState();

  function renderPage(page) {
    switch (page) {
      case "popup":
        return <PopupPage />;
    }
  }

  return (
    <AuthWrapper>
      <AppProvider>{renderPage(selectedPage)}</AppProvider>;
    </AuthWrapper>
  );
}

render(<Popup />, document.getElementById("root"));

function SavedPanel({ loading, liveChannels }) {
  const [hideOffline, setHideOffline] = useState(true);
  const [hideCheckBox, setHideCheckbox] = useState(true);
  const { removeBatch, updateRemoveBatch } = useContext(AppContext);
  const [user] = useAuthState(auth);

  async function handleRemove() {
    await removeChannelsFromDb(user.uid, removeBatch);
    updateRemoveBatch({ action: "clear" });
  }

  useEffect(() => {
    if (hideCheckBox === true) {
      updateRemoveBatch({ action: "clear" });
    }
  }, [hideCheckBox]);

  return (
    <>
      <SearchField />
      <div className="flex items-center space-x-2">
        <Switch
          className="ml-4 text-gray-200 font-semibold outline-none"
          checked={hideOffline}
          label={!hideOffline ? "Hide offline" : "Show offline"}
          onChange={() => setHideOffline(!hideOffline)}
        />
        <Switch
          className="ml-4 text-gray-200 font-semibold outline-none"
          checked={hideCheckBox}
          label={"Remove"}
          onChange={() => setHideCheckbox(!hideCheckBox)}
        />
      </div>
      {removeBatch.length > 0 && (
        <button
          onClick={handleRemove}
          className="bg-red-500 text-white rounded shadow px-2 py-1 m-2"
        >
          Remove selected{" "}
        </button>
      )}
      {/* {loading && <LoadingSpinner text={"updating..."} />} */}
      {liveChannels && (
        <Channels
          loading={loading}
          hideCheckBox={hideCheckBox}
          channels={
            hideOffline
              ? liveChannels
                  .filter((channel) => channel.is_live)
                  .sort((a, b) => b.viewer_count - a.viewer_count)
              : liveChannels
          }
        />
      )}
    </>
  );
}

export async function getLiveChannels(channels) {
  console.log("fetching live channels : ", channels);
  // const bearer = await twitchApi.getToken();
  const liveChannels = await Promise.all(
    channels.map(async (channel) => {
      const channelData = await twitchApi.isLive({
        channelName: channel.channelName,
      });
      const streamData = await twitchApi.isLive({ userId: channelData.id });
      return { channelData, streamData };
    })
  );
  return liveChannels;
}

function PopupPage() {
  const [liveChannels, setLiveChannels] = React.useState([]);
  const [pauseUpdates, setPauseUpdates] = React.useState(true);
  const [savedChannels, setSavedChannels] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [user] = useAuthState(auth);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // const savedChannels = await getChannelsFromDb(user.uid);
        const data = await getLiveChannels(savedChannels);
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
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, savedChannels]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "channels", user.uid), (doc) => {
      console.log("Current data: ", doc.data());
      setSavedChannels(doc.data().savedChannels);
    });

    return () => unsub();
  }, []);
  return (
    <div className="bg-[#23142F] min-w-max px-4 min-h-screen">
      <div className="flex items-center space-x-2 m-4">
        <div className="flex items-center space-x-2">
          <small className="text-gray-400">
            <b className="text-gray-200">Account: </b> {user.email}
          </small>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 text-white text-xs px-2 py-1 rounded-md"
        >
          Sign out
        </button>
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
