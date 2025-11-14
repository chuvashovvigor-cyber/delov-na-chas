// components/Box.tsx
import React from "react";

const Box = (): JSX.Element => {
  return (
    <div className="w-[590px] h-[980px] relative">
      <img
        className="absolute w-full h-full top-0 left-0 object-cover"
        alt="Delov-na-chas"
        src="/landing.svg" // ← здесь имя файла из public
      />
    </div>
  );
};

export default Box;
