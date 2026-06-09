async function test() {
    const prompt = "A cute cat playing with yarn";
    const hfToken = "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";
    const url = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`;
    console.log("Fetching:", url);
    try {
        const imgResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${hfToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });
        console.log("Status:", imgResponse.status, imgResponse.statusText);
        if (!imgResponse.ok) {
            const text = await imgResponse.text();
            console.log("Error body:", text);
        } else {
            const arrayBuffer = await imgResponse.arrayBuffer();
            console.log("Success! ArrayBuffer byte length:", arrayBuffer.byteLength);
        }
    } catch (e: any) {
        console.error("Fetch failed:", e);
    }
}
test();
