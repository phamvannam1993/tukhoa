import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #16a06a 0%, #0d5e42 100%)',
          color: 'white',
          fontSize: 118,
          fontWeight: 800,
          borderRadius: 40,
        }}
      >
        T
      </div>
    ),
    { ...size },
  );
}
