#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

const float HALF_PI = 3.14159265359 / 2.0;
const float WAVE_SPEED  = 0.5;
const float PULSE_SPEED = 0.3;
const vec3 COLOR_LINE_1 = vec3( 0.8 * 0.6  ,  1.0 * 0.6  ,  0.9 * 0.6  );
const vec3 COLOR_LINE_2 = vec3(36.0 / 255.0, 40.0 / 255.0, 59.0 / 255.0);
const vec3 COLOR_BG     = vec3( 0.0                                    );

/**
 * adapted from https://stackoverflow.com/q/12964279/1137699
 */
float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

/**
 * written with assistance from Claude 3.5 Sonnet
 */
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution;
    vec2 pos = uv * 2.0 - 1.0;
    pos.y *= iResolution.x / iResolution.y;

    float wave1 = sin(pos.y * 3.0 + pos.x * 2.0 + (iTime * WAVE_SPEED * 1.0) - HALF_PI) * 0.5;
    float wave2 = sin(pos.y * 5.0 - pos.x * 3.0 + (iTime * WAVE_SPEED * 0.7) - HALF_PI) * 0.3;
    float wave3 = sin(pos.x * 8.0 + pos.y * 4.0 - (iTime * WAVE_SPEED * 0.5) - HALF_PI) * 0.2;

    float displacement = wave1 + wave2 + wave3;
    displacement *= (1.0 - abs(pos.x) * 0.5);

    float pulsePhase = sin(iTime * PULSE_SPEED - HALF_PI);
    float lineWidth = max(0.0, (pulsePhase + 1.0) * 0.25);
    float lines = fract(uv.y * 300.0 + displacement);
    float pattern = smoothstep(0.0, lineWidth, lines) *
            smoothstep(lineWidth * 2.0, lineWidth, lines);

    vec3 color = mix(COLOR_LINE_1, COLOR_LINE_2, abs(displacement) * 2.0 + length(pos) * 0.5);
    color = mix(color, COLOR_BG, 1.0 - pattern);
    color += random(pos + iTime * 0.1) * 0.02; // noise

    fragColor = vec4(color, 1.0);
}
