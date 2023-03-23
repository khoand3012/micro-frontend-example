import { setRemoteDefinitions } from "./load-remote-modules";
import("./bootstrap");

fetch("./remote-modules.manifest.json")
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import("./bootstrap").catch((err) => console.error(err)));
