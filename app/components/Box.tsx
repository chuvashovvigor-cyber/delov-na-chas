// components/Box.tsx
import React from "react";

const Box = (): JSX.Element => {
  return (
    <img
      src="/landing.svg" // <-- здесь ТОЧНОЕ имя файла из public
      alt="Delov-na-chas мобильный экран"
      className="block w-full max-w-[390px] h-auto mx-auto"
    />
  );
};

export default Box;
