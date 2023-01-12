import React from "react";
import { BiGridHorizontal, BiGridSmall } from "react-icons/bi";

export const LayoutGrids = ({ selectedLayout, setSelectedLayout }) => {
  const grids = [
    { num: 2, Icon: BiGridSmall },
    { num: 3, Icon: BiGridHorizontal },
  ];
  return (
    <div className="flex items-center ml-6">
      {grids.map(({ Icon, num }) => (
        <div
          key={num}
          onClick={() => setSelectedLayout(num)}
          className="p-1 cursor-pointer"
        >
          <Icon
            size={24}
            color={selectedLayout === num ? "white" : "darkGray"}
            key={num}
          />
        </div>
      ))}
    </div>
  );
};
