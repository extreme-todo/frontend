import { z } from 'zod';

interface OptionParam {
  emptyAlert?: string;
  regAlert?: string;
  max?: number;
}

const regularCharacterReg =
  /^[a-zA-Z0-9 \u3131-\uD79D\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\u2CEB0-\u2EBEF\u2F800-\u2FA1F]+$/;
const titleCharacterReg =
  /^[a-zA-Z0-9 \u3131-\uD79D\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\u2CEB0-\u2EBEF\u2F800-\u2FA1F\-']+$/;
const specialCharactersReg = /[@~₩?><|\\=_^]/;

export const DEFAULT_EMPTY_MESSAGE = '입력값이 없습니다.';
export const DEFAULT_SPECIAL_EXPRESSION = `특수문자는 입력할 수 없습니다\n!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;

/**
 * @param value - 유효성 검사를 할 값
 * @param options - empty일 때 혹은 정규표현식을 벗어났을 때 띄워줄 alert 메시지
 * @returns 유효성을 통과하면 trimmed가 된 값을 return
 */
export const inputValidation = (
  value: string,
  options?: OptionParam,
  reg: RegExp = regularCharacterReg,
) => {
  let schema = z.string();
  schema = schema.min(1, {
    message: options?.emptyAlert ?? DEFAULT_EMPTY_MESSAGE,
  });

  if (options?.max) {
    schema = schema.max(options.max, {
      message: `${options.max}자 이하로만 입력할 수 있습니다.`,
    });
  }

  // 마지막에 refine 추가
  const finalSchema = schema
    .refine((val) => reg.test(val) && !specialCharactersReg.test(val), {
      message:
        options?.regAlert ??
    })
    .transform((val) => val.replace(/\s+/g, ' ').trim());
      message: options?.regAlert ?? DEFAULT_SPECIAL_EXPRESSION,

  try {
    return finalSchema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errorMessage: error.errors[0].message };
    }
    return '유효한 값이 아닙니다.';
  }
};

export const categoryValidation = (value: string) => {
  const trimmed = inputValidation(value, {
    emptyAlert: '카테고리를 입력해주세요.',
    max: 20,
  });

  return trimmed;
};

export const titleValidation = (value: string) => {
  const trimmed = inputValidation(
    value,
    {
      emptyAlert: '제목을 입력해주세요',
      regAlert: `특수문자는 입력할 수 없습니다\n!"#$%&()*+,./:;<=>?@[\\]^_\`{|}~`,
    },
    titleCharacterReg,
  );

  return trimmed;
};
