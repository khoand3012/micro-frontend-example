import { Suspense } from "react";
import useDynamicScript from "./useDynamicScript";

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

function ModuleLoader(props) {
  const { ready, failed } = useDynamicScript({
    url: props.module && props.url,
  });

  if (!props.module) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return <h2>Loading dynamic script: {props.url}</h2>;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.url}</h2>;
  }

  const Component = React.lazy(loadComponent(props.scope, props.module));

  if (typeof props.moduleProps === 'object' && Object.keys(props.moduleProps).length > 0) {
    return (
      <Suspense fallback="Loading Module">
        <Component {...props.moduleProps} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback="Loading Module">
      <Component />
    </Suspense>
  );
}

export function GetRemoteModuleInfo(moduleName) {
  const result = {
    scope: "",
    module: "",
    url: "",
  };
  if (window.remoteComponents[moduleName]) {
    result.scope = window.remoteComponents[moduleName].scope;
    result.module = window.remoteComponents[moduleName].module;
    result.url = window.remoteComponents[moduleName].url;
  }
  return result;
}

export default ModuleLoader;
