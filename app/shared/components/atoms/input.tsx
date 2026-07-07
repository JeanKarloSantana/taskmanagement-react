import type { ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

export default function Input(props: InputProps) {
    return <input {...props} className="border border-solid rounded-md w-full h-14 pl-4" />;
  }