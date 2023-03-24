import React from "react";

export default function Header(props) {
  return (
    <div className="p-5 bg-blue-500 text-white text-3xl font-bold">
      Hello {props.name || ""}
    </div>
  );
}