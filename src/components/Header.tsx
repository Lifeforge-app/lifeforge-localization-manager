import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

function Header(): React.ReactElement {
  return (
    <>
      <Icon
        icon="hugeicons:translate"
        className="text-8xl text-center mb-6 text-lime-300 mx-auto"
      />
      <h1 className="text-center text-4xl mb-4 font-medium">
        Localization Manager
      </h1>
      <p className="text-center text-lg mb-12">
        A simple tool to manage translations for the Lifeforge. project.
      </p>
    </>
  );
}

export default Header;
