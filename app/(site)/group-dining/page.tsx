import { permanentRedirect } from "next/navigation";

export default function GroupDiningRedirect() {
  permanentRedirect("/private-dining");
}
