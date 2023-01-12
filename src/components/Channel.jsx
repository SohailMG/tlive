import React, { useContext, useState } from "react";
import { IoRemoveOutline } from "react-icons/io5";
import { IoIosRemoveCircle } from "react-icons/io";
import { MdSlowMotionVideo } from "react-icons/md";
import { GoPrimitiveDot } from "react-icons/go";
import { TiMediaRecord } from "react-icons/ti";
import { FaPhotoVideo } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import { auth, removeChannelFromDb } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { daysFrom, readableFormat } from "./VodsTab";
function Channel({ channel, hideCheckBox }) {
  const [isHovered, setIsHovered] = useState(false);
  const {
    updateSelectedTab,
    updateSelectedUuid,
    updateRemoveBatch,
    removeBatch,
  } = useContext(AppContext);
  const [user] = useAuthState(auth);

  function truncateString(str) {
    if (str.length > 20) {
      return str.slice(0, 17) + "...";
    }
    return str;
  }

  function handleChange(e) {
    updateRemoveBatch({
      action: e === true ? "remove" : "discard",
      value: {
        channelName: channel.display_name.toLowerCase(),
        channelId: channel.id,
      },
    });
  }

  return (
    <div className="flex items-center">
      {!hideCheckBox && <Checkbox onChange={handleChange} />}
      <div
        style={
          channel.is_live
            ? { backgroundColor: "indigo" }
            : { opacity: "50%", backgroundColor: "indigo" }
        }
        className="m-2 p-2  rounded-md flex items-center space-x-2  hover:opacity-100 w-full"
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
                window.open(
                  `https://www.twitch.tv/${channel.display_name}/about`
                )
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
                <p className="text-gray-400 text-[10px] ml-2">
                  {daysFrom(channel.started_at, "hh:mm:ss")}
                </p>
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
              {truncateString(channel.game_name)}
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
                removeChannelFromDb(user.uid, {
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
    </div>
  );
}

export default Channel;

const Checkbox = ({ label, onChange }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    onChange(event.target.checked);
  };

  return (
    <label className="outline-none">
      <input
        className="outline-none"
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
      />
      {label}
    </label>
  );
};
