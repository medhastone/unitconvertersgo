"use client";

import { useEffect, useRef, useState } from "react";

const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutes gap between flights
const INITIAL_DELAY_MS = 3500; // First flight after page hydration & LCP settle
const FLIGHT_DURATION_MS = 5800; // 5.8s brisk flight from right middle to left
const STORAGE_KEY_LAST_FLIGHT = "ucg_eagle_last_flight_ts";

export default function EagleFlyby() {
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect user reduced-motion accessibility preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let initialTimer: ReturnType<typeof setTimeout> | null = null;
    let intervalTimer: ReturnType<typeof setInterval> | null = null;

    const triggerFlight = () => {
      if (document.visibilityState === "hidden") return;
      try {
        window.sessionStorage.setItem(
          STORAGE_KEY_LAST_FLIGHT,
          String(Date.now())
        );
      } catch {
        // Ignore storage errors
      }
      setIsFlying(true);
    };

    // Determine when the next flight should occur across page navigations
    let delayToNextFlight = INITIAL_DELAY_MS;
    try {
      const savedTs = Number(
        window.sessionStorage.getItem(STORAGE_KEY_LAST_FLIGHT)
      );
      if (Number.isFinite(savedTs) && savedTs > 0) {
        const elapsed = Date.now() - savedTs;
        delayToNextFlight =
          elapsed >= FIVE_MINUTES_MS
            ? INITIAL_DELAY_MS
            : Math.max(INITIAL_DELAY_MS, FIVE_MINUTES_MS - elapsed);
      }
    } catch {
      delayToNextFlight = INITIAL_DELAY_MS;
    }

    initialTimer = setTimeout(() => {
      triggerFlight();
      intervalTimer = setInterval(triggerFlight, FIVE_MINUTES_MS);
    }, delayToNextFlight);

    return () => {
      if (initialTimer) clearTimeout(initialTimer);
      if (intervalTimer) clearInterval(intervalTimer);
    };
  }, []);

  useEffect(() => {
    if (!isFlying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateCanvasSize = () => {
      if (!canvas) return;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize, { passive: true });

    const startTime = performance.now();

    const drawWing = (
      c: CanvasRenderingContext2D,
      flapAngle: number,
      wristFlex: number,
      isFarWing: boolean
    ) => {
      c.save();

      // Scale & shade differently for the far (background) wing vs near (foreground) wing
      const wingScaleY = Math.sin(flapAngle);
      const absLift = wingScaleY;
      const baseColor = isFarWing ? "#1E130C" : "#352216";
      const midColor = isFarWing ? "#2B1B11" : "#4A301F";
      const tipColor = isFarWing ? "#140C07" : "#1F130B";

      if (isFarWing) {
        c.translate(-6, -10 + absLift * 6);
        c.scale(0.84, 0.84);
      } else {
        c.translate(4, 2);
      }

      // Shoulder to carpal (wrist) joint coordinates
      const carpalX = 16;
      const carpalY = -44 * absLift - 8;
      // Wingtip coordinates with natural wrist lag
      const tipX = 52;
      const tipY = carpalY - 38 * Math.sin(flapAngle - wristFlex) - 6;

      // 1. Primary flight feathers (slotted raptor wingtip fingers)
      const numPrimaries = 7;
      for (let i = 0; i < numPrimaries; i++) {
        const t = i / (numPrimaries - 1);
        const featherLen = 36 - t * 14;
        const spreadAngle = -0.35 + t * 0.65;
        const fTipX =
          carpalX +
          (tipX - carpalX) * (1 - t * 0.45) +
          Math.sin(spreadAngle) * featherLen;
        const fTipY =
          carpalY +
          (tipY - carpalY) * (1 - t * 0.42) +
          Math.cos(spreadAngle) * featherLen * (absLift * 0.55 - 0.35);

        c.beginPath();
        c.moveTo(carpalX + t * 8, carpalY + t * 5);
        c.quadraticCurveTo(
          (carpalX + fTipX) * 0.5 + 4,
          (carpalY + fTipY) * 0.5 - 3 * absLift,
          fTipX,
          fTipY
        );
        c.quadraticCurveTo(
          (carpalX + fTipX) * 0.5 + 9,
          (carpalY + fTipY) * 0.5 + 4,
          carpalX + t * 10 + 6,
          carpalY + t * 6 + 5
        );
        c.closePath();
        c.fillStyle = tipColor;
        c.fill();
      }

      // 2. Main wing membrane & secondary feathers
      const wingGrad = c.createLinearGradient(0, 0, tipX, tipY);
      wingGrad.addColorStop(0, baseColor);
      wingGrad.addColorStop(0.65, midColor);
      wingGrad.addColorStop(1, tipColor);

      c.beginPath();
      c.moveTo(-14, -2); // Leading edge root near shoulder
      c.quadraticCurveTo(0, carpalY * 0.65 - 6, carpalX, carpalY);
      c.quadraticCurveTo(
        (carpalX + tipX) * 0.5,
        (carpalY + tipY) * 0.5 - 4,
        tipX,
        tipY
      );
      // Scalloped trailing edge of secondary feathers back to body root
      c.quadraticCurveTo(carpalX + 26, carpalY * 0.55 + 16, 24, 6);
      c.quadraticCurveTo(6, 8, -14, -2);
      c.closePath();
      c.fillStyle = wingGrad;
      c.fill();

      // 3. Subtle covert feather highlight lines on the near wing
      if (!isFarWing) {
        c.strokeStyle = "rgba(217, 171, 126, 0.22)";
        c.lineWidth = 1.1;
        for (let k = 0; k < 5; k++) {
          const kt = k / 4;
          c.beginPath();
          c.moveTo(-6 + kt * 22, kt * 3);
          c.quadraticCurveTo(
            4 + kt * 24,
            carpalY * (0.45 - kt * 0.05),
            14 + kt * 24,
            carpalY * (0.35 - kt * 0.04) + 8
          );
          c.stroke();
        }
      }

      c.restore();
    };

    const drawEagle = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      elapsedSec: number
    ) => {
      c.save();
      c.translate(x, y);

      // Brisk flap-and-glide rhythm matched to faster forward speed:
      // 2.4 seconds of energetic wingbeats followed by 0.9 seconds of soaring thermal glide
      const cyclePos = elapsedSec % 3.3;
      let flapAngle = 0;
      let wristFlex = 0;
      let bodyBobY = 0;
      let pitchAngle = -0.03;

      if (cyclePos < 2.4) {
        // Active wingbeats (~2.5 Hz)
        const phase = (cyclePos / 2.4) * Math.PI * 6;
        flapAngle = Math.sin(phase) * 0.92 + 0.12;
        wristFlex = Math.cos(phase) * 0.38;
        bodyBobY = Math.cos(phase) * 3.5;
        pitchAngle = -0.02 + Math.sin(phase) * 0.035;
      } else {
        // Smooth transition into outstretched soaring glide
        const glideT = (cyclePos - 2.4) / 0.9;
        const easeGlide = Math.sin(glideT * Math.PI);
        flapAngle = 0.28 + easeGlide * 0.08;
        wristFlex = -0.1;
        bodyBobY = -easeGlide * 2;
        pitchAngle = -0.04;
      }

      c.translate(0, bodyBobY);
      c.rotate(pitchAngle);

      // Soft atmospheric shadow beneath the eagle
      c.save();
      c.translate(6, 22);
      c.scale(1.2, 0.35);
      const shadowGrad = c.createRadialGradient(0, 0, 4, 0, 0, 48);
      shadowGrad.addColorStop(0, "rgba(15, 23, 42, 0.16)");
      shadowGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
      c.fillStyle = shadowGrad;
      c.beginPath();
      c.arc(0, 0, 48, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // 1. Far Wing (background right wing)
      drawWing(c, flapAngle, wristFlex, true);

      // 2. Fanned White Tail Feathers (trailing to the right)
      c.save();
      const tailGrad = c.createLinearGradient(24, 0, 58, 4);
      tailGrad.addColorStop(0, "#E2E8F0");
      tailGrad.addColorStop(0.3, "#F8FAFC");
      tailGrad.addColorStop(1, "#FFFFFF");

      c.beginPath();
      c.moveTo(22, -4);
      c.lineTo(56, -12);
      c.quadraticCurveTo(62, -1, 55, 10);
      c.lineTo(22, 5);
      c.closePath();
      c.fillStyle = tailGrad;
      c.fill();

      // Subtle tail feather ribs
      c.strokeStyle = "rgba(148, 163, 184, 0.45)";
      c.lineWidth = 0.8;
      for (let t = -2; t <= 2; t++) {
        c.beginPath();
        c.moveTo(24, t * 1.5);
        c.lineTo(55, t * 4.2);
        c.stroke();
      }
      c.restore();

      // 3. Tucked Golden Talons under tail base
      c.save();
      c.fillStyle = "#F59E0B";
      c.beginPath();
      c.ellipse(22, 9, 4.5, 2, 0.2, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // 4. Sculpted Dark Brown Eagle Torso
      const bodyGrad = c.createLinearGradient(-26, -10, 28, 12);
      bodyGrad.addColorStop(0, "#3E2719");
      bodyGrad.addColorStop(0.55, "#2C1B10");
      bodyGrad.addColorStop(1, "#1D120B");

      c.beginPath();
      c.moveTo(-26, -2);
      c.quadraticCurveTo(-6, -13, 25, -4);
      c.quadraticCurveTo(30, 1, 24, 6);
      c.quadraticCurveTo(-4, 14, -26, 4);
      c.closePath();
      c.fillStyle = bodyGrad;
      c.fill();

      // 5. Iconic Snow-White Bald Eagle Head & Neck Hackles (facing left)
      const headGrad = c.createLinearGradient(-44, -8, -18, 6);
      headGrad.addColorStop(0, "#FFFFFF");
      headGrad.addColorStop(0.75, "#F8FAFC");
      headGrad.addColorStop(1, "#CBD5E1");

      c.beginPath();
      c.moveTo(-18, -8);
      c.quadraticCurveTo(-33, -11, -42, -4);
      c.quadraticCurveTo(-45, 1, -39, 5);
      c.quadraticCurveTo(-29, 8, -18, 5);
      // Zig-zag hackle feather border where white head meets dark brown collar
      c.lineTo(-21, 2);
      c.lineTo(-16, 0);
      c.lineTo(-21, -3);
      c.lineTo(-16, -5);
      c.closePath();
      c.fillStyle = headGrad;
      c.fill();

      // 6. Hooked Golden Raptor Beak (pointing left)
      const beakGrad = c.createLinearGradient(-53, -3, -40, 3);
      beakGrad.addColorStop(0, "#D97706");
      beakGrad.addColorStop(0.4, "#F59E0B");
      beakGrad.addColorStop(1, "#FBBF24");

      c.beginPath();
      c.moveTo(-41, -4.5);
      c.quadraticCurveTo(-50, -4.5, -53, 1.5); // Sharp downward hook tip
      c.quadraticCurveTo(-50, 3.5, -48, 1.2);
      c.lineTo(-40, 2.5);
      c.closePath();
      c.fillStyle = beakGrad;
      c.fill();

      // Fierce Eagle Eye & Brow Ridge
      c.fillStyle = "#FEF08A";
      c.beginPath();
      c.arc(-36.5, -2.2, 1.5, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = "#0F172A";
      c.beginPath();
      c.arc(-36.8, -2.2, 0.8, 0, Math.PI * 2);
      c.fill();

      // Supraorbital brow shadow
      c.strokeStyle = "#475569";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(-39.5, -3.6);
      c.lineTo(-34.2, -3.1);
      c.stroke();

      // 7. Near Wing (foreground left wing)
      drawWing(c, flapAngle, wristFlex, false);

      c.restore();
    };

    const renderFrame = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed >= FLIGHT_DURATION_MS) {
        setIsFlying(false);
        return;
      }

      const progress = elapsed / FLIGHT_DURATION_MS;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      // Start from middle of the right side (vh * 0.48) and fly smoothly to the left side
      const startX = vw + 110;
      const endX = -130;
      const currentX = startX + (endX - startX) * progress;

      // Gentle natural altitude wave around the vertical middle
      const baseMidY = vh * 0.47;
      const currentY =
        baseMidY +
        Math.sin(progress * Math.PI * 2.2) * 26 -
        progress * 18;

      drawEagle(ctx, currentX, currentY, elapsed / 1000);

      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    animationFrameId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isFlying]);

  if (!isFlying) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-40 w-screen h-screen pointer-events-none select-none"
    />
  );
}
