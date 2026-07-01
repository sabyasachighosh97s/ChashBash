import axios from 'axios';

const GEMINI_API_KEY = '';

export const generateDiseaseAnalysis = async (
  imageBase64: string,
  prompt: string,
) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: imageBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
      },
    );

    console.log('Gemini Success =>', JSON.stringify(response.data));

    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'কোনো ফলাফল পাওয়া যায়নি'
    );
  } catch (error: any) {
    console.log(
      'Gemini API Error =>',JSON.stringify(error?.response?.data || error)
      ,
    );
    throw error;
  }
};