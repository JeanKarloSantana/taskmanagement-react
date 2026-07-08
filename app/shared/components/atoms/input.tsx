import type { ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input"> & {
    hasError?: boolean;
};

export default function Input({ hasError, ...props }: InputProps) {
    return <input {...props} className={`${hasError ? "mb-2 border-error" : "mb-8"} border border-solid rounded-md w-full h-14 pl-4`} />;
}