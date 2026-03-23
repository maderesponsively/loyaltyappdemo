"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button, Spinner } from "@heroui/react";
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDialog,
  DrawerHeader,
  DrawerHeading,
  DrawerRoot,
  ModalBackdrop,
  ModalBody,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  ModalIcon,
  ModalRoot,
  ModalTrigger,
} from "@heroui/react";
import { TabsRoot, TabListContainer, TabList, Tab, TabPanel } from "@heroui/react";
import { useOverlayState } from "@heroui/react";
import type { Role } from "@/data/slides";
import { getSlides } from "@/data/slides";

const SWIPE_THRESHOLD_PX = 48;

const WELCOME_SEEN_KEY = "loyaltyappdemo-welcome-seen";

export function CofiraDemo() {
  const [role, setRole] = useState<Role>("user");
  const [userIndex, setUserIndex] = useState(0);
  const [adminIndex, setAdminIndex] = useState(0);
  const [scannerIndex, setScannerIndex] = useState(0);
  const drawerState = useOverlayState();
  const welcomeState = useOverlayState({
    onOpenChange: (isOpen) => {
      if (!isOpen && typeof window !== "undefined") {
        try {
          localStorage.setItem(WELCOME_SEEN_KEY, "1");
        } catch {
          /* ignore quota / private mode */
        }
      }
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem(WELCOME_SEEN_KEY)) {
        welcomeState.open();
      }
    } catch {
      welcomeState.open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- welcome once on mount
  }, []);

  const userSlides = useMemo(() => getSlides("user"), []);
  const adminSlides = useMemo(() => getSlides("admin"), []);
  const scannerSlides = useMemo(() => getSlides("scanner"), []);

  const slides =
    role === "user" ? userSlides : role === "admin" ? adminSlides : scannerSlides;
  const index =
    role === "user" ? userIndex : role === "admin" ? adminIndex : scannerIndex;
  const setIndex =
    role === "user"
      ? setUserIndex
      : role === "admin"
        ? setAdminIndex
        : setScannerIndex;

  const total = slides.length;
  const current = slides[index] ?? slides[0];

  /** `role:id` so loader state resets when switching tabs; avoids stale `onLoadingComplete` from another slide. */
  const slideKey = current ? `${role}:${current.id}` : "";
  const [loadedSlideKey, setLoadedSlideKey] = useState<string | null>(null);
  const activeSlideKeyRef = useRef(slideKey);
  activeSlideKeyRef.current = slideKey;

  /**
   * Do not reset `loadedSlideKey` in an effect when `slideKey` changes: a cached image
   * can fire `onLoad` before that effect runs, and the effect would wipe the loaded
   * state so the loader stays forever and the slide can appear blank.
   * Stale keys are naturally wrong until `loadedSlideKey === slideKey`.
   */
  const showSlideLoader = slideKey !== "" && loadedSlideKey !== slideKey;

  const onSlideImageDone = useCallback((completedKey: string) => {
    setLoadedSlideKey((prev) => {
      if (completedKey !== activeSlideKeyRef.current) return prev;
      return completedKey;
    });
  }, []);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => {
        const next = i + delta;
        if (next < 0) return 0;
        if (next >= total) return total - 1;
        return next;
      });
    },
    [setIndex, total],
  );

  const goTo = useCallback(
    (i: number) => {
      if (i < 0 || i >= total) return;
      setIndex(i);
      drawerState.close();
    },
    [drawerState, setIndex, total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; active: boolean }>({ x: 0, active: false });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { x: e.clientX, active: true };
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.x;
    dragRef.current.active = false;
    try {
      stageRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) {
      go(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--demo-bg)]">
      <ModalRoot state={welcomeState}>
        <ModalTrigger
          className="pointer-events-none fixed left-0 top-0 size-0 overflow-hidden p-0 opacity-0"
          aria-hidden
          tabIndex={-1}
        >
          <span />
        </ModalTrigger>

        <ModalBackdrop className="z-[100]">
          <ModalContainer
            placement="center"
            size="lg"
            className="z-[101] min-h-0 w-full max-w-[min(100vw-1.5rem,26rem)] justify-center md:max-w-[min(100vw-2rem,40rem)] lg:max-w-[min(100vw-3rem,48rem)]"
          >
            <ModalDialog aria-label="About this demo">
              <ModalHeader className="flex flex-row items-center gap-3 border-b border-[var(--demo-border)] pb-3">
                <ModalIcon className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-600 text-white shadow-sm">
                  <SparkleIcon />
                </ModalIcon>
                <div className="min-w-0 flex-1">
                  <ModalHeading className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-600 bg-clip-text text-lg font-semibold leading-snug text-transparent sm:text-xl">
                    Custom loyalty app demo
                  </ModalHeading>
                </div>
                <ModalCloseTrigger aria-label="Close welcome" className="shrink-0" />
              </ModalHeader>

              <ModalBody className="gap-3 pt-3 text-sm leading-relaxed text-[var(--demo-fg)]">
                <p>This demo shows a custom loyalty app made specifically for coffee shops.</p>
                <p>
                  Each client gets their own branded app, published on Google Play and the App Store.
                </p>
                <p>
                  Customer, scanner, and admin tools all live in one app, with push notifications for offers,
                  rewards, and updates.
                </p>
                <p>The screenshots in this demo are from a real store, Cofira.</p>
              </ModalBody>

              <ModalFooter className="flex-col items-stretch gap-3 border-t border-[var(--demo-border)] pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="order-2 text-center text-[11px] text-[var(--demo-muted)] sm:order-1 sm:text-left">
                  By{" "}
                  <span className="font-medium text-[var(--demo-fg)]">Made Responsively Ltd.</span>
                  <br />
                  <a
                    href="mailto:hello@maderesponsively.com"
                    className="text-[var(--demo-fg)] underline decoration-[var(--demo-border)] underline-offset-2 hover:decoration-[var(--demo-fg)]"
                  >
                    hello@maderesponsively.com
                  </a>
                </p>

                <Button
                  className="order-1 min-h-10 w-full rounded-lg bg-[var(--demo-fg)] text-sm font-medium text-white sm:order-2 sm:w-auto sm:min-w-[10rem]"
                  onPress={() => welcomeState.close()}
                >
                  Explore the demo
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </ModalRoot>

      <header className="sticky top-0 z-30 w-full shrink-0 border-b border-[var(--demo-border)] bg-[var(--demo-bg)]/95 pt-[max(0.35rem,env(safe-area-inset-top))] backdrop-blur-sm">
        <div className="flex w-full items-center justify-between gap-2 px-3 py-1.5 sm:px-4">
          <TabsRoot
            selectedKey={role}
            onSelectionChange={(key) => {
              const k = String(key) as Role;
              if (k === "user" || k === "admin" || k === "scanner") setRole(k);
            }}
            className="min-w-0 flex-none"
          >
            <TabListContainer className="w-auto min-w-0 max-w-[min(100%,calc(100vw-8rem))] sm:max-w-none">
              <TabList
                aria-label="App mode: User, Scanner, Admin"
                className="inline-flex h-8 w-auto max-w-full items-center gap-0.5 rounded-lg border border-[var(--demo-border)] bg-neutral-50 p-0.5"
              >
                <Tab
                  id="user"
                  className="box-border flex h-7 min-h-7 w-auto shrink-0 items-center justify-center gap-1 rounded-md border border-transparent px-1.5 text-xs font-medium leading-none text-neutral-900 shadow-none ring-0 outline-none data-[selected]:border-transparent data-[selected]:bg-black data-[selected]:text-white data-[selected]:shadow-none sm:gap-1.5 sm:px-3"
                >
                  <UserTabIcon />
                  User
                </Tab>
                <Tab
                  id="scanner"
                  className="box-border flex h-7 min-h-7 w-auto shrink-0 items-center justify-center gap-1 rounded-md border border-transparent px-1.5 text-xs font-medium leading-none text-neutral-900 shadow-none ring-0 outline-none data-[selected]:border-transparent data-[selected]:bg-black data-[selected]:text-white data-[selected]:shadow-none sm:gap-1.5 sm:px-3"
                >
                  <ScannerTabIcon />
                  Scanner
                </Tab>
                <Tab
                  id="admin"
                  className="box-border flex h-7 min-h-7 w-auto shrink-0 items-center justify-center gap-1 rounded-md border border-transparent px-1.5 text-xs font-medium leading-none text-neutral-900 shadow-none ring-0 outline-none data-[selected]:border-transparent data-[selected]:bg-black data-[selected]:text-white data-[selected]:shadow-none sm:gap-1.5 sm:px-3"
                >
                  <AdminTabIcon />
                  Admin
                </Tab>
              </TabList>
            </TabListContainer>
            <TabPanel id="user" className="sr-only">
              User app tour
            </TabPanel>
            <TabPanel id="scanner" className="sr-only">
              Scanner app tour
            </TabPanel>
            <TabPanel id="admin" className="sr-only">
              Admin app tour
            </TabPanel>
          </TabsRoot>

          <DrawerRoot state={drawerState}>
            <Button
              variant="secondary"
              size="sm"
              className="box-border h-8 min-h-8 shrink-0 rounded-md border border-[var(--demo-border)] bg-white px-2.5 py-0 text-xs font-medium leading-none text-[var(--demo-fg)]"
              aria-label="Open slide index"
              onPress={drawerState.open}
            >
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 6h16M4 12h16M4 18h10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Index
              </span>
            </Button>
            <DrawerBackdrop>
              <DrawerContent placement="right" className="max-w-[min(100vw,18rem)]">
                <DrawerDialog>
                  <DrawerHeader className="flex flex-row items-center justify-between gap-2 border-b border-[var(--demo-border)] py-2">
                    <DrawerHeading className="text-sm font-semibold text-[var(--demo-fg)]">
                      {role === "user"
                        ? "User"
                        : role === "scanner"
                          ? "Scanner"
                          : "Admin"}
                    </DrawerHeading>
                    <DrawerCloseTrigger aria-label="Close index" />
                  </DrawerHeader>
                  <DrawerBody className="max-h-[min(70vh,28rem)] overflow-y-auto px-0">
                    <nav aria-label="Slides">
                      <ul className="flex flex-col gap-0 p-1.5">
                        {slides.map((s, i) => (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => goTo(i)}
                              className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs leading-snug transition-colors ${
                                i === index
                                  ? "bg-neutral-200 font-medium text-[var(--demo-fg)]"
                                  : "text-[var(--demo-fg)]/80 hover:bg-neutral-100"
                              }`}
                            >
                              <span className="mt-0.5 tabular-nums text-[10px] text-[var(--demo-muted)]">
                                {i + 1}
                              </span>
                              <span className="flex-1">{s.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </DrawerBody>
                </DrawerDialog>
              </DrawerContent>
            </DrawerBackdrop>
          </DrawerRoot>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col min-h-0 basis-0 w-full pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex min-h-0 flex-1 basis-0 flex-col px-3 sm:px-4 w-full max-w-none">
          <div
            ref={stageRef}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative flex min-h-0 flex-1 basis-0 touch-pan-y flex-col"
          >
            {showSlideLoader ? (
              <div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                aria-live="polite"
                aria-busy="true"
              >
                <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--demo-border)] bg-[var(--demo-bg)]/95 px-6 py-4 shadow-sm backdrop-blur-sm">
                  <Spinner size="lg" className="text-[var(--demo-fg)]" />
                  <span className="text-xs font-medium text-[var(--demo-muted)]">Loading…</span>
                </div>
              </div>
            ) : null}
            {/* deviceFrame: phone + caption grouped and centered so the caption sits just under the mockup */}
            <div className="relative min-h-0 flex-1 basis-0 w-full">
              {current ? (
                current.deviceFrame ? (
                  <div className="absolute inset-0 flex min-h-0 items-center justify-center p-7 sm:p-9 md:p-12">
                    <div className="flex max-h-full w-full min-w-0 flex-col items-center justify-center">
                      <div className="relative mx-auto aspect-[9/19.5] h-[min(52dvh,calc(100dvh-15rem))] w-auto max-w-[min(100%,92vw)] min-h-0 shrink-0 overflow-hidden rounded-[clamp(0.625rem,1.5vmin,1.125rem)] border border-[color:var(--demo-device-frame-border)] bg-[var(--demo-device-frame)] shadow-[0_36px_72px_-16px_rgba(0,0,0,0.34),0_16px_48px_-14px_rgba(0,0,0,0.24),0_4px_16px_-6px_rgba(0,0,0,0.18)]">
                        <Image
                          key={slideKey}
                          src={current.src}
                          alt={current.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 32rem"
                          className="object-contain object-center"
                          priority={index === 0}
                          draggable={false}
                          onLoad={() => onSlideImageDone(slideKey)}
                          onLoadingComplete={() => onSlideImageDone(slideKey)}
                          onError={() => onSlideImageDone(slideKey)}
                        />
                      </div>
                      <p className="pointer-events-none -mt-1 line-clamp-2 w-full max-w-[min(100%,calc(100vw-2rem))] shrink-0 text-center text-xs font-medium leading-snug text-[var(--demo-muted)]">
                        {current.title}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex min-h-0 flex-col px-3 pb-0.5 pt-4 sm:px-4 sm:pt-6">
                    <div className="relative min-h-0 w-full min-w-0 flex-1">
                      <Image
                        key={slideKey}
                        src={current.src}
                        alt={current.title}
                        fill
                        sizes="100vw"
                        className="object-contain object-center rounded-[clamp(3rem,22vmin,8rem)]"
                        priority={index === 0}
                        draggable={false}
                        onLoad={() => onSlideImageDone(slideKey)}
                        onLoadingComplete={() => onSlideImageDone(slideKey)}
                        onError={() => onSlideImageDone(slideKey)}
                      />
                    </div>
                    <p className="pointer-events-none -mt-1 line-clamp-2 shrink-0 pt-1 text-center text-xs font-medium leading-snug text-[var(--demo-muted)]">
                      {current.title}
                    </p>
                  </div>
                )
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <footer
        className="fixed bottom-0 left-0 right-0 z-40 w-full border-t border-[var(--demo-border)] bg-[var(--demo-bg)]/95 px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md sm:px-4"
      >
        <div className="mx-auto flex w-full max-w-none flex-col gap-2.5">
          <div
            className="flex flex-wrap items-center justify-center gap-1 px-0.5"
            role="tablist"
            aria-label="Jump to slide"
          >
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 min-w-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-[var(--demo-fg)]" : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-x-2">
            <div className="flex h-full min-h-[2.25rem] items-center justify-self-start">
              <Button
                variant="secondary"
                size="sm"
                isDisabled={index === 0}
                className="min-h-9 min-w-[4.5rem] shrink-0 self-center rounded-lg border border-[var(--demo-border)] bg-white text-xs font-medium text-[var(--demo-fg)]"
                onPress={() => go(-1)}
                aria-label="Previous slide"
              >
                <span className="flex items-center justify-center gap-0.5">
                  <ChevronLeft />
                  Prev
                </span>
              </Button>
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center gap-0 text-center">
              <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--demo-muted)]">
                {role === "user"
                  ? "User"
                  : role === "scanner"
                    ? "Scanner"
                    : "Admin"}
              </span>
              <span className="text-xs font-semibold tabular-nums text-[var(--demo-fg)]">
                {index + 1} / {total}
              </span>
            </div>
            <div className="flex h-full min-h-[2.25rem] items-center justify-self-end">
              <Button
                variant="secondary"
                size="sm"
                isDisabled={index >= total - 1}
                className="min-h-9 min-w-[4.5rem] shrink-0 self-center rounded-lg border border-[var(--demo-border)] bg-[var(--demo-fg)] text-xs font-medium text-white"
                onPress={() => go(1)}
                aria-label="Next slide"
              >
                <span className="flex items-center justify-center gap-0.5">
                  Next
                  <ChevronRight />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l1.2 4.2L17 7.5l-3.8 2.3L12 14l-1.2-4.2L7 7.5l3.8-2.3L12 2zM19 13l.6 2.1 2.1.6-2.1.6-.6 2.1-.6-2.1-2.1-.6 2.1-.6.6-2.1zM5 15l.5 1.7 1.7.5-1.7.5-.5 1.7-.5-1.7-1.7-.5 1.7-.5.5-1.7z"
        fill="currentColor"
      />
    </svg>
  );
}

function UserTabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M12 11a3 3 0 100-6 3 3 0 000 6zM5 20a7 7 0 0114 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdminTabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScannerTabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path
        d="M3 7V5a2 2 0 012-2h2M21 7V5a2 2 0 00-2-2h-2M3 17v2a2 2 0 002 2h2M21 17v2a2 2 0 01-2 2h-2M7 12h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
