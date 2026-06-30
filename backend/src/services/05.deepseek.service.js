export async function main(url) {
    // Stream the response to get reasoning tokens in usage
    const check= url.toLowerCase().split(".");
    let isPdf = false
    if(check[check.length-1] === "pdf")  isPdf = true;
    const stream = await openrouter.chat.send({
      chatRequest: {
      model: "google/gemma-4-31b-it:free",
      response_format: { type: "json_object" },
      stream: false,
      temperature: 0.1, // Forces the model to be strict, consistent, and analytical
      reasoning: {
        max_tokens: 2048 // Allocates reasoning tokens so it thinks deeply before writing the JSON
      },
      messages: [
        {
          "role": "user",
          "content": [
            {
              type: "text",
              text: `You are an expert ATS scanner and technical recruiter.
                   ${url} is the content.
                     Return ONLY valid JSON..return any bullshit thing if textcontent is not resume type
                           {
          "atsScore": number,
          "strengths": [],
          "weaknesses": [],
          "suggestions": []
        }
 `
            }, isPdf ? {
              type: 'file',
              file: {
                filename: 'document.pdf',
                fileData: url,
              }, } : {
              type: 'image_url',
              image_url: {
                url: url,
              },
            }
          ]
        }
      ],}
       });

    return stream.choices[0]?.message?.content;
  }