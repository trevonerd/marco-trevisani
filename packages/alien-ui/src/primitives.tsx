import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode
} from "react";

type PolymorphicClassName = {
  className?: string;
};

const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "ghost";
};

export function Button({ className, tone = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cx("alien-button", `alien-button--${tone}`, className)}
      {...props}
    />
  );
}

export type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  tone?: "primary" | "ghost";
};

export function LinkButton({
  className,
  tone = "primary",
  ...props
}: LinkButtonProps) {
  return (
    <a
      className={cx("alien-button", `alien-button--${tone}`, className)}
      {...props}
    />
  );
}

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("alien-badge", className)} {...props} />;
}

export function Surface({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("alien-surface", className)} {...props} />;
}

export type SocialLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: string;
  label: string;
  icon: ReactNode;
};

export function SocialLink({
  className,
  href,
  icon,
  label,
  ...props
}: SocialLinkProps) {
  return (
    <a
      className={cx("alien-social-link", className)}
      href={href}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </a>
  );
}

export type StackProps = HTMLAttributes<HTMLDivElement> &
  PolymorphicClassName & {
    gap?: "sm" | "md" | "lg";
  };

export function Stack({ className, gap = "md", ...props }: StackProps) {
  return (
    <div
      className={cx("alien-stack", `alien-stack--${gap}`, className)}
      {...props}
    />
  );
}
