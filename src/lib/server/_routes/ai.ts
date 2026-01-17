import { GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MiddleWareError } from '@patrick115/sveltekitapi';
import { z } from 'zod';
import { loggedProcedure } from '../api';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export default {
  generate: loggedProcedure.POST.input(
    z.object({
      prompt: z.string()
    })
  ).query(async ({ input }) => {
    try {
      const result = await model.generateContent(input.prompt);
      const response = await result.response;
      return { text: response.text() };
    } catch (e) {
      console.error('Gemini Error:', e);
      throw new MiddleWareError({
        status: false,
        code: 500,
        message: 'Failed to generate content: ' + (e as Error)?.message
      });
    }
  })
};
