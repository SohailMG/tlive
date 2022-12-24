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
      <td className="hover:bg-gray-500 px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm font-semibold">
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
      <td className="hover:bg-gray-500 px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm">
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
        className="hover:bg-gray-500 px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm cursor-pointer"
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
                !channel.is_live ? "" : "bg-red-500"
              } w-2 inline-flex h-2 mr-1 animate-pulse rounded-full`}
            ></span>
            {readableFormat(channel.viewer_count) ?? "Offline"}
          </span>
        </span>
      </td>
      <td
        onClick={() => {
          updateSelectedTab("vods");
          updateSelectedUuid(channel.id);
        }}
        className="hover:bg-gray-500 px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm cursor-pointer"
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
        className="hover:bg-gray-500 px-5 py-5 border-b border-gray-700 bg-gray-600 text-sm cursor-pointer"
      >
        <span className="flex items-center justify-center">
          <IoIosRemoveCircle size={20} color="red" />
        </span>
      </td>
    </tr>
  );

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
