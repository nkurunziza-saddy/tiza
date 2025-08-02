declare global {
  interface Window {
    __TAURI__?: {
      invoke: (command: string, args?: any) => Promise<any>;
    };
    __TAURI_INTERNALS__?: any;
  }
}

export {};
