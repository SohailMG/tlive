import React, { useContext, useState } from "react";
import { useLocalStorageArray } from "./hooks/useLocalStorageArray";
import { IoRemoveOutline } from "react-icons/io5";
import { MdSlowMotionVideo } from "react-icons/md";
import { TiMediaRecord } from "react-icons/ti";
import { AppContext } from "./context/AppContext";
function Channel({ channel }) {
  const [isHovered, setIsHovered] = useState(false);
  const [value, addItem, removeItem] = useLocalStorageArray("saved_channels");
  const { updateSelectedTab, updateSelectedUuid } = useContext(AppContext);
  return (
    <div
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${
        !channel.is_live && "opacity-30 hover:opacity-100 "
      } grid grid-cols-3  items-center relative space-x-2 bg-gray-600 p-2 rounded-xl cursor-pointer hover:shadow-xl transition-all duration-200 ease-in-ou`}
      style={{ height: "fit-content" }}
      title={channel.title}
    >
      <div className="flex items-center space-x-2 col-span-2">
        <img
          src={channel.thumbnail_url}
          className={`w-8 h-8 rounded-full border-2 ${
            channel.is_live && "border-red-500"
          }`}
        />
        <div className="flex flex-col space-y-[1px]">
          <p className="text-[10px] text-left text-white">
            {channel.display_name}
          </p>
          <small className="text-green-200 text-[10px]">
            {channel.game_name}
          </small>
          <div
            className={`${
              !channel.is_live ? "text-gray-400" : "text-red-500"
            } text-[10px] font-bold`}
          >
            <span
              className={`${
                !channel.is_live ? "bg-gray-400" : "bg-red-500"
              } w-2 inline-flex h-2 mr-1 animate-pulse rounded-full`}
            ></span>
            {channel?.viewer_count ?? "offline"}
          </div>
        </div>
      </div>
      <div className="ml-4 grid grid-cols-1 self-start gap-2 w-12">
        <span
          onClick={() => {
            updateSelectedTab("vods");
            updateSelectedUuid(channel.id);
          }}
          className="bg-[#9ECEB4] shadow-md p-1 rounded text-center flex flex-col text-[10px] items-center"
        >
          <MdSlowMotionVideo size={15} />
        </span>
        <span
          onClick={() =>
            window.open(
              `chrome-extension://bhplkbgoehhhddaoolmakpocnenplmhf/player.html?channel=${channel.display_name.toLowerCase()}`,
              "_blank"
            )
          }
          className={`${
            channel.is_live ? "visible " : "invisible "
          }bg-[#9ECEB4] shadow-md p-1 rounded text-center flex flex-col text-[10px] items-center`}
        >
          <TiMediaRecord size={15} color="red" className="animate-pulse" />
        </span>
      </div>
      <span
        onClick={() => removeItem(channel.display_name.toLowerCase())}
        className={`${
          isHovered ? "opacity-100" : "opacity-0"
        } absolute right-0 w-5 text-green-500 bg-red-400 h-full drop-shadow-md flex items-center justify-center rounded-r-xl transition-all duration-300 ease-in-out`}
      >
        <IoRemoveOutline color="black" />
      </span>
    </div>
  );
}

export default Channel;
