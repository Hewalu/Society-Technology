'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useUser } from '@/context/UserContext';
import { useEffect } from 'react';
import logo from '@/assets/ce_logo.svg';

export default function Home() {
  const { resetName, name } = useUser();

  useEffect(() => {
    if (name != '') {
      resetName();
    }
  }, [name, resetName]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Image src={logo} alt="Logo" width={100} height={100} className="mb-8" />
      <h1 className="text-4xl font-bold mb-8 text-center max-w-[950px]">Künstliche Intelligenz: Verstärkung von Machtsystemen durch kulturelle und moralische Filter</h1>
      <p className="text-lg mb-8 text-center max-w-[1000px]">
        KIs lernen aus Daten und spiegeln oft vorhandene Vorurteile und Machtverhältnisse wider. Systeme, die diese Verzerrungen übernehmen, sind oft effizienter, schneller und wirtschaftlich erfolgreicher. Genau deshalb werden viele Biases nicht korrigiert, sondern verstärkt. So entstehen Algorithmen, die scheinbar neutral sind, in Wahrheit aber Ungleichheit reproduzieren.
      </p>
      <Button asChild>
        <Link href="/train">Weiter</Link>
      </Button>
    </main>
  );
}
