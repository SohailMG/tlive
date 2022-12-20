import React from "react";
import Channel from "./Channel";
const Channels = ({ channels }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {" "}
      {channels.map((channel) => (
        <Channel key={channel.id} channel={channel} />
      ))}
    </div>
  );
};

export default Channels;
