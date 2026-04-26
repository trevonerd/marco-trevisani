import {
  Badge,
  LinkButton,
  SocialLink,
  Surface
} from "@marco-trevisani/alien-ui";
import Image from "next/image";
import { profile } from "../content/profile";
import { AudioPlayer } from "./audio-player";
import { Icon } from "./social-icons";
import { JsonLd } from "./structured-data";
import { TiltPortrait } from "./tilt-portrait";

const backgroundParticles = [
  "aurora",
  "signal",
  "pulse",
  "orbit",
  "spark",
  "glow",
  "nova",
  "flux",
  "beam",
  "dust",
  "ion",
  "halo",
  "wave",
  "echo",
  "glint",
  "flare",
  "prism",
  "ray"
];

export default function Home() {
  return (
    <main className="site-shell" id="main-content">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <JsonLd />
      <div className="background-particles" aria-hidden="true">
        {backgroundParticles.map((particle) => (
          <span key={particle} />
        ))}
      </div>
      <div className="page">
        <section className="hero" aria-label="Marco Trevisani landing page">
          <div className="hero__content">
            <p className="hero__eyebrow">{profile.eyebrow}</p>
            <h1 className="hero__title" aria-label={profile.headline}>
              <span
                className="hero__name-word"
                data-word="Marco"
                aria-hidden="true"
              >
                Marco
              </span>
              <span
                className="hero__name-word hero__name-word--accent"
                data-word="Trevisani"
                aria-hidden="true"
              >
                Trevisani
              </span>
            </h1>
            <p className="hero__subheadline">{profile.subheadline}</p>
            <p className="hero__summary">{profile.summary}</p>
            <div className="highlights">
              {profile.highlights.map((highlight) => (
                <Badge key={highlight}>{highlight}</Badge>
              ))}
            </div>
            <div className="hero__actions">
              <LinkButton
                href={profile.website}
                target="_blank"
                rel="noreferrer"
              >
                Trevisoft.dev
              </LinkButton>
              <LinkButton
                href={profile.socialLinks[0].href}
                target="_blank"
                rel="noreferrer"
                tone="ghost"
              >
                LinkedIn
              </LinkButton>
            </div>
            <div className="hero__meta">
              <span>Frontend</span>
              <span className="hero__meta-dot">+</span>
              <span>creative coding</span>
              <span className="hero__meta-dot">+</span>
              <span>side projects</span>
            </div>
          </div>

          <div className="hero__visual">
            <div className="portrait-stage">
              <TiltPortrait>
                <Image
                  className="portrait__image"
                  src="/marco_trevisani_web_developer_cartoon@2x.png"
                  alt="Cartoon portrait of Marco Trevisani"
                  width={400}
                  height={586}
                  priority
                  sizes="(max-width: 820px) 46vw, 220px"
                />
                <p className="portrait__role">{profile.title}</p>
              </TiltPortrait>
              <AudioPlayer />
            </div>
            <nav className="socials" aria-label="Marco Trevisani social links">
              {profile.socialLinks.map((link) => (
                <SocialLink
                  key={link.href}
                  href={link.href}
                  icon={<Icon label={link.label} />}
                  label={link.label}
                  target="_blank"
                  rel="noreferrer"
                />
              ))}
            </nav>
          </div>
        </section>

        <Surface className="signal">
          <div className="signal__content">
            <div className="signal__header">
              <span className="signal__mark" aria-hidden="true" />
              <p className="signal__eyebrow">Side-project lab</p>
            </div>
            <strong>Trevisoft is where experiments become products.</strong>
            <p>
              Useful tools, web experiments and small digital products built
              with the same care as client work.
            </p>
            <ul className="signal__meta">
              <li>Tools</li>
              <li>Experiments</li>
              <li>Product UI</li>
            </ul>
          </div>
          <div className="signal__action">
            <LinkButton
              href={profile.website}
              target="_blank"
              rel="noreferrer"
              tone="ghost"
              className="signal__button"
            >
              <span>Visit Lab</span>
              <svg
                aria-hidden="true"
                height="18"
                viewBox="0 0 24 24"
                width="18"
              >
                <path
                  d="M7 17 17 7m0 0H9m8 0v8"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.4"
                />
              </svg>
            </LinkButton>
          </div>
        </Surface>
      </div>
    </main>
  );
}
