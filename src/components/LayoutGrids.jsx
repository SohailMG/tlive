import React from "react";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import { BsGrid3X2Gap } from "react-icons/bs";

export const LayoutGrids = ({ selectedLayout, setSelectedLayout }) => {
  const grids = [
    { num: 1, Icon: CiGrid2H, size: 20 },
    { num: 2, Icon: CiGrid41, size: 20 },
    { num: 3, Icon: BsGrid3X2Gap, size: 24 },
  ];
  return (
    <div className="flex items-center ml-6">
      {grids.map(({ Icon, num, size }) => (
        <div
          key={num}
          onClick={() => setSelectedLayout(num)}
          className="p-1 cursor-pointer"
        >
          <Icon
            className={`${
              selectedLayout === num ? "bg-[#215DB0] rounded" : ""
            }`}
            size={size}
            color={selectedLayout === num ? "white" : "darkGray"}
            key={num}
          />
        </div>
      ))}
    </div>
  );
};
