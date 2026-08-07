import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const FONT_BOLD =
  'https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/BeVietnamPro-Bold.ttf';
const FONT_REG =
  'https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/BeVietnamPro-Regular.ttf';

type LoadedFonts =
  | { name: string; data: ArrayBuffer; weight: 400 | 800; style: 'normal' }[]
  | undefined;

let fontsPromise: Promise<LoadedFonts> | null = null;

async function loadFonts(): Promise<LoadedFonts> {
  if (!fontsPromise) {
    fontsPromise = (async () => {
      try {
        const [bold, reg] = await Promise.all([
          fetch(FONT_BOLD).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())),
          fetch(FONT_REG).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())),
        ]);
        return [
          { name: 'BVP', data: bold, weight: 800, style: 'normal' },
          { name: 'BVP', data: reg, weight: 400, style: 'normal' },
        ];
      } catch {
        return undefined;
      }
    })();
  }
  return fontsPromise;
}

export async function renderOgImage({
  eyebrow,
  title,
  tagline = 'Gợi ý Google, YouTube · phân loại ý định · gom cụm chủ đề · xuất CSV',
}: {
  eyebrow: string;
  title: string;
  tagline?: string;
}): Promise<ImageResponse> {
  const fonts = await loadFonts();
  const ff = fonts ? 'BVP' : 'sans-serif';
  const titleSize = title.length > 46 ? 60 : title.length > 30 ? 70 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 76px',
          background: 'linear-gradient(135deg, #0f7a52 0%, #0d5e42 55%, #0a3f2e 100%)',
          color: 'white',
          fontFamily: ff,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 66,
              height: 66,
              borderRadius: 18,
              background: 'white',
              color: '#0f7a52',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            T
          </div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>TừKhóa.vn</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 4, color: '#8ff0c4', marginBottom: 18 }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: titleSize, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1010 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, fontWeight: 400, color: 'rgba(255,255,255,0.86)', marginTop: 24, maxWidth: 940 }}>
            {tagline}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, fontSize: 24, fontWeight: 400, color: 'rgba(255,255,255,0.9)' }}>
          <span>Miễn phí</span>
          <span>·</span>
          <span>Không cần đăng nhập</span>
          <span>·</span>
          <span>Không lưu dữ liệu máy chủ</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
