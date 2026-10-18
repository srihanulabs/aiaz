export const siteConfig = {
  name: "aiaz·labs",
  domain: "aiaz.in",
  author: "Rahul Mishra",
  /** Source repository. Projects link here unless they set their own `links.github`. */
  repoUrl: "https://github.com/srihanulabs/aiaz",
  /** Fill these in to show follow buttons on Labs; nothing renders while all are unset. */
  socials: {
    linkedin: undefined as string | undefined,
    x: undefined as string | undefined,
    github: undefined as string | undefined,
  },
};

export const hasSocials = Object.values(siteConfig.socials).some(Boolean);
