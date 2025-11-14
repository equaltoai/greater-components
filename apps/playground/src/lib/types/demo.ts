export type DemoMetadata = {
  slug: string;
  title: string;
  description: string;
  sections?: string[];
};

export type DemoPageData = {
  metadata: DemoMetadata;
};
