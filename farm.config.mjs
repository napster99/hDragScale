import { defineFarmConfig } from "@farmfe/core/config";

export default defineFarmConfig({
  compilation: {
    mode: process.env.NODE_ENV,
    input: {
      index: "./src/HanderDragSacle.js",
    },
    output: {
      path: "build",
    },
    // define: {
    //   __DEV__: "true",
    // },

    // script: {
    //   target: "es5",
    // },
    presetEnv: true,
  },
});
