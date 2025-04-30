export {};

declare global {
  interface Window {
    electronAPI: {
      readFile: (path: string) => Promise<string>;
      // adicione aqui outras funções que você expôs no preload
    };
  }
}
