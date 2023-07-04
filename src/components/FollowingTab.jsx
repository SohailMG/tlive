import React, { useState, useEffect } from "react";
import { BsTwitch } from "react-icons/bs";
import SearchField from "./SearchField";

const _userId = localStorage.getItem("userId");
console.log("userId is set", _userId);
function FollowingTab() {
  const [userId, setUserId] = useState(_userId);

  // useEffect(() => {
  //   if (userId) {
  //     (async () => {
  //       const following = await getFollowingChannels(userId);
  //     })();
  //   }
  // }, [userId]);

  return (
    <div className="flex flex-col space-y-6 items-center justify-center">
      <LinkWithTwitch />
      {/* <SearchField
        onResultsClick={(channel) => {
          localStorage.setItem("userId", channel.id);
          setUserId(channel.id);
        }}
      /> */}
      <p>{userId}</p>
    </div>
  );
}

export default FollowingTab;

function LinkWithTwitch() {
  const twitchOauth = `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=http://localhost:8080/popup.html&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls&state=c3ab8aa609ea11e793ae92361f002671`;
  return (
    <button
      onClick={() => window.open(twitchOauth)}
      className="px-4 py-2 rounded-lg bg-purple-900 text-white font-semibold text-xs shadow-md outline-none"
    >
      Connect your twitch
      <BsTwitch className="inline ml-2" />
    </button>
  );
}

async function getFollowingChannels(userId) {
  try {
    console.log("fetchning following channels...");
    const response = await fetch(
      `https://api.twitch.tv/helix/users/follows?first=100&from_id=${userId}`,
      {
        headers: {
          Authorization: "Bearer 8uhzngjj8p88lo20achk8lm6rbo4p7",
          "Client-Id": _envs.CLIENT_ID,
        },
      }
    );

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}
