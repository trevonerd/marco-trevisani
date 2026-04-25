import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge, LinkButton } from "./primitives";

describe("alien-ui primitives", () => {
  it("renders reusable button link classes", () => {
    const markup = renderToStaticMarkup(
      <LinkButton href="/x">Open</LinkButton>
    );

    expect(markup).toContain("alien-button");
    expect(markup).toContain('href="/x"');
  });

  it("renders badges as semantic inline content", () => {
    expect(renderToStaticMarkup(<Badge>React</Badge>)).toContain("<span");
  });
});
