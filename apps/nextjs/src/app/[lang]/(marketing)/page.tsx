import Link from "next/link";
import { getDictionary } from "~/lib/get-dictionary";

import { Button } from "@saasfly/ui/button";

import type { Locale } from "~/config/i18n-config";

// 功能卡片数据
const featureCards = [
  {
    title: "Image to Prompt",
    description: "Convert image to Prompt to generate your own image",
    icon: "📸",
    link: "/image-to-prompt"
  },
  {
    title: "Magic Enhance",
    description: "Transform simple text into detailed, descriptive image prompt.",
    icon: "✨",
    link: "/magic-enhance"
  },
  {
    title: "AI Describe image",
    description: "Let AI help you understand and analyze any image in detail",
    icon: "🔍",
    link: "/ai-describe-image"
  },
  {
    title: "AI Image Generator",
    description: "Transform your image prompt into stunning artwork, powered by AI generation",
    icon: "🖼️",
    link: "/ai-image-generator"
  },
];

export default async function IndexPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <>
      {/* 主标题区域 */}
      <section className="container py-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Create Better AI Art with <span className="text-purple-600">Image Prompt</span>
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl">
            Inspire ideas. Enhance image prompt. Create masterpieces
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
              Try it now!
            </Button>
            <Button variant="outline" className="px-8 py-6 text-lg">
              Tutorials
            </Button>
          </div>
        </div>
      </section>

      {/* 功能卡片区域 */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureCards.map((card, index) => (
            <Link 
              key={index} 
              href={`/${lang}${card.link}`} 
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 相关链接区域 */}
      <section className="container py-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            You may be interested in: 
            <Link href={`/${lang}/what-is-image-prompt`} className="text-purple-600 hover:underline mx-1">
              What is an Image Prompt?
            </Link>
            or 
            <Link href={`/${lang}/how-to-write-effective-image-prompts`} className="text-purple-600 hover:underline mx-1">
              How to Write Effective Image Prompts?
            </Link>
          </div>
        </div>
      </section>

      {/* 底部标题区域 */}
      <section className="container py-20">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold mb-4">AI Powered Image Prompt Tools</h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-3xl">
            A complete suite of AI tools covering every aspect of your image creation journey
          </p>
        </div>
      </section>
    </>
  );
}
