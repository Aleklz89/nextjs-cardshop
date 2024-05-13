'use client';

export default function NotFound() {
    return (
        <html>
            <body style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '20vh',
                margin: 0
            }}>
                <h1 style={{
                    fontSize: '15px', 
                    fontWeight: 'bold',
                    fontFamily: 'Arial, sans-serif'
                }}>Something went wrong!</h1>
            </body>
        </html>
    );
}