/**
 * リード送信の共通処理（クライアントサイド）。
 * - Webhook（Zapier / Make等）へのJSON POST
 * - 連投制限（localStorage: 10分間に3回まで・前回送信から30秒以上）
 * - ボット判定の補助（ハニーポット・最短入力時間）
 */

const SUBMISSIONS_KEY = 'lead_submissions';
const WINDOW_MS = 10 * 60 * 1000; // 10分
const MAX_PER_WINDOW = 3;
const MIN_INTERVAL_MS = 30 * 1000; // 30秒
/** フォーム表示から送信までがこれ未満ならボットとみなす */
export const MIN_FILL_MS = 3 * 1000;

function loadTimestamps(): number[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return [];
    const now = Date.now();
    return arr.filter((t): t is number => typeof t === 'number' && now - t < WINDOW_MS);
  } catch {
    return [];
  }
}

/** 連投制限に引っかかっているか */
export function isRateLimited(): boolean {
  const timestamps = loadTimestamps();
  if (timestamps.length >= MAX_PER_WINDOW) return true;
  const last = timestamps[timestamps.length - 1];
  return last !== undefined && Date.now() - last < MIN_INTERVAL_MS;
}

export function recordSubmission(): void {
  try {
    const timestamps = loadTimestamps();
    timestamps.push(Date.now());
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(timestamps));
  } catch {
    // localStorageが使えない環境では制限なしで通す
  }
}

export interface LeadPayload {
  /** 'diagnosis'（AI診断） | 'contact'（問い合わせ） */
  type: 'diagnosis' | 'contact';
  email: string;
  company: string;
  /** 選択された窓口（研修 / 開発 など） */
  track?: string;
  message?: string;
  inquiryType?: string;
  /** 診断結果（typeがdiagnosisのとき） */
  diagnosis?: {
    score: number;
    maxScore: number;
    level: string;
    answers: { question: string; answer: string; points: number }[];
  };
  submittedAt: string;
  page: string;
}

/**
 * Webhook URLへリードを送信する。
 * URLはビルド時に PUBLIC_LEAD_WEBHOOK_URL から注入される（.env.example参照）。
 */
export async function postLead(
  payload: Omit<LeadPayload, 'submittedAt' | 'page'>
): Promise<void> {
  const url = import.meta.env.PUBLIC_LEAD_WEBHOOK_URL as string | undefined;
  if (!url) {
    throw new Error(
      'PUBLIC_LEAD_WEBHOOK_URL が設定されていません（.env.example を参照）'
    );
  }
  const body: LeadPayload = {
    ...payload,
    submittedAt: new Date().toISOString(),
    page: location.href,
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Webhook responded with ${res.status}`);
  }
}
