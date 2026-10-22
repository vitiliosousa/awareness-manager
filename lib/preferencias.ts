"use client";

import { useSyncExternalStore } from "react";
import { CHAVE_PALETA, CHAVE_TEMA, PALETAS_EXTRA, PALETA_OMISSAO } from "./tema";

// Preferências de interface deste browser.

const CHAVE_BARRA = "vigia-gestor:barra-recolhida";
const ouvintes = new Set<() => void>();

function lerBarra() {
  try {
    return window.localStorage.getItem(CHAVE_BARRA) === "1";
  } catch {
    return false;
  }
}

function subscrever(f: () => void) {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
}

export function useBarraRecolhida() {
  return useSyncExternalStore(subscrever, lerBarra, () => false);
}

export function alternarBarra() {
  try {
    window.localStorage.setItem(CHAVE_BARRA, lerBarra() ? "0" : "1");
  } catch {
    // Sem armazenamento, a preferência não persiste.
  }
  ouvintes.forEach((f) => f());
}

/* ---------- Tema ---------- */

export type Tema = "claro" | "escuro" | "sistema";

function lerTema(): Tema {
  try {
    const t = window.localStorage.getItem(CHAVE_TEMA);
    return t === "claro" || t === "escuro" ? t : "sistema";
  } catch {
    return "sistema";
  }
}

export function useTema() {
  return useSyncExternalStore(subscrever, lerTema, () => "sistema" as Tema);
}

export function definirTema(t: Tema) {
  try {
    if (t === "sistema") window.localStorage.removeItem(CHAVE_TEMA);
    else window.localStorage.setItem(CHAVE_TEMA, t);
  } catch {
    // Sem armazenamento, o tema vale só até recarregar.
  }
  if (t === "sistema") document.documentElement.removeAttribute("data-tema");
  else document.documentElement.setAttribute("data-tema", t);
  ouvintes.forEach((f) => f());
}

/* ---------- Paleta de cores ---------- */

export type IdPaleta = "vigia" | (typeof PALETAS_EXTRA)[number];

function lerPaleta(): IdPaleta {
  try {
    const p = window.localStorage.getItem(CHAVE_PALETA);
    return p === "vigia" || (PALETAS_EXTRA as readonly string[]).includes(p ?? "") ? (p as IdPaleta) : PALETA_OMISSAO;
  } catch {
    return PALETA_OMISSAO;
  }
}

export function usePaleta() {
  return useSyncExternalStore(subscrever, lerPaleta, () => PALETA_OMISSAO as IdPaleta);
}

export function definirPaleta(p: IdPaleta) {
  try {
    window.localStorage.setItem(CHAVE_PALETA, p);
  } catch {
    // Sem armazenamento, vale só até recarregar.
  }
  if (p === "vigia") document.documentElement.removeAttribute("data-paleta");
  else document.documentElement.setAttribute("data-paleta", p);
  ouvintes.forEach((f) => f());
}
