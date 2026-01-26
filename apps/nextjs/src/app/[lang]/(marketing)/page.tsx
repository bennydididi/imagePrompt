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
  const isZh = lang === "zh";

  return (
    <>
      {/* 主标题区域 */}
      <section className="container py-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {isZh ? (
              <>
                用 <span className="text-purple-600">Image Prompt</span> 将图片转为提示词，自动生成高质量 AI 提示词
              </>
            ) : (
              <>
                Create Better AI Art with <span className="text-purple-600">Image Prompt</span>
              </>
            )}
          </h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 mb-8 max-w-2xl">
            {isZh
              ? "将图片描述（describe this image）转换为可直接用于生成图像的 prompt，一键生成并优化你的 image to prompt。"
              : "Describe this image and generate AI-ready prompts. Image to prompt generator to convert images into detailed prompts quickly."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
              {isZh ? "立即试用" : "Try it now!"}
            </Button>
            <Button variant="outline" className="px-8 py-6 text-lg">
              {isZh ? "教程" : "Tutorials"}
            </Button>
          </div>
        </div>
      </section>

      {/* 说明 / 特性详情区域（H2s，针对次关键词） */}
      <section className="container py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          <article>
            <h2 className="text-2xl font-bold mb-3">
              {isZh ? "如何将图片转换为 Prompt（Image to Prompt）" : "How to convert an image to a prompt"}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {isZh
                ? "使用我们的 Image to Prompt 工具，你只需上传图片或粘贴图片链接，系统会自动描述图片（describe this image），并生成结构化的 prompt，可直接用于图像生成器。"
                : "Upload an image or paste an image URL and our image to prompt generator will describe the image and produce a structured, AI-ready prompt."}
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold mb-3">
              {isZh ? "AI 自动描述图片（AI Describe Image）" : "AI describe image — automatic image describer"}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {isZh
                ? "我们的 image describer 能够分析图片内容、风格与细节，生成一段清晰的图片描述（describe image），有助于快速生成更精确的 prompt。"
                : "Our image describer analyzes content, style and details to produce a concise description of the image, helping you write better prompts."}
            </p>
          </article>

          <article>
            <h2 className="text-2xl font-bold mb-3">
              {isZh ? "生成器与导出：Image to Prompt Generator" : "Image to Prompt Generator — generate and export"}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {isZh
                ? "生成后可一键复制或导出 prompt，支持多种模型与格式。尝试我们的 image to prompt generator 来快速生成高质量提示词。"
                : "After generation you can copy or export prompts in multiple formats. Try the image to prompt generator to quickly produce high-quality prompts."}
            </p>
          </article>
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
