import { defineClientConfig } from "@vuepress/client";
import Layout from "./layouts/Layout.vue";

export default defineClientConfig({
  layouts: {
    // we override the default layout to add search box
    Layout,
  },
});
