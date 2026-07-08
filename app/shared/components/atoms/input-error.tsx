export default function InputError(props: { error?: string }) {
    return <p className="text-error mt-0 pt-0 mb-6 text-sm">{props.error}</p>
}