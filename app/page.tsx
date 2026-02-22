'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'

export default function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const templates = [
    { id: 'template1', name: '商务证件照' },
    { id: 'template2', name: '韩系写真' },url: '/IMG_5998.JPG' },
    { id: 'template3', name: '电影感大片' }
  ]

  async function handleUpload(file: File) {
    setLoading(true)

    try {
      // 前端压缩至 2MB 以内
      const compressed = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      })

      const base64 = await fileToBase64(compressed)

      const res = await fetch('/api/facefusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          template: selectedTemplate
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || '生成失败')
      } else {
        setResult(data.image)
      }
    } catch (err) {
      alert('上传失败')
    }

    setLoading(false)
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>OnePic AI 人像融合</h1>

      <div style={{ display: 'flex', gap: 20 }}>
        {templates.map(t => (
          <div
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            style={{
              padding: 20,
              border: selectedTemplate === t.id ? '2px solid blue' : '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            {t.name}
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div style={{ marginTop: 30 }}>
          <input
            type="file"
            accept="image/*"
            onChange={e => e.target.files && handleUpload(e.target.files[0])}
          />
        </div>
      )}

      {loading && <p>生成中，请稍候...</p>}

      {result && (
        <div style={{ marginTop: 30 }}>
          <img src={result} alt="result" style={{ maxWidth: 400 }} />
        </div>
      )}
    </main>
  )
}
