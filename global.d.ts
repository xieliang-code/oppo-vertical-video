// global.d.ts
declare global {
    interface Window {
      pictorialWebApi: {
        setCanSlideDownToClose: (value: boolean) => void;
      };
    }
  }
  
  export {};
  