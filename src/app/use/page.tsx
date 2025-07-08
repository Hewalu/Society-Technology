import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UsePage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center">Use-Seite</h1>
      <p className="text-lg text-center max-w-[1000px]">Das ist die Use-Seite.</p>
      <Button asChild className="mt-8">
        <Link href="/train">Neutrainieren</Link>
      </Button>
    </main>
  );
}
