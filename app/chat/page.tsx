import { MindMitraChat } from "@/components/MindMitraChat";
import { Navigation } from "@/components/landing/navigation";

export default function ChatPage() {
  return (
    <main className="relative min-h-screen flex flex-col bg-slate-50 overflow-hidden pt-24">
      <Navigation />

      {/* Main chat container */}
      <div className="relative flex-1 flex flex-col justify-center items-center z-10 p-4">
        <div className="w-full max-w-[1400px]">
          <MindMitraChat />
        </div>
      </div>

      {/* Clean Footer */}
      <footer className="w-full py-6 mt-auto border-t border-slate-200">
        <p className="text-center font-mono text-sm text-slate-500">
          Created by Nag Shakti
        </p>
      </footer>
    </main>
  );
}
