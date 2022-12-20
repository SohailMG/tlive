import React, { useState } from "react";

function ToggleButton({ setPauseUpdates, pauseUpdates }) {
  const [isToggled, setIsToggled] = useState(pauseUpdates);

  const handleClick = () => {
    setPauseUpdates(!isToggled);
    setIsToggled(!isToggled);
  };

  return (
    <label className="relative inline-flex items-center w-12 h-6 px-2 rounded-full bg-gray-600 cursor-pointer">
      <input
        type="checkbox"
        className="hidden"
        checked={isToggled}
        onChange={handleClick}
      />
      <span
        className={`w-4 h-4 rounded-full shadow-inner transition duration-300 ${
          isToggled
            ? "translate-x-full bg-red-500 "
            : "translate-x-0 bg-green-500"
        }`}
      ></span>
    </label>
  );
}

export default ToggleButton;
