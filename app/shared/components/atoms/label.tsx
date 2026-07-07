type LabelProps = {
    text: string;
}

export default function Label({ text }: LabelProps) {
    return <label className="text-sm text-title">{text}</label>;
}