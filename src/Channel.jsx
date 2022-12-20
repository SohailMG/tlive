import React from "react";
import { useLocalStorageArray } from "./hooks/useLocalStorageArray";

function Channel({ channel }) {
  const [value, addItem, removeItem] = useLocalStorageArray("saved_channels");
  return (
    <div
      onClick={() =>
        window.open(
          `chrome-extension://bhplkbgoehhhddaoolmakpocnenplmhf/player.html?channel=${channel.display_name.toLowerCase()}`,
          "_blank"
        )
      }
      className={`${
        !channel.is_live && "opacity-60 "
      } flex flex-row items-center relative space-x-2 bg-gray-600 p-2 rounded-xl cursor-pointer hover:shadow-xl transition-all duration-200 ease-in-ou`}
      style={{ height: "fit-content" }}
      title={channel.title}
    >
      <img src={channel.thumbnail_url} className="w-10 h-10 rounded-full" />
      <div className="flex flex-col space-y-[1px]">
        <p className="text-xs text-left text-white">{channel.display_name}</p>
        <small className="text-green-200 text-xs">{channel.game_name}</small>
        <div
          className={`${
            !channel.is_live ? "text-gray-400" : "text-red-500"
          } text-xs font-bold`}
        >
          <span
            className={`${
              !channel.is_live ? "bg-gray-400" : "bg-red-500"
            } w-2 inline-flex h-2 mr-1 animate-pulse rounded-full`}
          ></span>
          {channel?.viewer_count ?? "offline"}
        </div>
      </div>
      <span
        onClick={() => removeItem(channel.display_name.toLowerCase())}
        className="text-[10px] absolute right-2 text-green-500 drop-shadow-md flex items-center justify-center rounded-full"
      >
        ❌
      </span>
    </div>
  );
}

export default Channel;
