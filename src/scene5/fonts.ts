import { continueRender, delayRender, staticFile } from 'remotion';

// Ported from template/src/fonts.ts as-is.
export const PRETENDARD = 'Pretendard';

const WEIGHTS: { weight: string; file: string }[] = [
  { weight: '500', file: 'Pretendard-Medium.woff2' },
  { weight: '600', file: 'Pretendard-SemiBold.woff2' },
  { weight: '700', file: 'Pretendard-Bold.woff2' },
  { weight: '800', file: 'Pretendard-ExtraBold.woff2' },
];

WEIGHTS.forEach(({ weight, file }) => {
  const handle = delayRender(`Loading Pretendard ${weight}`);
  const fontFace = new FontFace(PRETENDARD, `url(${staticFile(`assets/fonts/${file}`)})`, {
    weight,
  });

  fontFace
    .load()
    .then((loaded) => {
      document.fonts.add(loaded);
      continueRender(handle);
    })
    .catch((err) => {
      console.error(`Failed to load Pretendard ${weight}`, err);
      continueRender(handle);
    });
});
