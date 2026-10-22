import { permanentRedirect } from "next/navigation";

export default function ConversionsIndexRedirect() {
  permanentRedirect("/directory");
}
