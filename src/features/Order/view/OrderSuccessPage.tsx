import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FaCircleCheck } from "react-icons/fa6";

import logoImage from "@/assets/logo-3.png";

const REDIRECT_SECONDS = 7;
const PARTICLES = Array.from({ length: 14 }, (_, idx) => {
  const angle = (Math.PI * 2 * idx) / 14;
  const distance = 95 + (idx % 3) * 20;

  return {
    id: idx,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    delayMs: idx * 25,
    colorClass:
      idx % 4 === 0
        ? "bg-success"
        : idx % 4 === 1
          ? "bg-warning"
          : idx % 4 === 2
            ? "bg-primary"
            : "bg-secondary",
  };
});

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stage, setStage] = useState<"enter" | "happy" | "burst" | "exit">(
    "enter",
  );

  const redirectPath = useMemo(() => {
    if (!id) return "/my-orders";

    return `/my-orders/${id}?success=1`;
  }, [id]);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setStage("happy"), 700);
    const burstTimer = window.setTimeout(() => setStage("burst"), 2600);
    const exitTimer = window.setTimeout(
      () => setStage("exit"),
      (REDIRECT_SECONDS - 1) * 1000,
    );

    const redirectTimer = window.setTimeout(() => {
      navigate(redirectPath, { replace: true });
    }, REDIRECT_SECONDS * 1000);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(burstTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [navigate, redirectPath]);

  const isBurstActive = stage === "burst" || stage === "exit";

  const logoAnimationClass =
    stage === "enter"
      ? "animate__zoomIn"
      : stage === "happy"
        ? "animate__heartBeat animate__infinite"
        : stage === "burst"
          ? "animate__tada animate__infinite"
          : "animate__bounceOutRight";

  return (
    <main className="min-h-[100dvh] bg-background flex items-start justify-center px-4 pt-8 md:pt-10">
      <section className="relative overflow-hidden w-full max-w-2xl rounded-[2.5rem] border border-success/25 bg-content1 p-9 md:p-12 shadow-xl text-center flex flex-col items-center justify-start">
        <style>
          {`
            @keyframes cmWaveFlow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes cmWavePulse {
              0% { opacity: .18; transform: scale(1); }
              50% { opacity: .38; transform: scale(1.035); }
              100% { opacity: .18; transform: scale(1); }
            }
          `}
        </style>

        <div
          className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
          style={{
            background:
              "linear-gradient(120deg, rgba(34,197,94,0.12), rgba(245,158,11,0.10), rgba(59,130,246,0.10), rgba(34,197,94,0.12))",
            backgroundSize: "240% 240%",
            animation: "cmWaveFlow 6s ease-in-out infinite",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[2.5rem] border border-success/20 animate__animated animate__pulse animate__infinite animate__slow"
          style={{ opacity: 0.45 }}
        />
        <div
          className="pointer-events-none absolute inset-2 rounded-[2.2rem] border border-warning/20 animate__animated animate__pulse animate__infinite animate__slower"
          style={{ opacity: 0.35, animationDelay: "600ms" }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[2.5rem] border-2 border-success/30"
          style={{ animation: "cmWavePulse 2.8s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute inset-3 rounded-[2.2rem] border border-primary/25"
          style={{
            animation: "cmWavePulse 3.4s ease-in-out infinite",
            animationDelay: "700ms",
          }}
        />

        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-50 text-success mb-5">
            <FaCircleCheck className="text-2xl" />
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-success">
            Compra completada
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-default-800 mt-2">
            Pedido confirmado
          </h1>
          <p className="text-default-500 mt-3">Estamos preparando tu compra.</p>

          <div className="my-7 relative h-72 w-full flex items-center justify-center overflow-hidden">
            <div
              className={`absolute w-60 h-60 rounded-full border-2 border-success/25 ${
                stage === "happy" || stage === "burst" ? "animate-ping" : ""
              }`}
            />
            <div
              className={`absolute w-52 h-52 rounded-full border border-warning/30 ${
                stage === "burst" ? "animate-pulse" : ""
              }`}
            />

            {PARTICLES.map((particle) => (
              <span
                key={particle.id}
                className={`absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full ${particle.colorClass} transition-all duration-700`}
                style={{
                  opacity: isBurstActive ? 1 : 0,
                  transform: isBurstActive
                    ? `translate(${particle.x}px, ${particle.y}px) scale(1)`
                    : "translate(0px, 0px) scale(0.1)",
                  transitionDelay: `${particle.delayMs}ms`,
                }}
              />
            ))}

            <img
              alt="Click Market"
              className={`mx-auto w-52 h-52 object-contain animate__animated ${logoAnimationClass}`}
              src={logoImage}
            />

            {(stage === "happy" || stage === "burst") && (
              <div className="absolute top-3/4 left-1/2 -translate-x-1/2 translate-y-6 px-3 py-1 rounded-full bg-success-50 border border-success/20 text-success text-xs font-black animate__animated animate__fadeInUp">
                Compra hecha!
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
