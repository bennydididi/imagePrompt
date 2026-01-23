import { getDictionary } from "~/lib/get-dictionary";
import type { Locale } from "~/config/i18n-config";

export default async function ImageToPromptPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <div className="container py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Free Image to Prompt Generator</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Convert Image to Prompt to generate your own image</p>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-neutral-800 rounded-xl shadow-md p-8 border border-neutral-200 dark:border-neutral-700">
        {/* 导航标签 */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700 mb-6">
          <button className="px-4 py-2 text-purple-600 font-semibold border-b-2 border-purple-600 mr-4">
            Image to Prompt
          </button>
          <button className="px-4 py-2 text-neutral-500 dark:text-neutral-400 hover:text-purple-600">
            Text to Prompt
          </button>
        </div>

        {/* 标签内容 */}
        <div className="space-y-6">
          {/* 上传方式切换 */}
          <div className="flex space-x-4 mb-6">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md">
              Upload Image
            </button>
            <button className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md">
              Input Image URL
            </button>
          </div>

          {/* 上传和预览区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 上传区域 */}
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📸</div>
              <div className="text-lg font-medium mb-2">Upload a photo or drag and drop</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400">PNG, JPG, WEBP up to 5MB</div>
              <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md">
                Select Image
              </button>
            </div>

            {/* 预览区域 */}
            <div className="border-2 border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📤</div>
              <div className="text-lg font-medium">Image Preview</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Your image will show here</div>
            </div>
          </div>

          {/* 模型选择 */}
          <div>
            <h3 className="text-lg font-medium mb-4">Select AI Model</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border-2 border-purple-600 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
                <div className="font-medium mb-1">General imagePrompt</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Natural language description of the image</div>
                <div className="mt-2 text-purple-600 font-semibold">✓</div>
              </div>
              <div className="border-2 border-neutral-300 dark:border-neutral-600 rounded-lg p-4 hover:border-purple-600 transition-colors">
                <div className="font-medium mb-1">Flux</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Optimized for state-of-the-art Flux models, concise natural language</div>
              </div>
              <div className="border-2 border-neutral-300 dark:border-neutral-600 rounded-lg p-4 hover:border-purple-600 transition-colors">
                <div className="font-medium mb-1">Midjourney</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Tailored for Midjourney generation with Midjourney parameters</div>
              </div>
              <div className="border-2 border-neutral-300 dark:border-neutral-600 rounded-lg p-4 hover:border-purple-600 transition-colors">
                <div className="font-medium mb-1">Stable Diffusion</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">Formatted for Stable Diffusion models</div>
              </div>
            </div>
          </div>

          {/* 语言选择和操作按钮 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-neutral-700 dark:text-neutral-300">Prompt Language:</label>
              <select className="border border-neutral-300 dark:border-neutral-600 rounded-md px-3 py-1 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <option>English</option>
                <option>中文</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Generate Prompt
              </button>
              <button className="px-6 py-2 bg-transparent text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                View History
              </button>
            </div>
          </div>

          {/* 结果区域 */}
          <div>
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="text-neutral-500 dark:text-neutral-400 mb-4">Generated prompt will appear here</div>
              <textarea 
                className="w-full h-32 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md p-4 text-neutral-700 dark:text-neutral-300 resize-none"
                placeholder="Your generated prompt will be displayed here..."
              ></textarea>
            </div>
          </div>

          {/* 辅助说明 */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Want to analyze specific aspects like style or describe people in the image? Try our <span className="font-semibold">AI Describe Image</span> tool for detailed analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}