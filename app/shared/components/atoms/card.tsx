export function Card() {
    return (
        <div className="outline rounded-xs">
            <p>-----------------------------</p>
            <h1>NORMALS</h1>
            <p>-----------------------------</p>
            <div className="bg-app-background">
                <h1 className="text-title">title</h1>
                <h1 className="text-title-secondary">title-secondary</h1>
                <h1 className="text-title-tertiary">title-tertiary</h1>
                <h1 className="text-highlight">highlight</h1>
                <h1 className="text-paragraph">paragraph</h1>
            </div>
            <p>-----------------------------</p>
            <h1>ALTS</h1>
            <p>-----------------------------</p>
            <div className="bg-app-background-alt">
                <h1 className="text-title-alt">title-alt</h1>
                <h1 className="text-title-secondary-alt">title-secondary</h1>
                <h1 className="text-title-tertiary-alt">title-tertiary</h1>
                <h1 className="text-highlight">highlight</h1>
                <h1 className="text-paragraph">paragraph</h1>
                <h1 className="text-paragraph-alt">paragraph</h1>
            </div>
        </div>
    )
}
