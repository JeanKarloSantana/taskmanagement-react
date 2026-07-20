type SubmitButtonProps = {
  disabled?: boolean;
};

export default function SubmitButton({ disabled = false }: SubmitButtonProps) {
  return (
    <input
      className="hover:text-highlight bg-button text-button-text cursor-pointer rounded-lg w-full h-14 disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
      value={disabled ? "Signing in..." : "Sign in"}
      disabled={disabled}
    />
  );
}
