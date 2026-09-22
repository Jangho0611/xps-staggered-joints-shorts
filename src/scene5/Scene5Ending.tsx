import { AbsoluteFill, Easing, Img, interpolate, interpolateColors, staticFile, useCurrentFrame } from 'remotion';
import { COLORS, TYPOGRAPHY, EASING_STANDARD, EASING_SETTLE } from './tokens';
import { SCENE5 } from './brief';
import { PRETENDARD } from './fonts';

// Ported as-is from template/src/scenes/Scene5Ending.tsx. Design/animation
// unchanged — only import paths were adjusted to the locally ported
// dependency files (tokens/brief/fonts) under src/scene5/.

const EASE = Easing.bezier(...EASING_STANDARD);
const EASE_SETTLE = Easing.bezier(...EASING_SETTLE);

const GRADIENT_BG = 'linear-gradient(135deg, #F3EEE5 0%, #E0C9A8 100%)';
const TEXT_COLOR = COLORS.textMain;
const LOGO_SIZE = 260;

const TRUST_FONT_SIZE = 28;
const TRUST_LINE_HEIGHT = Math.round(TRUST_FONT_SIZE * 1.2);
const TRUST_START_SCALE = 1.8;
const TRUST_START_OFFSET = 180;

const BRAND_COPY_GAP = 10;
const TAGLINE_LINE_HEIGHT_RATIO = 1.0;
const BRAND_LINE_HEIGHT_RATIO = 0.92;
const TAGLINE_HEIGHT = TYPOGRAPHY.cardLabel.fontSize * TAGLINE_LINE_HEIGHT_RATIO;
const BRAND_HEIGHT = TYPOGRAPHY.hero.fontSize * 1.3 * BRAND_LINE_HEIGHT_RATIO;
const BLOCK_C_HEIGHT = TAGLINE_HEIGHT + BRAND_COPY_GAP + BRAND_HEIGHT;

const GAP_LOGO_TRUST = 32;
const GAP_TRUST_GROUP = 48;

const BLOCK_C_OFFSET = 20;
const BLOCK_B_OFFSET = BLOCK_C_OFFSET - (BLOCK_C_HEIGHT / 2 + GAP_TRUST_GROUP + TRUST_LINE_HEIGHT / 2);
const BLOCK_A_OFFSET = BLOCK_B_OFFSET - (TRUST_LINE_HEIGHT / 2 + GAP_LOGO_TRUST + LOGO_SIZE / 2);

export const Scene5Ending: React.FC = () => {
  const frame = useCurrentFrame();

  const trustOpacity = interpolate(frame, [SCENE5.trust.enterStart, SCENE5.trust.enterEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const trustScale = interpolate(
    frame,
    [SCENE5.trust.enterStart, SCENE5.trust.enterEnd, SCENE5.trust.holdEnd, SCENE5.trust.shrinkEnd],
    [TRUST_START_SCALE, TRUST_START_SCALE, TRUST_START_SCALE, 1.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE }
  );
  const trustPositionY = interpolate(
    frame,
    [SCENE5.trust.enterStart, SCENE5.trust.enterEnd, SCENE5.trust.holdEnd, SCENE5.trust.shrinkEnd],
    [TRUST_START_OFFSET, TRUST_START_OFFSET, TRUST_START_OFFSET, BLOCK_B_OFFSET],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE }
  );
  const trustColor = interpolateColors(
    frame,
    [SCENE5.trust.holdEnd, SCENE5.trust.shrinkEnd],
    [COLORS.textMain, COLORS.textSub],
    { easing: EASE }
  );

  const taglineOpacity = interpolate(frame, [SCENE5.tagline.enterStart, SCENE5.tagline.enterEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const taglineTranslateY = interpolate(
    frame,
    [SCENE5.tagline.enterStart, SCENE5.tagline.enterEnd],
    [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE }
  );

  const brandOpacity = interpolate(frame, [SCENE5.brand.enterStart, SCENE5.brand.enterEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const brandPunchFrame =
    SCENE5.brand.enterStart + Math.round((SCENE5.brand.enterEnd - SCENE5.brand.enterStart) * 0.6);
  const brandScale =
    frame < brandPunchFrame
      ? interpolate(frame, [SCENE5.brand.enterStart, brandPunchFrame], [0.96, 1.03], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        })
      : interpolate(frame, [brandPunchFrame, SCENE5.brand.enterEnd], [1.03, 1.0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_SETTLE,
        });

  const logoOpacity = interpolate(frame, [SCENE5.logo.enterStart, SCENE5.logo.enterEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const logoTranslateY = interpolate(
    frame,
    [SCENE5.logo.enterStart, SCENE5.logo.enterEnd],
    [-20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE }
  );
  const logoPunchFrame =
    SCENE5.logo.enterStart + Math.round((SCENE5.logo.enterEnd - SCENE5.logo.enterStart) * 0.6);
  const logoScale =
    frame < logoPunchFrame
      ? interpolate(frame, [SCENE5.logo.enterStart, logoPunchFrame], [0.9, 1.02], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        })
      : interpolate(frame, [logoPunchFrame, SCENE5.logo.enterEnd], [1.02, 1.0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE_SETTLE,
        });

  return (
    <AbsoluteFill style={{ background: GRADIENT_BG }}>
      <Img
        src={staticFile('assets/logos/daesanlogo2.png')}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: LOGO_SIZE,
          height: LOGO_SIZE,
          objectFit: 'contain',
          opacity: logoOpacity,
          transform: `translate(-50%, -50%) translateY(${BLOCK_A_OFFSET + logoTranslateY}px) scale(${logoScale})`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translateY(${trustPositionY}px) scale(${trustScale})`,
          opacity: trustOpacity,
          fontSize: TRUST_FONT_SIZE,
          fontFamily: PRETENDARD,
          fontWeight: 500,
          color: trustColor,
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {SCENE5.trust.text}
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translateY(${BLOCK_C_OFFSET}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: BRAND_COPY_GAP,
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineTranslateY}px)`,
            fontSize: TYPOGRAPHY.cardLabel.fontSize,
            fontFamily: PRETENDARD,
            fontWeight: 600,
            lineHeight: TAGLINE_LINE_HEIGHT_RATIO,
            color: TEXT_COLOR,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            margin: 0,
            padding: 0,
          }}
        >
          {SCENE5.tagline.text}
        </div>

        <div
          style={{
            opacity: brandOpacity,
            transform: `scale(${brandScale})`,
            fontSize: TYPOGRAPHY.hero.fontSize * 1.3,
            fontFamily: PRETENDARD,
            letterSpacing: '-0.02em',
            fontWeight: 800,
            lineHeight: BRAND_LINE_HEIGHT_RATIO,
            color: TEXT_COLOR,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            margin: 0,
            padding: 0,
          }}
        >
          {SCENE5.brand.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
