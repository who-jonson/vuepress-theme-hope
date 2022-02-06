import { computed, defineComponent, h } from "vue";
import DropTransition from "../transitions/DropTransition.vue";
import { TimelineIcon } from "../icons";
import {
  useNavigate,
  useTimelines,
  useThemeLocaleData,
} from "../../composables";

import type { VNode } from "vue";

export default defineComponent({
  name: "TimelineList",

  setup() {
    const themeLocale = useThemeLocaleData();
    const timelines = useTimelines();
    const navigate = useNavigate();

    const hint = computed(() => themeLocale.value.blogLocales.timeline);

    return (): VNode =>
      h("div", { class: "timeline-list-wrapper" }, [
        h(
          "div",
          {
            class: "title",
            onClick: () => navigate(timelines.value.path),
          },
          [
            h(TimelineIcon),
            h("span", { class: "number" }, timelines.value.items.length),
            hint.value,
          ]
        ),
        h("hr"),
        h(
          "div",
          { class: "content" },
          h(
            "ul",
            { class: "timeline-list" },
            timelines.value.config.map(({ year, items }, index) =>
              h(DropTransition, { delay: 0.08 * (index + 1) }, () =>
                h("li", [
                  h("h3", { class: "year" }, year),
                  h(
                    "ul",
                    { class: "year-wrapper" },
                    items.map(({ date, meta, path }) =>
                      h("li", [
                        h("span", { class: "date" }, date),
                        h(
                          "span",
                          {
                            class: "timeline-title",
                            onClick: () => navigate(path),
                          },
                          meta.title
                        ),
                      ])
                    )
                  ),
                ])
              )
            )
          )
        ),
      ]);
  },
});
