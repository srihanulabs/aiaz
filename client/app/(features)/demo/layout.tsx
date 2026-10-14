export default function DemoLayout({children}: {children: React.ReactNode}){
    return(
        <html lang="en">
        <body>
        <div>
            <h2>Demo Layout</h2>
            {children}
        </div>
        </body>
        </html>
    )
}