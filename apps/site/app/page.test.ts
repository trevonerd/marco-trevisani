import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("home page action hierarchy", () => {
  it("keeps LinkedIn as a hero CTA without duplicating it in the creative links", () => {
    const markup = renderToStaticMarkup(createElement(Home));

    expect(markup).toContain(">LinkedIn</a>");
    expect(markup).toContain(
      'aria-label="Marco Trevisani project and creative links"'
    );
    expect(markup).not.toContain('aria-label="LinkedIn"');
  });

  it("uses contextual copy for the Trevisoft signal CTA", () => {
    const markup = renderToStaticMarkup(createElement(Home));

    expect(markup).toContain(">Open the lab</span>");
  });
});
