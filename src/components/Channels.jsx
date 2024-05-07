import React, { useState } from "react";
import Channel from "./Channel";
import { Button, Spinner } from "@blueprintjs/core";

const rows = ["Channel", "Category", "Status", "Vods", "Remove"];

const Channels = ({ channels, loading, hideCheckBox, selectedLayout }) => {
  const [searchQuery, setSearchQuery] = useState("");

  console.log(channels);
  const filteredChannels =
    !searchQuery || searchQuery.length === 0
      ? channels
      : channels?.filter((channel) => {
          return channel?.display_name
            ?.toLowerCase()
            ?.includes(searchQuery.toLowerCase());
        });

  console.log(filteredChannels);

  if (loading)
    return (
      <div className="flex items-center justify-center text-green-200">
        Getting live channels...
      </div>
    );

  if (channels.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center text-green-200">
        No live channels available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <input
        className="p-2 rounded-lg bg-transparent text-white outline-none border-b border-cyan-200"
        type="text"
        placeholder="Search channels..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div
        className={`grid ${
          selectedLayout === 2 ? "grid-cols-2" : `grid-cols-${selectedLayout}`
        }`}
      >
        {filteredChannels &&
          filteredChannels?.map((channel, i) => (
            <Channel hideCheckBox={hideCheckBox} key={i} channel={channel} />
          ))}
      </div>
    </div>
  );
};

export default Channels;
