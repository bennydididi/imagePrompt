'use client'
import React, { useRef, useState, useEffect } from 'react';

export default function ImageToPromptPage({ params }: any) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [promptType, setPromptType] = useState<string>('Midjourney');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [displayedProgress, setDisplayedProgress] = useState<number>(0);

  const openPicker = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      // only store the selected file locally; actual upload/run happens on Generate
      setSelectedFile(file);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Upload failed. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return alert('Please select an image first.');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', selectedFile);
      form.append('promptType', promptType);
      form.append('userQuery', 'Please describe this image.');

      // Use XMLHttpRequest to track upload progress
      setProgress(5);
      const uploadRequest = () =>
        new Promise<any>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/image-to-prompt');
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              // cap upload portion to 60% while server-side processing remains
              const pct = Math.round((e.loaded / e.total) * 60);
              setProgress(pct);
            } else {
              setProgress((p) => Math.min(60, p + 10));
            }
          };
          xhr.onerror = () => reject(new Error('Network error during upload'));
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  resolve(JSON.parse(xhr.responseText));
                } catch (e) {
                  resolve(xhr.responseText);
                }
              } else {
                reject(new Error(`run failed: ${xhr.status} ${xhr.responseText}`));
              }
            }
          };
          xhr.send(form);
        });

      const json = await uploadRequest();
      // bump progress to indicate server-side processing
      setProgress(85);
      const run = json.workflow;
      let generated: string | null = null;
      if (run) {
        // Coze may return run.data as a JSON string like "{\"output\":\"...\"}"
        const dataField = run.data;
        if (typeof dataField === 'string') {
          try {
            const parsedData = JSON.parse(dataField);
            generated = parsedData.output ?? parsedData.prompt ?? parsedData.result ?? null;
          } catch (e) {
            // not JSON -- ignore
          }
        } else if (typeof dataField === 'object' && dataField !== null) {
          generated = dataField.output ?? dataField.result?.prompt ?? null;
        }

        if (!generated) {
          generated = run?.outputs?.[0]?.value ?? run?.outputs?.[0]?.content ?? run?.data?.result?.prompt ?? null;
        }
      }

      if (generated) {
        setGeneratedPrompt(generated);
      } else {
        console.warn('Prompt field not found, inspect workflow:', run);
        setGeneratedPrompt(JSON.stringify(run, null, 2));
      }
      const returnedFileId = json.fileId;
      setFileId(returnedFileId ?? null);
      setProgress(100);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Generation failed, check console.');
    } finally {
      setLoading(false);
      // hide progress after a short delay
      setTimeout(() => setProgress(0), 900);
    }
  };

  // Smoothly animate displayedProgress towards progress target
  useEffect(() => {
    let rafId: number | null = null;
    const animate = () => {
      setDisplayedProgress((prev) => {
        const target = Math.max(0, Math.min(100, progress));
        const diff = target - prev;
        if (Math.abs(diff) < 0.3) {
          return target;
        }
        // ease-out step: larger diff -> larger step, but capped for smoothness
        const step = Math.max(0.2, Math.abs(diff) * 0.12);
        return +(prev + (diff > 0 ? step : -step)).toFixed(2);
      });
      rafId = requestAnimationFrame(animate);
    };
    // start animation loop
    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [progress]);

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
              <div className="text-center">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={openPicker}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md"
                  type="button"
                >
                  {loading ? 'Uploading...' : 'Select Image'}
                </button>
                {/* Preview is displayed in the Image Preview panel on the right */}
                {fileId && (
                  <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                    Uploaded file id: <span className="font-mono">{fileId}</span>
                  </div>
                )}
                {/* generated prompt shown in the main result textarea below */}
              </div>
            </div>

            {/* 预览区域 */}
            <div className="border-2 border-neutral-300 dark:border-neutral-600 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📤</div>
              <div className="text-lg font-medium">Image Preview</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Your image will show here</div>
              {preview ? (
                <div className="mt-4">
                  <img src={preview} alt="preview" className="max-w-full max-h-64 mx-auto rounded-md" />
                  {selectedFile && (
                    <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                      File: <span className="font-mono">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 text-neutral-500 dark:text-neutral-400">No image selected</div>
              )}
            </div>
          </div>

            {/* 模型选择（可点击、带激活样式） */}
            <div>
              <h3 className="text-lg font-medium mb-4">Select AI Model</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'general', label: 'General imagePrompt', desc: 'Natural language description of the image' },
                  { id: 'flux', label: 'Flux', desc: 'Optimized for state-of-the-art Flux models, concise natural language' },
                  { id: 'midjourney', label: 'Midjourney', desc: 'Tailored for Midjourney generation with Midjourney parameters' },
                  { id: 'stable', label: 'Stable Diffusion', desc: 'Formatted for Stable Diffusion models' },
                ].map((m) => {
                  const active = promptType.toLowerCase() === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPromptType(m.id)}
                      className={`text-left rounded-lg p-4 transition-colors border-2 ${active ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-neutral-300 dark:border-neutral-600 hover:border-purple-600'}`}
                    >
                      <div className="font-medium mb-1">{m.label}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">{m.desc}</div>
                      {active && <div className="mt-2 text-purple-600 font-semibold">✓</div>}
                    </button>
                  );
                })}
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
              <button onClick={handleGenerate} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Generate Prompt
              </button>
              <button className="px-6 py-2 bg-transparent text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                View History
              </button>
            </div>
          </div>

          {/* 结果区域 */}
          {(loading || displayedProgress > 0) && (
            <div className="mt-4">
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-purple-600 transition-all"
                  style={{ width: `${displayedProgress}%` }}
                />
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                {Math.round(displayedProgress)}% complete
              </div>
            </div>
          )}

          <div>
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="text-neutral-500 dark:text-neutral-400 mb-4">Generated prompt will appear here</div>
              <textarea
                className="w-full h-32 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md p-4 text-neutral-700 dark:text-neutral-300 resize-none"
                placeholder="Your generated prompt will be displayed here..."
                value={generatedPrompt ?? ''}
                readOnly
              />
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