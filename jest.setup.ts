import "whatwg-fetch";

if (!Response.json) {
    Response.json = (data: any, init?: ResponseInit) => {
        const body = JSON.stringify(data);
        return new Response(body, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...(init?.headers || {}),
            },
        });
    };
}
