precision lowp float;

#ifndef DPR
#define DPR 1.0
#endif

// uniform int uCursorsCount;
// uniform int uCursors[MAX_CURSORS];

const float HALF_PI         = 1.5707963267948966;
const float WAVE_SPEED      = 0.5;
const float PULSE_SPEED     = 0.3;
const float RADIUS          = 0.1;
const int   MAX_CURSORS     = 50;
const float CURSOR_HEIGHT   = 16.0;
const float CURSOR_WIDTH    = 16.0;
const vec3  COLOR_LINE_1    = vec3( 0.8 * 0.6  ,  1.0 * 0.6  ,  0.9 * 0.6  );
const vec3  COLOR_LINE_2    = vec3(36.0 / 255.0, 40.0 / 255.0, 59.0 / 255.0);
const vec3  COLOR_BG        = vec3( 0.0                                    );

/**
 * keep these colors in sync with CursorManager.tsx
 */
vec3 getCursorColor(int i) {
    int index = i - (i / 7) * 7;
    if (index == 0) return vec3(0.898, 0.451, 0.451);
    if (index == 1) return vec3(0.584, 0.459, 0.804);
    if (index == 2) return vec3(0.306, 0.765, 0.969);
    if (index == 3) return vec3(0.506, 0.780, 0.518);
    if (index == 4) return vec3(1.000, 0.945, 0.463);
    if (index == 5) return vec3(1.000, 0.541, 0.396);
    if (index == 6) return vec3(0.941, 0.384, 0.573);
                    return vec3(0.475, 0.525, 0.796);
}

/**
 * adapted from https://stackoverflow.com/q/12964279/1137699
 */
float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

/**
 * via https://github.com/hughsk/glsl-luma/blob/de229e17fbfd64fc1b1e15158b392010f4bd32c2/index.glsl
 * under MIT License
 */
float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

/**
 * brainsmoother.glsl
 *
 * Theo Pak <theopak@gmail.com>
 * MIT License. Includes AI contributions.
 *
 * ShaderToy fragment shader for use with react-shaders or shadertoy-react.
 * I want to give the effect of soothing rain falling down the screen, or
 * maybe the back of the Daft Punk "Homework" jacket, with a little ambiguity.
 * Multiplayer cursors drop color effects to create some sense of emotional
 * interaction. There's a CRT scanline effect to fuzz out the otherwise very
 * basic patterns, which also gives great performance benefits due to skipping
 * every other row of pixels. There's a dramatic Matrix-inspired entry fade
 * which allows this shader to fade in from black after loading lazily.
 */
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // for fade-in, calculate impulse that goes from -1 to +1 then oscillates between +1 and 0
    float pulsePhase;
    float riseTime = 2.0 * HALF_PI / PULSE_SPEED;
    if (iTime < riseTime) {
        pulsePhase = sin(iTime * PULSE_SPEED - HALF_PI);
    } else {
        float t = smoothstep(0.0, 1.0, (iTime - riseTime) / (2.0 * HALF_PI / PULSE_SPEED));
        float zeroToOne = 0.5 - 0.5 * cos(iTime * PULSE_SPEED);
        pulsePhase = mix(1.0, zeroToOne, t);
    }

    // normalize coordinates
    vec2 uv = fragCoord / iResolution.xy;
    vec2 pos = uv * DPR - 1.0;
    pos.y *= iResolution.x / iResolution.y;

    // displacement map defining waves falling down the screen
    float timeOffset = iTime * WAVE_SPEED;
    float wave1 = sin(pos.y * 3.0 + pos.x * 2.0 + timeOffset * 1.0 - HALF_PI) * 0.5;
    float wave2 = sin(pos.y * 5.0 - pos.x * 3.0 + timeOffset * 0.7 - HALF_PI) * 0.3;
    float wave3 = sin(pos.x * 8.0 + pos.y * 4.0 - timeOffset * 0.5 - HALF_PI) * 0.2;
    float displacement = (wave1 + wave2 + wave3) * (1.0 - abs(pos.x) * 0.5);

    // CRT scanline pattern effect
    float lineWidth = max(0.0, (pulsePhase + 1.0) * 0.25);
    float lines = fract(uv.y * 300.0 + displacement);
    float crtPattern = smoothstep(0.0, lineWidth, lines) *
                       smoothstep(lineWidth * 2.0, lineWidth, lines);

    // for performance, early exit using the CRT pattern
    if (iTime < riseTime && crtPattern <= 0.001) {
        fragColor = vec4(COLOR_BG, 1.0);
        return;
    }

    // set color based on base displacement and all cursor positions
    vec3 color = mix(COLOR_LINE_1, COLOR_LINE_2, abs(displacement) * 2.0 + length(pos) * 0.5);
    float luminance = pow(luma(color) * 1.2, 1.5);
    for (int i = 0; i < MAX_CURSORS; i++) {
        if (i >= uCursorsCount) break;
        vec2 cursorPosition = vec2(
            ((uCursors[i * 2] - CURSOR_WIDTH) * DPR),
            (iResolution.y - ((uCursors[i * 2 + 1] - CURSOR_HEIGHT) * DPR))
        );
        float distance = length(fragCoord - cursorPosition) / iResolution.x;
        if (distance >= RADIUS) continue;
        float cursorEffect = smoothstep(RADIUS, RADIUS * 0.05, distance);
        displacement = mix(displacement, displacement * (1.0 + cursorEffect), cursorEffect);
        color = mix(color, getCursorColor(i) * luminance, cursorEffect * luminance);
    }

    // post-processing
    color = mix(color, COLOR_BG, 1.0 - crtPattern);
    color += random(pos + iTime * 0.1) * 0.02;
    fragColor = vec4(color, 1.0);
}
