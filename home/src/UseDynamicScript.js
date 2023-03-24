import React from "react";
const useDynamicScript = (args) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement("script");

    element.src = args.url;
    element.type = "text/javascript";
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic script loaded: ${args.url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic script error: ${args.url}`);
      setFailed(true);
      setReady(false);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic script removed: ${args.url}`);
      document.head.removeChild(element);
    };
  }, [args.url]);

  return { ready, failed };
};

export default useDynamicScript;
