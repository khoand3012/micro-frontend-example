import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Footer from "./Footer";
import ModuleLoader from "./ModuleLoader";

function App() {
  const [remote, setRemote] = useState(null);
  useEffect(() => {
    (async () => {
      const remoteManifest = await import(
        "./assets/remote-modules.manifest.json"
      );
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
            moduleProps={{name: "Khoa!"}}
          />
        )}
      </React.Suspense>
      <div>Page Content here!</div>
      <Footer></Footer>
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("app"));
