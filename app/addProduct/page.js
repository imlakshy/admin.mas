import { Suspense } from "react";
import AddProductClient from "./AddProductClient";

export default function Page() {
  return (
    <Suspense>
      <AddProductClient />
    </Suspense>
  );
}
