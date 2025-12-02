"use client";

import React, { ReactNode } from "react";

// Este provider serve apenas para garantir que o contexto (se necessário no futuro)
// seja renderizado no lado do cliente, mas não gerencia mais a instância do Firebase.
export function FirebaseProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
