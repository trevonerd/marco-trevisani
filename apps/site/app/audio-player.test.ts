import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AudioPlayer } from "./audio-player";

describe("AudioPlayer", () => {
  it("renders a visible initial beacon before music starts", () => {
    const markup = renderToStaticMarkup(createElement(AudioPlayer));

    expect(markup).toContain('data-state="waiting"');
    expect(markup).toContain("audio-toggle__beacon-ring--inner");
    expect(markup).toContain("audio-toggle__beacon-ring--outer");
  });

  it("keeps autoplay available for mobile unlock", () => {
    const markup = renderToStaticMarkup(createElement(AudioPlayer));

    expect(markup).toContain("autoPlay");
  });
});
