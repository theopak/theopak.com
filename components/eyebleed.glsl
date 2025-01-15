#define PI 3.14159265358

float sinNorm(float val) {
    return (sin(val) + 1.0) * 0.5;
}

float str(float ratio, float toff) {
    return sinNorm(toff * 2.0 * PI * ratio);
}

float moire(vec2 uv, float phase) {
    float toff = phase;
    float radius = 0.0; // Radius of the circular motion

    // Get normalized mouse position
    vec2 mousePos = iMouse.xy / iResolution.xy;
    // If mouse hasn't been clicked yet, use center position
    mousePos = iMouse.z < 0.5 ? vec2(0.5, 0.5) : mousePos;

    // Center1 now moves in a circle around the mouse position
    vec2 center1 = vec2(
            cos(toff * 2.0 * PI) * radius + mousePos.x,
            sin(toff * 2.0 * PI) * radius + mousePos.y
        );

    // vec2 center1 = vec2(str(1.0, toff) * 0.5, str(1.3, toff) * 0.3) + vec2(0.5, 0.5);
    vec2 center2 = vec2(str(0.2, toff) * 0.2, str(0.1, toff) * 0.4) - vec2(0.5, 0.5);
    // vec2 center3 = vec2(str(2.0, toff) * 0.3, str(1.0, toff) * 0.35) + vec2(0.5, 0.5);
    // vec2 center4 = vec2(str(1.0, toff) * 1.5, str(0.2, toff)) - vec2(0.5, 0.5);

    float angle1 = atan(uv.y - center1.y, uv.x - center1.x);
    float angle2 = atan(uv.y - center2.y, uv.x - center2.x);

    float patternScale = 150.0 * DPR;
    float dist1 = length(uv - center1) * patternScale + angle1 * 5.0;
    float dist2 = length(uv - center2) * patternScale + angle2 * 5.0;
    // float dist3 = length(uv - center3) * patternScale;
    // float dist4 = length(uv - center4) * patternScale;

    float c = sinNorm(dist1 + 1.5 * sinNorm(dist2));
    // float c2 = sinNorm(dist3 + sinNorm(dist4));

    // float cavg = (c + c2) * 0.5;
    float cavg = c;
    // c = 1.0 - smoothstep(ceil(min(c, c2) - 0.5), 1.0 - cavg, 0.5);
    c = 1.0 - smoothstep(ceil(c - 0.5), 1.0 - cavg, 0.5);

    return c;
}

/**
 * adapted from https://www.shadertoy.com/view/lsGSDw
 */
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;

    // Slow down the animation
    float timeScale = 0.05;

    float c = 0.0;
    for (float i = 0.0; i < 4.0; i += 1.0) {
        float p1 = mod((iTime + i * 0.5) * timeScale, 1.0);
        c = max(c, moire(uv, p1 * 0.25) * sin(p1 * PI));
    }

    // two-color pattern
    vec3 nearBlack = vec3(0.28, 0.28, 0.29);
    vec3 nearWhite = vec3(0.76, 0.76, 0.75);

    // fade-in
    float fadeInDuration = 0.750;
    float fadeInProgress = clamp(iTime / fadeInDuration, 0.0, 1.0);

    // interpolate color based on pattern and fade progress
    vec3 color = mix(nearBlack, nearWhite, c);
    color = mix(nearBlack, color, fadeInProgress);

    // output
    fragColor = vec4(color, 1.0);
}
