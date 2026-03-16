/**
 * DORI Dashboard — Cloudflare Worker
 *
 * 정상 응답이면 그대로 통과.
 * Jetson 이 꺼져있어 503 / 연결 실패가 발생하면 오프라인 안내 페이지를 반환.
 */

import OFFLINE_HTML from './offline.html';

export default {
  async fetch(request) {
    try {
      const response = await fetch(request);

      // Cloudflare 가 origin 에 도달하지 못했을 때 반환하는 상태코드
      // 521 = origin down, 522 = timeout, 523 = unreachable, 530 = general tunnel error
      const OFFLINE_CODES = new Set([503, 521, 522, 523, 530]);

      if (OFFLINE_CODES.has(response.status)) {
        return offlinePage();
      }

      return response;
    } catch {
      // fetch 자체가 던지면 (DNS 실패, 연결 거부 등)
      return offlinePage();
    }
  },
};

function offlinePage() {
  return new Response(OFFLINE_HTML, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
