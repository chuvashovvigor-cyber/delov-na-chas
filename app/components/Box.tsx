// components/Box.tsx
import React from "react";

const Box = (): JSX.Element => {
  return (
    <img
      src="/landing.svg" // <-- тут имя файла из public (может быть другое)
      alt="Delov-na-chas экран"
      className="block w-full max-w-[390px] h-auto mx-auto rounded-3xl shadow-2xl"
    />
  );
};

export default Box;
