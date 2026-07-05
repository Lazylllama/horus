import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoaderCircle className="animate-spin text-primary" size={48} />
    </div>
  );
}
