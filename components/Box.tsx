import React from "react";

const Box = (): JSX.Element => {
  return (
    <div className="w-[590px] h-[980px] relative">
      <img
        className="absolute w-full h-full top-0 left-0 object-cover"
        alt="Delov-na-chas"
        src="/landing.svg" // <-- имя файла в public (например landing.svg)
      />
    </div>
  );
};

export default Box;
