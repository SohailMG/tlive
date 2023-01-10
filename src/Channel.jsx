import React, { useContext, useState } from "react";
import { IoRemoveOutline } from "react-icons/io5";
import { IoIosRemoveCircle } from "react-icons/io";
import { MdSlowMotionVideo } from "react-icons/md";
import { GoPrimitiveDot } from "react-icons/go";
import { TiMediaRecord } from "react-icons/ti";
import { FaPhotoVideo } from "react-icons/fa";
import { AppContext } from "./context/AppContext";
import { auth, removeChannelsFromDb } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { readableFormat } from "./VodsTab";
function Channel({ channel }) {
  const [isHovered, setIsHovered] = useState(false);
  const { updateSelectedTab, updateSelectedUuid } = useContext(AppContext);
  const [user] = useAuthState(auth);

  return (
    <div
      className="m-2 p-2 bg-gray-600 rounded-md flex items-center space-x-2"
      title={channel.title}
    >
      <img
        onClick={() =>
          window.open(
            `chrome-extension://bhplkbgoehhhddaoolmakpocnenplmhf/player.html?channel=${channel.display_name.toLowerCase()}`,
            "_blank"
          )
        }
        className={`${
          channel.is_live && "animate-pulse "
        } w-8 h-8 rounded-full border-2 border-solid hover:scale-110 hover:rotate-45 cursor-pointer transform duration-300 ease-in-out ${
          channel.is_live ? "border-red-500" : "border-gray-500"
        }`}
        src={channel.thumbnail_url}
        alt=""
      />
      <div>
        <div className="text-white font-semibold text-[12px] flex items-center">
          <h1
            className="hover:underline cursor-pointer"
            onClick={() =>
              window.open(`https://www.twitch.tv/${channel.display_name}/about`)
            }
          >
            {channel.display_name}{" "}
          </h1>
          {channel.is_live ? (
            <div className="flex items-center  ">
              <GoPrimitiveDot
                size={15}
                className="text-red-500 animate-pulse"
              />
              <b className="text-red-500 font-bold">
                {readableFormat(channel.viewer_count)}
              </b>{" "}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex items-center justify-center space-x-2">
          <small
            onClick={() =>
              window.open(
                `https://www.twitch.tv/directory/game/${encodeURIComponent(
                  channel.game_name
                )}`
              )
            }
            className="text-gray-400 text-[10px] cursor-pointer hover:underline hover:text-green-200 "
          >
            {channel.game_name}
          </small>
          <small
            onClick={() => {
              updateSelectedTab("vods");
              updateSelectedUuid(channel.id);
            }}
            className="text-gray-400 text-[10px] cursor-pointer hover:underline hover:text-green-200 "
          >
            | Vods
          </small>
          <small
            onClick={() =>
              removeChannelsFromDb(user.uid, {
                channelName: channel.display_name.toLowerCase(),
                channelId: channel.id,
              })
            }
            className=" text-[10px] cursor-pointer hover:underline text-red-500 "
          >
            | Remove
          </small>
        </div>
      </div>
    </div>
  );
}

export default Channel;
