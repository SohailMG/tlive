import React from "react";
import Channel from "./Channel";
import { Button, Spinner } from "@blueprintjs/core";
const rows = ["Channel", "Category", "Status", "Vods", "Remove"];
const Channels = ({ channels, loading, hideCheckBox }) => {
  if (loading)
    return (
      <div className="flex items-center justify-center text-green-200">
        Geting live channels...
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
    <div className="grid grid-cols-3">
      {channels.map((channel, i) => (
        <Channel hideCheckBox={hideCheckBox} key={i} channel={channel} />
      ))}
    </div>
  );
};

export default Channels;
