const { contextBridge, ipcRenderer } = require('electron');

console.log(`IPC RENDERER:`);
console.log(ipcRenderer);
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke(channel) {
      return ipcRenderer.invoke(channel);
    },
    on(channel, func) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
