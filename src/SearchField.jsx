import React, { useEffect, useState } from "react";
import { _envs, getBearerToken } from "./popup";
import { useLocalStorageArray } from "./hooks/useLocalStorageArray";

function SearchField() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [value, addItem, removeItem] = useLocalStorageArray("saved_channels");

  function handleSubmit(e) {
    if (e.key === "Enter") {
      if (searchQuery.length > 0) {
        console.log(searchQuery);
        (async () => {
          console.log("fetching results...");
          const results = await searchTwitchChannel(searchQuery);
          setSearchResults(results.data);
        })();
      }
    }
  }
  function handleAddChannel(channel) {
    addItem(channel);
    setSearchQuery("");
    setSearchResults([]);
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative">
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSubmit}
          type="text"
          placeholder="search channel"
          className="px-4 rounded-md bg-gray-600"
        />
        {searchResults.length > 0 && (
          <div className="absolute w-full h-fit bg-white mt-1 px-2 z-50">
            <ul className="overflow-y-scroll max-h-40">
              {searchResults.slice(0, 10).map((channel) => (
                <li
                  key={channel.id}
                  onClick={() =>
                    handleAddChannel(channel.display_name.toLowerCase())
                  }
                  className="p-1 hover:text-purple-600 cursor-pointer flex items-center space-x-2 "
                >
                  <img
                    src={channel.thumbnail_url}
                    className="w-6 h-6 rounded-full"
                    alt=""
                  />
                  <p>{channel.display_name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchField;

const searchTwitchChannel = async (query) => {
  const channelEndpoint = `https://api.twitch.tv/helix/search/channels?query=${query}`;
  const bearer = await getBearerToken();
  const response = await fetch(channelEndpoint, {
    params: {
      limit: 10,
    },
    headers: {
      "Client-Id": _envs.CLIENT_ID,
      Authorization: "Bearer " + bearer,
    },
  });

  const results = await response.json();

  return results;
};
