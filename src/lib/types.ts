export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: string;
  isFeedbackLoading?: boolean;
};
