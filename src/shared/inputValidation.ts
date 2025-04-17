import { z } from 'zod';
import {
  CategoryInputSchema,
  MAX_CATEGORY_INPUT_LENGTH,
  SPECIAL_EXPRESSION_WARNING,
  TodoSchema,
  unicodeLetterReg,
} from '../DB/indexedAction';

export const categoryValidation = (value: string) => {
  try {
    return CategoryInputSchema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errorMessage: error.errors[0].message };
    }
    return { errorMessage: '유효한 값이 아닙니다.' };
  }
};

export const titleValidation = (value: string) => {
  const schema = TodoSchema.shape.todo;

  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errorMessage: error.errors[0].message };
    }
    return { errorMessage: '유효한 값이 아닙니다.' };
  }
};
