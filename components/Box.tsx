// components/Box.tsx
import React from "react";

const Box = (): JSX.Element => {
  return (
    <img
      src="/landing.svg" // <-- здесь имя файла из public (например /2025-4-51-33-GMT-3.svg)
      alt="Delov-na-chas мобильный экран"
      className="block w-full max-w-[390px] h-auto mx-auto"
    />
  );
};

export default Box;
