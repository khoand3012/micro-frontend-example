let resolveRemoteUrl = (remoteUrl) => {
  return new Promise((resolve, reject) => {
    resolve(remoteUrl);
  });
};
let remoteModuleMap = new Map();
let remoteContainerMap = new Map();
let initialSharingScopeCreated = false;
let remoteUrlDefinitions = {};

export function setRemoteUrlResolver(_resolveRemoteUrl) {
  resolveRemoteUrl = _resolveRemoteUrl;
}
export function setRemoteDefinitions(definitions) {
  Object.keys(definitions).forEach(module => {
    let versions = Object.keys(module);
    for (let version of versions) {
      if (module[version].current) {
        remoteUrlDefinitions[module[version]] = module[version].url; 
      }
    }
  })
  // remoteUrlDefinitions = definitions;
}
export async function loadRemoteModule(remoteName, moduleName) {
  const remoteModuleKey = `${remoteName}:${moduleName}`;
  if (remoteModuleMap.has(remoteModuleKey)) {
    return remoteModuleMap.get(remoteModuleKey);
  }
  const container = remoteContainerMap.has(remoteName)
    ? remoteContainerMap.get(remoteName)
    : await loadRemoteContainer(remoteName);
  const factory = await container.get(moduleName);
  const Module = factory();
  remoteModuleMap.set(remoteModuleKey, Module);
  return Module;
}

function loadModule(url) {
  return import(/* webpackIgnore:true */ url);
}


async function loadRemoteContainer(remoteName) {
  if (!resolveRemoteUrl && !remoteUrlDefinitions) {
    throw new Error(
      "Call setRemoteDefinitions or setRemoteUrlResolver to allow Dynamic Federation to find the remote apps correctly."
    );
  }
  if (!initialSharingScopeCreated) {
    initialSharingScopeCreated = true;
    await __webpack_init_sharing__("default");
  }
  const remoteUrl = remoteUrlDefinitions
    ? remoteUrlDefinitions[remoteName]
    : await resolveRemoteUrl(remoteName);
  const containerUrl = `${remoteUrl}${
    remoteUrl.endsWith("/") ? "" : "/"
  }remoteEntry.js`;
  const container = await loadModule(containerUrl);
  await container.init(__webpack_share_scopes__.default);
  remoteContainerMap.set(remoteName, container);
  return container;
}
