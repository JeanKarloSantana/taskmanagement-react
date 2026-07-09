import type { ComponentPropsWithoutRef, ReactNode } from "react";

type InputProps = ComponentPropsWithoutRef<"input"> & {
    hasError?: boolean;
    rightIconButton?: ReactNode;
};

export default function Input({ hasError, rightIconButton, ...props }: InputProps) {
    const inputClassName = `${hasError ? "mb-2 border-error" : "mb-8"} border border-solid rounded-md w-full h-14 pl-4 outline-none focus:border-title focus:ring-1 focus:ring-title`;

    if (rightIconButton) {
        return (
            <div className={hasError ? "relative mb-2" : "relative mb-8"}>
                <input {...props} className={`${inputClassName} mb-0 pr-12`} />
                <div className="absolute right-3 top-0 flex h-14 w-8 items-center justify-center">
                    {rightIconButton}
                </div>
            </div>
        );
    }

    return <input {...props} className={inputClassName} />;
}

