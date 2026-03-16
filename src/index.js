/**
 * DORI Dashboard — Cloudflare Worker
 *
 * 정상 응답이면 그대로 통과.
 * Jetson 이 꺼져있어 503 / 연결 실패 시 에러 정보를 주입한 오프라인 페이지 반환.
 */

import OFFLINE_HTML from './offline.html';

// Cloudflare 가 origin 에 도달하지 못했을 때 반환하는 상태코드
const OFFLINE_CODES = new Set([503, 521, 522, 523, 530]);

// 에러 코드별 설명
const ERROR_DESC = {
  503: 'Service Unavailable — origin server is down or not responding.',
  521: 'Web Server Is Down — Cloudflare cannot connect to the origin server.',
  522: 'Connection Timed Out — origin server did not respond in time.',
  523: 'Origin Is Unreachable — DNS resolution or routing failed.',
  530: 'Tunnel Error — Cloudflare Tunnel is not active.',
  0:   'Connection Failed — could not reach the origin server.',
};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    let statusCode = 0;
    let errorDesc  = ERROR_DESC[0];

    try {
      const response = await fetch(request);

      if (!OFFLINE_CODES.has(response.status)) {
        return response;  // 정상 응답은 그대로 통과
      }

      statusCode = response.status;
      errorDesc  = ERROR_DESC[statusCode] ?? `HTTP ${statusCode}`;
    } catch (err) {
      // fetch 자체가 던지면 (DNS 실패, 연결 거부 등)
      statusCode = 0;
      errorDesc  = ERROR_DESC[0];
    }

    return offlinePage(statusCode, errorDesc, url);
  },
};

function offlinePage(statusCode, errorDesc, url) {
  // HTML 의 플레이스홀더를 실제 값으로 교체
  const html = OFFLINE_HTML
    .replace(/{{STATUS_CODE}}/g,  statusCode || 'N/A')
    .replace(/{{ERROR_DESC}}/g,   errorDesc)
    .replace(/{{REQUEST_URL}}/g,  url?.href ?? 'unknown')
    .replace(/{{TIMESTAMP}}/g,    new Date().toISOString());

  return new Response(html, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
