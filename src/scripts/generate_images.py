import sys
import json
import base64
from google import genai
from google.genai import types
import os

# Read API Key from env var or args
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # Fallback to arg if needed or just error
    try:
        from dotenv import load_dotenv
        load_dotenv('.env.local')
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")
    except:
        pass

if not api_key:
    # manual fallback for testing in this specific environment if env vars aren't passed correctly to child process
    # But best to rely on env vars passed by Node
    pass

client = genai.Client(api_key=api_key)

def generate_image(prompt):
    try:
        response = client.models.generate_content(
            model='gemini-3-pro-image-preview', 
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"]
            )
        )
        
        images = []
        if response.candidates and response.candidates[0].content:
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    # Convert raw bytes to base64 string
                    b64_data = base64.b64encode(part.inline_data.data).decode('utf-8')
                    images.append(b64_data)
        
        return images

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Expect prompts as JSON array from stdin or single string arg
    prompt = sys.argv[1] if len(sys.argv) > 1 else "A website design"
    
    result = generate_image(prompt)
    
    # Output JSON to stdout
    print(json.dumps(result))
