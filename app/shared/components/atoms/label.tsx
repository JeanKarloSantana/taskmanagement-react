type LabelProps = {
    text: string;
}

export default function Label({ text }: LabelProps) {
    return <label className="block text-sm text-title mb-2">{text}</label>;
}