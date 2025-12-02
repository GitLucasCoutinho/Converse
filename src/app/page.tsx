import { ChatLayout } from "@/components/converse/chat-layout";
import { Translator } from "@/components/converse/translator";
import { ClientOnly } from "@/components/client-only";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center bg-background p-4 gap-4 lg:flex-row lg:items-start lg:justify-center">
      <div className="w-full flex-[2] overflow-hidden lg:max-w-3xl lg:h-full">
        <ClientOnly>
          <ChatLayout />
        </ClientOnly>
      </div>
      <div className="w-full flex-[1] overflow-hidden lg:max-w-3xl lg:h-full">
        <ClientOnly>
          <Translator />
        </ClientOnly>
      </div>
    </div>
  );
}
