'use client'

import { useState } from 'react'

export default function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // 这里就是你的“家具”清单
  const templates = [
    { id: 'template1', name: '商务证件照', url: '/IMG_5998.JPG' },
    { id: 'template2', name: '韩系写真', url: '' },
    { id: 'template3', name: '电影感大片', url: '' }
  ]

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">AI 写真馆</h1>
      
      {/* 模版展示区域：改为网格布局 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {templates.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedTemplate(item.id)}
            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
              selectedTemplate === item.id ? 'border-blue-500 shadow-lg' : 'border-white'
            }`}
          >
            {/* 图片在上：如果 url 为空会显示灰色块 */}
            <div className="aspect-[3/4] bg-gray-200 relative">
              {item.url ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">暂无图</div>
              )}
            </div>
            {/* 名称在下 */}
            <div className="p-2 bg-white text-center text-sm font-semibold">
              {item.name}
            </div>
          </div>
        ))}
      </div>

      {/* 上传和生成按钮区域 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-4 text-center">第一步：选择上方模版</p>
        <p className="text-sm text-gray-500 mb-4 text-center">第二步：上传你的正面照</p>
        <input type="file" className="w-full mb-4 text-sm" />
        <button className="w-full bg-black text-white py-3 rounded-xl font-bold opacity-50 cursor-not-allowed">
          开始生成写真
        </button>
      </div>
    </div>
  )
}
