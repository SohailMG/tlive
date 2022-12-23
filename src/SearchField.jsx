import React, { useContext, useEffect, useState } from "react";
import { TwitchAPI } from "./TwitchApi";
import { addToDb, auth } from "./firebase";
import { AppContext } from "./context/AppContext";
import { useAuthState } from "react-firebase-hooks/auth";

const twitchApi = new TwitchAPI();
function SearchField({ onResultsClick }) {
  const [user, loading, error] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deboune, setDeboune] = useState(1000);

  useEffect(() => {
    clearTimeout(deboune);

    // Set a new timeout to call the function after 2 seconds
    setDeboune(
      setTimeout(() => {
        // Your function goes here
        handleSubmit({ key: "Enter" });
      }, 1000)
    );
  }, [searchQuery]);

  function handleSubmit(e) {
    if (e.key === "Enter") {
      if (searchQuery.length > 0) {
        console.log(searchQuery);
        (async () => {
          console.log("fetching results...");
          const results = await twitchApi.searchChannel(searchQuery);
          setSearchResults(results.data);
        })();
      }
    }
  }
  function handleAddChannel(channel) {
    if (onResultsClick) {
      onResultsClick(channel);
      setSearchQuery("");
      setSearchResults([]);
    } else {
      addToDb(user.uid, channel.id, channel.display_name.toLowerCase());
      setSearchQuery("");
      setSearchResults([]);
    }
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative">
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSubmit}
          type="text"
          placeholder="search channel..."
          className="px-4 rounded py-1 text-left bg-gray-600 text-white"
        />
        {searchResults.length > 0 && (
          <div className="absolute w-full h-fit bg-white mt-1 px-2 z-50">
            <ul className="overflow-y-scroll max-h-40">
              {searchResults.slice(0, 10).map((channel) => (
                <li
                  key={channel.id}
                  onClick={() => handleAddChannel(channel)}
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
