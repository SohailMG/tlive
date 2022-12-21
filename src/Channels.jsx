import React from "react";
import Channel from "./Channel";
import { Button, Spinner } from "@blueprintjs/core";
const Channels = ({ channels }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {" "}
      {channels.map((channel, i) => (
        <Channel key={i} channel={channel} />
      ))}
    </div>
  );
};

export default Channels;
