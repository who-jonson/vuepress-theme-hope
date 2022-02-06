import { computed, defineComponent, h, ref } from "vue";
import CategoryList from "./CategoryList";
import DropTransition from "../transitions/DropTransition.vue";
import TagList from "./TagList";
import TimelineList from "./TimelineList";
import { ArticleIcon, CategoryIcon, TagIcon, TimelineIcon } from "../icons";
import {
  useArticles,
  useCategoryMap,
  useNavigate,
  useStars,
  useTagMap,
  useThemeLocaleData,
} from "../../composables";

import type { FunctionalComponent, VNode } from "vue";

export default defineComponent({
  name: "BlogInfo",

  setup() {
    const themeLocale = useThemeLocaleData();
    const articles = useArticles();
    const categoryMap = useCategoryMap();
    const categoryNumber = computed(
      () => Object.keys(categoryMap.value.map).length
    );
    const stars = useStars();
    const tagMap = useTagMap();
    const tagNumber = computed(() => Object.keys(tagMap.value.map).length);
    const navigate = useNavigate();

    const active = ref("category");

    const locale = computed(() => themeLocale.value.blogLocales);

    const buttons: [
      "article" | "category" | "tag" | "timeline",
      FunctionalComponent
    ][] = [
      ["article", ArticleIcon],
      ["category", CategoryIcon],
      ["tag", TagIcon],
      ["timeline", TimelineIcon],
    ];

    return (): VNode =>
      h("div", { class: "blog-info-list" }, [
        h(
          "div",
          { class: "switch-wrapper" },
          buttons.map(([key, icon]) =>
            h(
              "button",
              {
                class: "switch-button",
                onClick: () => {
                  active.value = key;
                },
              },
              h(
                "div",
                {
                  class: ["icon-wapper", { active: active.value === key }],
                  ariaLabel: locale.value[key],
                  "data-balloon-pos": "up",
                },
                h(icon)
              )
            )
          )
        ),

        // article
        active.value === "article"
          ? h(DropTransition, () => [
              h("div", { class: "sticky-article-wrapper" }, [
                h(
                  "div",
                  {
                    class: "title",
                    onClick: () => navigate(articles.value.path),
                  },
                  [
                    h(ArticleIcon),
                    h("span", { class: "number" }, articles.value.items.length),
                    locale.value.article,
                  ]
                ),
                h("hr"),
                h(
                  "ul",
                  { class: "sticky-article-list" },
                  stars.value.items.map(({ meta, path }, index) =>
                    h(DropTransition, { delay: 0.08 * (index + 1) }, () =>
                      h(
                        "li",
                        {
                          class: "sticky-article",
                          onClick: () => navigate(path),
                        },
                        meta.title
                      )
                    )
                  )
                ),
              ]),
            ])
          : null,

        // category
        active.value === "category"
          ? h(DropTransition, () => [
              h("div", { class: "category-wrapper" }, [
                categoryNumber.value
                  ? h(
                      "div",
                      {
                        class: "title",
                        onClick: () => navigate(categoryMap.value.path),
                      },
                      [
                        h(CategoryIcon),
                        h("span", { class: "number" }, categoryNumber.value),
                        locale.value.category,
                      ]
                    )
                  : null,
                h("hr"),
                h(DropTransition, { delay: 0.04 }, () => h(CategoryList)),
              ]),
            ])
          : null,

        // tag
        active.value === "tag"
          ? h(DropTransition, () => [
              h("div", { class: "tag-wrapper" }, [
                tagNumber.value
                  ? h(
                      "div",
                      {
                        class: "title",
                        onClick: () => navigate(tagMap.value.path),
                      },
                      [
                        h(TagIcon),
                        h("span", { class: "number" }, tagNumber.value),
                        locale.value.tag,
                      ]
                    )
                  : null,
                h("hr"),
                h(DropTransition, { delay: 0.04 }, () => h(TagList)),
              ]),
            ])
          : null,

        // timeline
        active.value === "timeline"
          ? h(DropTransition, () => h(TimelineList))
          : null,
      ]);
  },
});
