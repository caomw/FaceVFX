#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex, mask;
uniform vec2 direction;
uniform int strength;
uniform ivec2 ciWindowSize;

in highp vec2 TexCoord;
out highp vec4   Color;

void main() {
    vec2 dir = direction / vec2(ciWindowSize);
    vec4 sum = texture(tex, TexCoord);
    int i;
    for(i = 1; i < strength; i++) {
        vec2 curOffset = float(i) * dir;
        vec4 leftMask = texture(mask, TexCoord - curOffset);
        vec4 rightMask = texture(mask, TexCoord + curOffset);
        bool valid = leftMask.r == 1. && rightMask.r == 1.;
        if(valid) {
            sum +=
                texture(tex, TexCoord + curOffset) +
                texture(tex, TexCoord - curOffset);
        } else {
            break;
        }
    }
    int samples = 1 + (i - 1) * 2;
    Color = sum / float(samples);
}