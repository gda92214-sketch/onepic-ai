'use client'

import { useState } from 'react'

export default function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('template1')

  const templates = [
    { id: 'template1', name: '商务证件照', url: '/IMG_5998.JPG' },
    { id: 'template2', name: '韩系写真', url: '/IMG_5998.JPG' },
    { id: 'template3', name: '电影感大片', url: '/IMG_5998.JPG' },
    { id: 'template4', name: '杂志封面', url: '/IMG_5998.JPG' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 flex justify-center">
      
      {/* 手机容器 */}
      <div className="w-full max-w-md min-h-screen bg-white shadow-2xl">

        {/* 顶部 Hero */}
        <div className="px-6 pt-10 pb-8 bg-gradient-to-r from-black to-neutral-800 text-white">
          <h1 className="text-3xl font-bold tracking-tight">OnePic</h1>
          <p className="text-sm text-neutral-300 mt-2">
            一张照片，生成你的专属 AI 写真
          </p>
        </div>

        {/* 内容区 */}
        <div className="px-6 -mt-6">

          {/* 卡片容器 */}
          <div className="bg-white rounded-3xl shadow-xl p-5 backdrop-blur-md">

            {/* 标题 */}
            <h2 className="text-lg font-semibold mb-4 text-neutral-800">
              选择风格模版
            </h2>

            {/* 模版网格 */}
            <div className="grid grid-cols-2 gap-4">
              {templates.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedTemplate(item.id)}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
                    ${selectedTemplate === item.id 
                      ? 'ring-2 ring-black scale-[1.03]' 
                      : 'hover:scale-[1.02]'
                    }`}
                >
                  <div className="aspect-[3/4] bg-neutral-100">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs py-2 text-center">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>

            {/* 上传区域 */}
            <div className="mt-8 space-y-5">

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  上传你的正面照片
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-neutral-500 
                  file:mr-4 file:py-2 file:px-4 
                  file:rounded-full file:border-0 
                  file:text-sm file:font-semibold 
                  file:bg-black file:text-white 
                  hover:file:bg-neutral-800 transition"
                />
              </div>

              <button className="w-full bg-black hover:bg-neutral-900 text-white font-semibold py-4 rounded-2xl shadow-lg transition active:scale-95">
                立即生成 AI 写真
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
