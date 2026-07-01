"use client";

import { useEffect, useRef } from "react";

/**
 * ShaderBackground
 * ----------------
 * A premium, ultra-smooth animated WebGL fragment shader that paints the
 * MB Tech Labs palette as soft flowing liquid light, with subtle film grain
 * and soft vignette. Uses raw WebGL for maximum performance and zero
 * heavy dependencies.
 *
 * Palette mapped into the shader:
 *   - Deep navy base   #151D3B
 *   - Dark surface     #1B2454
 *   - Primary cyan     #25D6FF
 *   - Soft cyan        #5EDBFF
 */
export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", {
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      canvas.style.background =
        "radial-gradient(1200px 800px at 20% 10%, #1B2454 0%, #151D3B 60%)";
      return;
    }

    const vertexShaderSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash(i + vec2(0.0, 0.0));
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = rot * p * 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv;
        float aspect = u_resolution.x / u_resolution.y;
        p.x *= aspect;

        float t = u_time * 0.035;

        vec2 q = vec2(
          fbm(p * 1.1 + vec2(0.0, t)),
          fbm(p * 1.1 + vec2(5.2, 1.3) + vec2(t * 0.6, 0.0))
        );
        vec2 r = vec2(
          fbm(p * 1.4 + q * 1.8 + vec2(1.7, 9.2) + t * 0.4),
          fbm(p * 1.4 + q * 1.8 + vec2(8.3, 2.8) + t * 0.3)
        );
        float f = fbm(p * 0.9 + r * 1.6);

        vec2 m = u_mouse / u_resolution.xy;
        m.x *= aspect;
        float md = distance(p, m);
        float mouseGlow = smoothstep(0.55, 0.0, md) * 0.18;

        vec3 ink      = vec3(0.082, 0.114, 0.231);
        vec3 ink2     = vec3(0.106, 0.141, 0.329);
        vec3 cyan     = vec3(0.145, 0.839, 1.000);
        vec3 cyanSoft = vec3(0.369, 0.858, 1.000);

        vec3 col = mix(ink, ink2, smoothstep(0.2, 0.85, f));

        float ribbon = smoothstep(0.55, 0.92, f);
        col = mix(col, cyan, ribbon * 0.35);

        float ridge = smoothstep(0.45, 0.7, r.x) * smoothstep(0.7, 0.4, r.y);
        col += cyanSoft * ridge * 0.18;

        col += cyanSoft * mouseGlow;

        float topLight = smoothstep(1.1, 0.2, uv.y) * 0.10;
        col += cyanSoft * topLight;

        float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
        col *= 0.55 + 0.45 * vig;

        float grain = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.045;
        col += grain;

        col = pow(col, vec3(0.95));

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, vertexShaderSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    function onMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) * window.devicePixelRatio;
      targetMouse.y =
        (rect.height - (e.clientY - rect.top)) * window.devicePixelRatio;
    }
    window.addEventListener("mousemove", onMove, { passive: true });

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    function render() {
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      const time = (performance.now() - start) / 1000;
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.uniform1f(uTime, time);
      gl!.uniform2f(uMouse, mouse.x, mouse.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    }
    render();

    function onVis() {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else if (!rafRef.current) {
        render();
      }
    }
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "#151D3B" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ display: "block" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(21,29,59,0.55) 0%, rgba(21,29,59,0) 28%, rgba(21,29,59,0) 70%, rgba(21,29,59,0.85) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "220px 220px",
        }}
      />
    </div>
  );
}
