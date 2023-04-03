import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import "./index.scss";
import Footer from "./Footer";
import ModuleLoader from "./ModuleLoader";

export default function App() {
  const [remote, setRemote] = useState(null);
  useEffect(() => {
    (async () => {
      const remoteManifest = await fetch("/assets/remote-modules.manifest.json")
        .then((response) => response.json())
        .then((result) => result);
      const headerManifest = remoteManifest["header"];
      setRemote({
        url: headerManifest.url,
        scope: headerManifest.scope,
        module: headerManifest.module,
      });
    })();
  }, []);
  return (
    <div className="text-3xl mx-auto max-w-6xl">
      <React.Suspense fallback={<div>Loading...</div>}>
        {remote && (
          <ModuleLoader
            url={remote.url}
            scope={remote.scope}
            module={remote.module}
            moduleProps={{ name: "Khoa!" }}
          />
        )}
      </React.Suspense>
      <div>Page Content here!</div>
      <Footer></Footer>
    </div>
  );
}

render(<App />, document.getElementById("app"));
