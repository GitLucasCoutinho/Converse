import { ChatLayout } from "@/components/converse/chat-layout";
import { Translator } from "@/components/converse/translator";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center bg-background p-4 gap-4 lg:flex-row lg:items-start lg:justify-center">
      <div className="w-full h-full lg:w-1/2 lg:max-w-3xl">
        <ChatLayout />
      </div>
      <div className="w-full h-full lg:w-1/2 lg:max-w-3xl">
        <Translator />
      </div>
    </div>
  );
}
