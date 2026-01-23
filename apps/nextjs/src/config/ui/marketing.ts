import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";
import type { MarketingConfig } from "~/types";

export const getMarketingConfig = async ({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}): Promise<MarketingConfig> => {
  const dict = await getDictionary(lang);
  return {
    mainNav: [
      {
        title: "Home",
        href: `/${lang}`,
      },
      {
        title: "Inspiration",
        href: `/${lang}/inspiration`,
      },
      {
        title: "Tutorials",
        href: `/${lang}/tutorials`,
      },
      {
        title: "Tools",
        href: `/${lang}/tools`,
      },
      {
        title: "Pricing",
        href: `/${lang}/pricing`,
      },
    ],
  };
};
