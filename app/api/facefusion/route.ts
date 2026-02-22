import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const RATE_LIMIT = 10
const rateMap = new Map<string, { count: number; time: number }>()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()

  const record = rateMap.get(ip)

  if (record && now - record.time < 60000) {
    if (record.count >= RATE_LIMIT) {
      return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 })
    }
    record.count++
  } else {
    rateMap.set(ip, { count: 1, time: now })
  }

  try {
    const { image, template } = await req.json()

    if (!image) {
      return NextResponse.json({ error: '图片不能为空' }, { status: 400 })
    }

    const AK = process.env.VOLC_AK!
    const SK = process.env.VOLC_SK!

    const endpoint = 'https://visual.volcengineapi.com'
    const path = '/'
    const service = 'cv'
    const region = 'cn-north-1'
    const method = 'POST'

    const body = JSON.stringify({
      req_key: "facefusion_3.6",
      image_base64: image.split(',')[1],
      template_id: template
    })

    const { headers } = signV4({
      method,
      endpoint,
      path,
      service,
      region,
      body,
      AK,
      SK
    })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(endpoint, {
      method,
      headers,
      body,
      signal: controller.signal
    })

    clearTimeout(timeout)

    const data = await response.json()

    if (data.code !== 10000) {
      if (data.code === 20001) {
        return NextResponse.json(
          { error: '未检测到人脸，请重新上传' },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: '生成失败' }, { status: 500 })
    }

    return NextResponse.json({
      image: `data:image/png;base64,${data.data.image}`
    })
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

function signV4({
  method,
  endpoint,
  path,
  service,
  region,
  body,
  AK,
  SK
}: any) {
  const host = new URL(endpoint).host
  const contentType = 'application/json'
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)

  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${host}\n` +
    `x-date:${amzDate}\n`

  const signedHeaders = 'content-type;host;x-date'
  const payloadHash = crypto.createHash('sha256').update(body).digest('hex')

  const canonicalRequest =
    `${method}\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`

  const credentialScope = `${dateStamp}/${region}/${service}/request`
  const stringToSign =
    `HMAC-SHA256\n${amzDate}\n${credentialScope}\n` +
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')

  const kDate = crypto.createHmac('sha256', SK).update(dateStamp).digest()
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest()
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest()
  const kSigning = crypto.createHmac('sha256', kService).update('request').digest()

  const signature = crypto
    .createHmac('sha256', kSigning)
    .update(stringToSign)
    .digest('hex')

  const authorization =
    `HMAC-SHA256 Credential=${AK}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    headers: {
      'Content-Type': contentType,
      'Host': host,
      'X-Date': amzDate,
      'Authorization': authorization
    }
  }
}
