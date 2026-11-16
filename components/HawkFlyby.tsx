"use client";

import { useEffect, useRef, useState } from "react";

const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutes gap between flights
const INITIAL_DELAY_MS = 9500; // First flight after page hydration, LCP & TBT settle
const INTERACTION_DELAY_MS = 1800; // Fast trigger once user interacts
const FLIGHT_DURATION_MS = 2900; // 2.9s fast, agile hawk flight from right middle to left
const STORAGE_KEY_LAST_FLIGHT = "ucg_hawk_last_flight_ts";

export default function HawkFlyby() {
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
    let startedSchedule = false;

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

    const scheduleFlight = (baseDelay: number) => {
      if (startedSchedule) return;
      startedSchedule = true;
      let delayToNextFlight = baseDelay;
      try {
        const savedTs = Number(
          window.sessionStorage.getItem(STORAGE_KEY_LAST_FLIGHT)
        );
        if (Number.isFinite(savedTs) && savedTs > 0) {
          const elapsed = Date.now() - savedTs;
          delayToNextFlight =
            elapsed >= FIVE_MINUTES_MS
              ? baseDelay
              : Math.max(baseDelay, FIVE_MINUTES_MS - elapsed);
        }
      } catch {
        delayToNextFlight = baseDelay;
      }

      if (initialTimer) clearTimeout(initialTimer);
      initialTimer = setTimeout(() => {
        triggerFlight();
        intervalTimer = setInterval(triggerFlight, FIVE_MINUTES_MS);
      }, delayToNextFlight);
    };

    const onUserInteract = () => {
      scheduleFlight(INTERACTION_DELAY_MS);
    };

    const events = ["pointermove", "scroll", "touchstart", "keydown"];
    for (const evt of events) {
      window.addEventListener(evt, onUserInteract, { passive: true, once: true });
    }

    initialTimer = setTimeout(() => {
      scheduleFlight(0);
    }, INITIAL_DELAY_MS);

    return () => {
      for (const evt of events) {
        window.removeEventListener(evt, onUserInteract);
      }
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

    const drawHawkWing = (
      c: CanvasRenderingContext2D,
      flapAngle: number,
      wristFlex: number,
      isFarWing: boolean
    ) => {
      c.save();

      // Scale & shade differently for the far (background) wing vs near (foreground) wing
      const wingScaleY = Math.sin(flapAngle);
      const absLift = wingScaleY;
      const baseColor = isFarWing ? "#3B2214" : "#6B3E23";
      const midColor = isFarWing ? "#4D2E1B" : "#8A5230";
      const tipColor = isFarWing ? "#1A0F09" : "#28170E";

      if (isFarWing) {
        c.translate(-5, -9 + absLift * 6);
        c.scale(0.84, 0.84);
      } else {
        c.translate(4, 1);
      }

      // Sleek, swept-back hawk shoulder to carpal (wrist) joint
      const carpalX = 19;
      const carpalY = -42 * absLift - 7;
      // Tapered, agile hawk wingtip with crisp wrist snap
      const tipX = 56;
      const tipY = carpalY - 34 * Math.sin(flapAngle - wristFlex) - 5;

      // 1. Tapered primary flight feathers (agile hawk wingtip)
      const numPrimaries = 6;
      for (let i = 0; i < numPrimaries; i++) {
        const t = i / (numPrimaries - 1);
        const featherLen = 32 - t * 13;
        const spreadAngle = -0.25 + t * 0.55;
        const fTipX =
          carpalX +
          (tipX - carpalX) * (1 - t * 0.42) +
          Math.sin(spreadAngle) * featherLen;
        const fTipY =
          carpalY +
          (tipY - carpalY) * (1 - t * 0.4) +
          Math.cos(spreadAngle) * featherLen * (absLift * 0.5 - 0.3);

        c.beginPath();
        c.moveTo(carpalX + t * 7, carpalY + t * 4);
        c.quadraticCurveTo(
          (carpalX + fTipX) * 0.5 + 3,
          (carpalY + fTipY) * 0.5 - 2.5 * absLift,
          fTipX,
          fTipY
        );
        c.quadraticCurveTo(
          (carpalX + fTipX) * 0.5 + 8,
          (carpalY + fTipY) * 0.5 + 3.5,
          carpalX + t * 9 + 5,
          carpalY + t * 5 + 4
        );
        c.closePath();
        c.fillStyle = tipColor;
        c.fill();
      }

      // 2. Main hawk wing covert & secondary plumage
      const wingGrad = c.createLinearGradient(0, 0, tipX, tipY);
      wingGrad.addColorStop(0, baseColor);
      wingGrad.addColorStop(0.55, midColor);
      wingGrad.addColorStop(1, tipColor);

      c.beginPath();
      c.moveTo(-13, -2); // Leading edge root near shoulder
      c.quadraticCurveTo(2, carpalY * 0.65 - 5, carpalX, carpalY);
      c.quadraticCurveTo(
        (carpalX + tipX) * 0.5,
        (carpalY + tipY) * 0.5 - 3,
        tipX,
        tipY
      );
      // Tapered trailing edge of secondary feathers back to body root
      c.quadraticCurveTo(carpalX + 24, carpalY * 0.52 + 13, 22, 5);
      c.quadraticCurveTo(5, 7, -13, -2);
      c.closePath();
      c.fillStyle = wingGrad;
      c.fill();

      // 3. Tawny & buff hawk wing barring on near wing
      if (!isFarWing) {
        c.strokeStyle = "rgba(245, 222, 195, 0.34)";
        c.lineWidth = 1.25;
        for (let k = 0; k < 5; k++) {
          const kt = k / 4;
          c.beginPath();
          c.moveTo(-4 + kt * 22, kt * 2.5);
          c.quadraticCurveTo(
            6 + kt * 24,
            carpalY * (0.42 - kt * 0.05),
            16 + kt * 24,
            carpalY * (0.33 - kt * 0.04) + 7
          );
          c.stroke();
        }
      }

      c.restore();
    };

    const drawHawk = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      elapsedSec: number
    ) => {
      c.save();
      c.translate(x, y);

      // Fast, energetic hawk wingbeat rhythm matched to high forward speed:
      // 1.25s rapid wingbeats (~4.4 Hz) followed by 0.6s sleek swept-wing stoop/glide
      const cyclePos = elapsedSec % 1.85;
      let flapAngle = 0;
      let wristFlex = 0;
      let bodyBobY = 0;
      let pitchAngle = -0.06;

      if (cyclePos < 1.25) {
        // Rapid, snappy hawk wingbeats (~4.4 Hz)
        const phase = (cyclePos / 1.25) * Math.PI * 11;
        flapAngle = Math.sin(phase) * 0.96 + 0.1;
        wristFlex = Math.cos(phase) * 0.42;
        bodyBobY = Math.cos(phase) * 3.0;
        pitchAngle = -0.05 + Math.sin(phase) * 0.03;
      } else {
        // Sleek swept-back high-speed glide
        const glideT = (cyclePos - 1.25) / 0.6;
        const easeGlide = Math.sin(glideT * Math.PI);
        flapAngle = 0.22 + easeGlide * 0.06;
        wristFlex = -0.14;
        bodyBobY = -easeGlide * 1.5;
        pitchAngle = -0.07;
      }

      c.translate(0, bodyBobY);
      c.rotate(pitchAngle);

      // Soft speed shadow beneath the hawk
      c.save();
      c.translate(8, 20);
      c.scale(1.15, 0.3);
      const shadowGrad = c.createRadialGradient(0, 0, 4, 0, 0, 42);
      shadowGrad.addColorStop(0, "rgba(15, 23, 42, 0.14)");
      shadowGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
      c.fillStyle = shadowGrad;
      c.beginPath();
      c.arc(0, 0, 42, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // 1. Far Wing (background right wing)
      drawHawkWing(c, flapAngle, wristFlex, true);

      // 2. Classic Rufous Red-Tailed Hawk Tail with Dark Subterminal Band
      c.save();
      const tailGrad = c.createLinearGradient(20, 0, 56, 3);
      tailGrad.addColorStop(0, "#7C2D12");
      tailGrad.addColorStop(0.45, "#C2410C");
      tailGrad.addColorStop(0.84, "#B45309");
      tailGrad.addColorStop(0.92, "#29180D"); // Dark subterminal band
      tailGrad.addColorStop(1, "#FDE68A"); // Narrow buff tip

      c.beginPath();
      c.moveTo(20, -3.5);
      c.lineTo(54, -9.5);
      c.quadraticCurveTo(59, 0, 53, 8.5);
      c.lineTo(20, 4);
      c.closePath();
      c.fillStyle = tailGrad;
      c.fill();

      // Subtle tail feather ribs
      c.strokeStyle = "rgba(67, 20, 7, 0.4)";
      c.lineWidth = 0.75;
      for (let t = -2; t <= 2; t++) {
        c.beginPath();
        c.moveTo(22, t * 1.2);
        c.lineTo(53, t * 3.2);
        c.stroke();
      }
      c.restore();

      // 3. Tucked Golden Talons under tail base
      c.save();
      c.fillStyle = "#F59E0B";
      c.beginPath();
      c.ellipse(20, 7.5, 4, 1.8, 0.2, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // 4. Sculpted Hawk Torso (russet-brown back & barred cream/buff breast)
      const bodyGrad = c.createLinearGradient(-22, -10, 12, 11);
      bodyGrad.addColorStop(0, "#5A321C");
      bodyGrad.addColorStop(0.48, "#7C4728");
      bodyGrad.addColorStop(0.66, "#D6B08C");
      bodyGrad.addColorStop(1, "#F5E6D3");

      c.beginPath();
      c.moveTo(-25, -2);
      c.quadraticCurveTo(-5, -11, 24, -3.5);
      c.quadraticCurveTo(28, 1, 22, 5.5);
      c.quadraticCurveTo(-5, 11.5, -24, 4);
      c.closePath();
      c.fillStyle = bodyGrad;
      c.fill();

      // Subtle dark brown belly/breast barring streaks (characteristic hawk belly band)
      c.strokeStyle = "rgba(69, 34, 15, 0.45)";
      c.lineWidth = 1;
      for (let b = 0; b < 4; b++) {
        const bx = -6 + b * 4.5;
        c.beginPath();
        c.moveTo(bx, 4.5);
        c.lineTo(bx + 2, 7.2);
        c.stroke();
      }

      // 5. Streaked Rufous-Brown Hawk Head & Cream Cheek/Throat (facing left)
      const headGrad = c.createLinearGradient(-40, -9, -18, 6);
      headGrad.addColorStop(0, "#4A2A18");
      headGrad.addColorStop(0.55, "#6B3E23");
      headGrad.addColorStop(1, "#3E2212");

      c.beginPath();
      c.moveTo(-17, -7);
      c.quadraticCurveTo(-30, -10, -40, -4);
      c.quadraticCurveTo(-43, 0.5, -37, 4.5);
      c.quadraticCurveTo(-27, 7, -17, 4.5);
      c.closePath();
      c.fillStyle = headGrad;
      c.fill();

      // Creamy buff cheek & throat patch
      c.fillStyle = "#F5E6D3";
      c.beginPath();
      c.moveTo(-38, 0);
      c.quadraticCurveTo(-32, 6, -20, 4.5);
      c.quadraticCurveTo(-26, 0.5, -34, -0.5);
      c.closePath();
      c.fill();

      // Dark malar ("mustache") stripe under hawk eye
      c.strokeStyle = "#2C180E";
      c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(-36, -0.5);
      c.lineTo(-31.5, 3.2);
      c.stroke();

      // 6. Yellow Cere + Sharp Dark Slate Hooked Hawk Beak (pointing left)
      c.fillStyle = "#FACC15";
      c.beginPath();
      c.ellipse(-40.5, -1.8, 2.2, 1.8, -0.2, 0, Math.PI * 2);
      c.fill();

      const beakGrad = c.createLinearGradient(-51, -3, -40, 2.5);
      beakGrad.addColorStop(0, "#0F172A");
      beakGrad.addColorStop(0.6, "#334155");
      beakGrad.addColorStop(1, "#64748B");

      c.beginPath();
      c.moveTo(-40.5, -3.8);
      c.quadraticCurveTo(-48.5, -3.8, -51, 1.6); // Razor-sharp hawk hook tip
      c.quadraticCurveTo(-48, 3.1, -46.5, 0.8);
      c.lineTo(-39.5, 2.0);
      c.closePath();
      c.fillStyle = beakGrad;
      c.fill();

      // Fierce Amber Hawk Eye & Dark Supraorbital Brow Ridge
      c.fillStyle = "#F59E0B";
      c.beginPath();
      c.arc(-35, -2.2, 1.45, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = "#0F172A";
      c.beginPath();
      c.arc(-35.3, -2.2, 0.8, 0, Math.PI * 2);
      c.fill();

      c.strokeStyle = "#29180D";
      c.lineWidth = 1.1;
      c.beginPath();
      c.moveTo(-38, -3.5);
      c.lineTo(-32.8, -3.0);
      c.stroke();

      // 7. Near Wing (foreground left wing)
      drawHawkWing(c, flapAngle, wristFlex, false);

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

      // Fast swooping pass from right middle to left edge
      const startX = vw + 100;
      const endX = -120;
      const currentX = startX + (endX - startX) * progress;

      // Dynamic swooping altitude curve around the vertical middle
      const baseMidY = vh * 0.46;
      const currentY =
        baseMidY +
        Math.sin(progress * Math.PI * 2.4) * 24 -
        progress * 22;

      drawHawk(ctx, currentX, currentY, elapsed / 1000);

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
