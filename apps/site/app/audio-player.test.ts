import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AudioPlayer } from "./audio-player";

describe("AudioPlayer", () => {
  it("renders a visible initial beacon before music starts", () => {
    const markup = renderToStaticMarkup(createElement(AudioPlayer));

    expect(markup).toContain('data-audio-controller="true"');
    expect(markup).toContain('data-state="waiting"');
    expect(markup).toContain("audio-toggle__beacon-ring--inner");
    expect(markup).toContain("audio-toggle__beacon-ring--outer");
    expect(markup).toContain("Click here");
  });

  it("does not render autoplay audio", () => {
    const markup = renderToStaticMarkup(createElement(AudioPlayer));

    expect(markup).not.toContain("autoPlay");
  });
});
