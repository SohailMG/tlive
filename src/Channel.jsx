import React, { useContext, useState } from "react";
import { IoRemoveOutline } from "react-icons/io5";
import { IoIosRemoveCircle } from "react-icons/io";
import { MdSlowMotionVideo } from "react-icons/md";
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
    <tr className="text-center">
      <td
        onClick={() =>
          window.open(`https://www.twitch.tv/${channel.display_name}/about`)
        }
        className="hover:scale-95 cursor-pointer transition-all duration-150 ease-in-out px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm font-semibold"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <img
              className="w-full h-full rounded-full"
              src={channel.thumbnail_url}
              alt=""
            />
          </div>
          <div className="ml-3 max-w-[200px] text-left">
            <p className="text-[#9370DB] whitespace-no-wrap font-bold">
              {channel.display_name} <br />{" "}
              <small className="font-light text-gray-300">
                {channel.title}
              </small>
            </p>
          </div>
        </div>
      </td>
      <td
        onClick={() =>
          window.open(
            `https://www.twitch.tv/directory/game/${encodeURIComponent(
              channel.game_name
            )}`
          )
        }
        className="hover:scale-95 cursor-pointer transition-all duration-150 ease-in-out px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm"
      >
        <p className="text-[#9370DB] whitespace-no-wrap font-bold">
          {channel.game_name}
        </p>
      </td>
      <td
        onClick={() =>
          window.open(
            `chrome-extension://bhplkbgoehhhddaoolmakpocnenplmhf/player.html?channel=${channel.display_name.toLowerCase()}`,
            "_blank"
          )
        }
        className="hover:scale-95 cursor-pointer transition-all duration-150 ease-in-out px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm cursor-pointer"
      >
        <span
          className={`relative inline-block px-3 py-1 font-semibold ${
            !channel.is_live ? "text-gray-500" : "text-gray-300"
          }  leading-tight`}
        >
          <span
            aria-hidden
            className={`absolute inset-0 ${
              channel.is_live ? "bg-red-900" : "bg-gray-200"
            } opacity-50 rounded-full`}
          ></span>
          <span className="relative cursor-pointer animate-pulse">
            <span
              className={`${
                !channel.is_live ? "hidden " : "bg-red-500"
              } w-2 inline-flex h-2 mr-1 animate-pulse rounded-full`}
            ></span>
            {channel.is_live ? readableFormat(channel.viewer_count) : "Offline"}
          </span>
        </span>
      </td>
      <td
        onClick={() => {
          updateSelectedTab("vods");
          updateSelectedUuid(channel.id);
        }}
        className="hover:scale-95 cursor-pointer transition-all duration-150 ease-in-out px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm cursor-pointer"
      >
        <span className=" p-1  text-center flex flex-col text-[10px] items-center">
          <FaPhotoVideo size={20} color="skyblue" />
        </span>
      </td>
      <td
        onClick={() =>
          removeChannelsFromDb(user.uid, {
            channelName: channel.display_name.toLowerCase(),
            channelId: channel.id,
          })
        }
        className="hover:scale-95 cursor-pointer transition-all duration-150 ease-in-out px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm cursor-pointer"
      >
        <span className="flex items-center justify-center">
          <IoIosRemoveCircle size={20} color="red" />
        </span>
      </td>
    </tr>
  );
}

export default Channel;
