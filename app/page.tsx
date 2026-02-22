'use client'

import { useState } from 'react'

export default function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('template1')

  const templates = [
    { id: 'template1', name: '商务证件照', url: '/IMG_5998.JPG' }, // 这里的路径直接指向根目录的图
    { id: 'template2', name: '韩系写真', url: '' },
    { id: 'template3', name: '电影感大片', url: '' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-xl p-6">
        <h1 className="text-2xl font-black text-center mb-8 text-gray-800">AI 写真馆</h1>
        
        {/* 模版网格：一行两个 */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {templates.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedTemplate(item.id)}
              className={`relative rounded-2xl overflow-hidden border-4 transition-all ${
                selectedTemplate === item.id ? 'border-blue-500 scale-105 shadow-lg' : 'border-transparent'
              }`}
            >
              <div className="aspect-[3/4] bg-gray-100">
                {item.url ? (
                  <img src={item.url} className="w-full h-full object-cover" alt={item.name} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">待上传</div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 text-center backdrop-blur-md">
                {item.name}
              </div>
            </div>
          ))}
        </div>

        {/* 操作区 */}
        <div className="space-y-6 border-t pt-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">上传你的正面照片</label>
            <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95">
            立即生成 AI 写真
          </button>
        </div>
      </div>
    </div>
  )
}
