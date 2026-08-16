const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-flash-latest';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const REPEAT_VALUES = ['once', 'daily', 'weekly'];

function buildSystemInstruction(todayISO) {
  return `You are a scheduling assistant inside HealthFlow, a wellness habit app.
Given a user's free-text description of their day, habits, or routine, respond with ONLY a JSON array
of reminder objects — no prose, no markdown code fences, nothing but the array.

Each object must have exactly these fields:
- "name": short reminder title, in the SAME language the user wrote in, under 40 characters
- "time": 24-hour "HH:MM"
- "repeat": one of "once", "daily", "weekly"
- "days": array of lowercase weekday codes from ["mon","tue","wed","thu","fri","sat","sun"] — only
  populate this when repeat is "weekly", otherwise an empty array
- "startDate": "YYYY-MM-DD" — use ${todayISO} unless the user specifies a different start

Return between 1 and 8 reminders that best capture what the user described. If the user asks for
something unrelated to scheduling habits/reminders, return an empty array [].`;
}

function stripCodeFences(text) {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();
}

function sanitizeReminder(raw, todayISO) {
  if (!raw || typeof raw !== 'object' || !raw.name || !raw.time) return null;

  const repeat = REPEAT_VALUES.includes(raw.repeat) ? raw.repeat : 'once';
  const days = Array.isArray(raw.days) ? raw.days.filter((d) => DAY_KEYS.includes(d)) : [];
  const time = /^\d{2}:\d{2}$/.test(raw.time) ? raw.time : '09:00';
  const startDate = /^\d{4}-\d{2}-\d{2}$/.test(raw.startDate) ? raw.startDate : todayISO;

  return {
    name: String(raw.name).slice(0, 60),
    time,
    repeat,
    days: repeat === 'weekly' ? days : [],
    startDate,
    endDate: null,
  };
}

export async function generateScheduleFromPrompt(userPrompt, todayISO) {
  if (!API_KEY) {
    throw new Error('missing_key');
  }

  const body = {
    contents: [{ parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: buildSystemInstruction(todayISO) }] },
    generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
  };

  let response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('network');
  }

  if (!response.ok) {
    throw new Error(`http_${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('empty_response');

  let parsed;
  try {
    parsed = JSON.parse(stripCodeFences(text));
  } catch {
    throw new Error('parse_error');
  }

  if (!Array.isArray(parsed)) throw new Error('parse_error');

  return parsed
    .slice(0, 8)
    .map((item) => sanitizeReminder(item, todayISO))
    .filter(Boolean);
}
