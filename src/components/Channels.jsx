import React from "react";
import Channel from "./Channel";
import { Button, Spinner } from "@blueprintjs/core";
const rows = ["Channel", "Category", "Status", "Vods", "Remove"];
const Channels = ({ channels, loading, hideCheckBox, selectedLayout }) => {
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
    <div
      className={`grid grid-cols-${selectedLayout} transition-all transform duration-200 ease-in-out`}
    >
      {channels.map((channel, i) => (
        <Channel hideCheckBox={hideCheckBox} key={i} channel={channel} />
      ))}
    </div>
  );
};

export default Channels;

const Grid = ({ children, columns }) => {
  const [prevColumns, setPrevColumns] = useState(columns);

  return (
    <div
      className={`grid grid-cols-${columns} transition duration-500 ease-in-out transform`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        transition: prevColumns !== columns ? "all 0.5s ease" : "none",
      }}
      onTransitionEnd={() => setPrevColumns(columns)}
    >
      {children}
    </div>
  );
};
