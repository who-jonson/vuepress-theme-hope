import { resolveRouteWithRedirect } from "@mr-hope/vuepress-shared/lib/client";
import { usePageFrontmatter } from "@vuepress/client";
import { computed, defineComponent, h, onMounted, watch, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { getLinks } from "../composables";

import type { VNode } from "vue";

import "../styles/breadcrumb.scss";

interface BreadCrumbConfig {
  title: string;
  icon?: string;
  path: string;
}

export default defineComponent({
  name: "BreadCrumb",

  props: {
    show: {
      type: Boolean,
      default: true,
    },

    icon: {
      type: Boolean,
      default: true,
    },

    iconPrefix: {
      type: String,
      default: "",
    },
  },

  setup(props) {
    const pageFrontmatter = usePageFrontmatter();
    const router = useRouter();
    const route = useRoute();

    const config = ref<BreadCrumbConfig[]>([]);

    const enable = computed<boolean>(() => {
      const pageEnable = pageFrontmatter.value.breadcrumb;

      return (
        ((props.show && pageEnable !== false) || pageEnable === true) &&
        config.value.length > 1
      );
    });

    const iconEnable = computed<boolean>(() => {
      const pageEnable = pageFrontmatter.value.breadcrumbIcon;

      return (
        enable.value &&
        ((props.icon && pageEnable !== false) || pageEnable === true)
      );
    });

    const getBreadCrumbConfig = (): void => {
      const routes = router.getRoutes();

      const breadcrumbConfig = getLinks(route)
        .map<BreadCrumbConfig | null>((link) => {
          const route = routes.find((route) => route.path === link);

          if (route) {
            const { meta, path } = resolveRouteWithRedirect(route.path);

            if (typeof meta.title === "string")
              return {
                title: meta.title,
                icon: meta.icon,
                path,
              } as BreadCrumbConfig;
          }

          return null;
        })
        .filter((item): item is BreadCrumbConfig => item !== null);

      if (breadcrumbConfig.length > 1) config.value = breadcrumbConfig;
    };

    watch(() => route.path, getBreadCrumbConfig);

    onMounted(() => {
      void getBreadCrumbConfig();
    });

    return (): VNode =>
      h(
        "nav",
        { class: ["breadcrumb", { disable: !enable.value }] },
        enable.value
          ? h(
              "ol",
              {
                vocab: "https://schema.org/",
                typeof: "BreadcrumbList",
              },
              config.value.map((item, index) =>
                h(
                  "li",
                  {
                    class: { "is-active": config.value.length - 1 === index },
                    property: "itemListElement",
                    typeof: "ListItem",
                  },
                  h(
                    RouterLink,
                    {
                      to: item.path,
                      property: "item",
                      typeof: "WebPage",
                    },
                    () => [
                      // icon
                      item.icon && iconEnable.value
                        ? h("i", {
                            class: ["icon", `${props.iconPrefix}${item.icon}`],
                          })
                        : null,
                      // text
                      h("span", { property: "name" }, item.title || "Unknown"),
                      // meta
                      h("meta", { property: "position", content: index + 1 }),
                    ]
                  )
                )
              )
            )
          : []
      );
  },
});
