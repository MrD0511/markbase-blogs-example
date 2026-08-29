"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";

export function CodeGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = React.Children.toArray(children);

  const getLanguage = (child: any) => {
    let className =
      child?.props?.children?.props?.className || "";

    className = className.replace("hljs", "");

    return (
      className.replace("language-", "") || "text"
    );
  };

  const [active, setActive] = useState(0);

  return (
    <div className="p-2 bg-card rounded-md border border-border my-4">
        <div className="flex gap-2 px-3 py-2 ">
            {items.map((child: any, index) => {
                const language = getLanguage(child);
                return (
                    <Button
                        key={index}
                        variant={active === index ? "default" : "outline"}
                        onClick={() => setActive(index)}
                        className="cursor-pointer"
                    >
                        {language}
                    </Button>
                );
            })}
        </div>

        <div className="">
            {items[active]}
        </div>
    </div>
  );
}