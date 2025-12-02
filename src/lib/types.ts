export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: string;
  feedbackTranslation?: string;
  isFeedbackLoading?: boolean;
  translation?: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};
