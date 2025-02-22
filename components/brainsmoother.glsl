#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#ifndef DPR
#define DPR 1.0
#endif

const float HALF_PI      = 3.1415926535897932384626433832795 / 2.0;
const float WAVE_SPEED   = 0.5;
const float PULSE_SPEED  = 0.3;
const float RADIUS       = 0.05;
const int   MAX_CURSORS  = 50;
const vec3  COLOR_LINE_1 = vec3( 0.8 * 0.6  ,  1.0 * 0.6  ,  0.9 * 0.6  );
const vec3  COLOR_LINE_2 = vec3(36.0 / 255.0, 40.0 / 255.0, 59.0 / 255.0);
const vec3  COLOR_BG     = vec3( 0.0                                    );

// uniform int uCursorsCount;
// uniform int uCursors[MAX_CURSORS];

/**
 * adapted from https://stackoverflow.com/q/12964279/1137699
 */
float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

/**
 * keep this in sync with CursorManager.tsx
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
 * brainsmoother.glsl
 *
 * ShaderToy fragment shader written with assistance from Claude 3.5 Sonnet
 * for use with `react-shaders` or `shadertoy-react`
 */
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 pos = uv * DPR - 1.0;
    pos.y *= iResolution.x / iResolution.y;

    // define waves falling down the screen like rain on a window
    float wave1 = sin(pos.y * 3.0 + pos.x * 2.0 + (iTime * WAVE_SPEED * 1.0) - HALF_PI) * 0.5;
    float wave2 = sin(pos.y * 5.0 - pos.x * 3.0 + (iTime * WAVE_SPEED * 0.7) - HALF_PI) * 0.3;
    float wave3 = sin(pos.x * 8.0 + pos.y * 4.0 - (iTime * WAVE_SPEED * 0.5) - HALF_PI) * 0.2;
    float displacement = wave1 + wave2 + wave3;
    displacement *= (1.0 - abs(pos.x) * 0.5);

    // set color based on base displacement and all cursor positions
    vec3 color = mix(COLOR_LINE_1, COLOR_LINE_2, abs(displacement) * 2.0 + length(pos) * 0.5);
    for (int i = 0; i < MAX_CURSORS; i++) {
        if (i > uCursorsCount) {
            break;
        }
        vec2 cursorPosition = vec2(
            ((uCursors[i * 2] - 16.0) * DPR),
            (iResolution.y - ((uCursors[i * 2 + 1] - 16.0) * DPR))
        );
        float dist = length(fragCoord - cursorPosition) / iResolution.x;
        float cursorEffect = smoothstep(RADIUS, RADIUS * 0.05, dist);
        displacement = mix(displacement, displacement * (1.0 + cursorEffect), cursorEffect);
        vec3 newBaseColor = mix(COLOR_LINE_1, COLOR_LINE_2, abs(displacement) * 2.0 + length(pos) * 0.5);
        color = mix(color, getCursorColor(i) * 0.3, cursorEffect);
    }

    // fade-in wave phase from -1 to +1, then oscillate between +1 and 0
    float pulsePhase;
    float riseTime = 2.0 * HALF_PI / PULSE_SPEED;
    if (iTime < riseTime) {
        pulsePhase = sin(iTime * PULSE_SPEED - HALF_PI);
    } else {
        float t = smoothstep(0.0, 1.0, (iTime - riseTime) / (2.0 * HALF_PI / PULSE_SPEED));
        float zeroToOne = 0.5 - 0.5 * cos(iTime * PULSE_SPEED);
        pulsePhase = mix(1.0, zeroToOne, t);
    }

    // CRT scanline pattern effect
    float lineWidth = max(0.0, (pulsePhase + 1.0) * 0.25);
    float lines = fract(uv.y * 300.0 + displacement);
    float pattern = smoothstep(0.0, lineWidth, lines) *
                    smoothstep(lineWidth * 2.0, lineWidth, lines);
    color = mix(color, COLOR_BG, 1.0 - pattern);

    // noise
    color += random(pos + iTime * 0.1) * 0.02;

    fragColor = vec4(color, 1.0);
}
