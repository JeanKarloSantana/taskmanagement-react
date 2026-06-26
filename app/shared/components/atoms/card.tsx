export function Card() {
    return (
        <div className="outline rounded-xs">
            <div className="bg-app-background">
                <h1 className="text-brand-primary">brand-primary</h1>
                <h1 className="text-brand-secondary">brand-secondary</h1>
                <h1 className="text-highlight">highlight</h1>
                <h1 className="text-paragraph">paragraph</h1>
                <h1 className="text-paragraph-inverted">paragraph-inverted</h1>
            </div>
            <div className="bg-brand-primary">
                <h1 className="text-brand-primary">brand-primary</h1>
                <h1 className="text-brand-secondary">brand-secondary</h1>
                <h1 className="text-highlight">highlight</h1>
                <h1 className="text-paragraph">paragraph</h1>
                <h1 className="text-paragraph-inverted">paragraph-inverted</h1>
            </div>
        </div>
    )
}