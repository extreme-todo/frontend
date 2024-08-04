interface OptionParam {
  empty?: string;
  max?: number;
}

export const MAX_CATEGORY_ARRAY_LENGTH = 5;

const regularCharacterRex =
  /^[a-zA-Z0-9 \u3131-\uD79D\u4E00-\u9FA5\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\u2CEB0-\u2EBEF\u2F800-\u2FA1F]+$/;
const specialCharactersRex = /[@~₩?><|\\=_^]/;

/**
 * @param value - 유효성 검사를 할 값
 * @param options - empty일 때 띄워줄 alert 메시지
 * @returns 유효성을 통과하면 trimmed가 된 값을 return
 */
export const inputValidation = (value: string, options?: OptionParam) => {
  if (options?.empty && !!!value.length) {
    return alert(options?.empty);
  }

  // 글로벌 문자(영어 포함 한국,중국,일본어)인지 && 특수문자와 이모지 제외처리
  if (!regularCharacterRex.test(value) || specialCharactersRex.test(value))
    return alert('특수문자와 이모지는 입력할 수 없습니다.');

  const trimmed = value.replace(/\s+/g, ' ').trim();

  if (options && options.max && trimmed.length > options.max)
    return alert(`${options.max}자 이하로만 입력할 수 있습니다.`);

  return trimmed;
};

export const categoryValidation = (value: string, categories: Array<any>) => {
  const trimmed = inputValidation(value, {
    empty: '카테고리를 입력해주세요.',
    max: 20,
  });

  if (!trimmed) return;

  // 5개가 되면 input 창을 사라지게 해서 일단은 없어도 되는 조건
  if (categories?.length === MAX_CATEGORY_ARRAY_LENGTH)
    return alert('category는 5개까지 입력할 수 있습니다.');

  if (categories?.includes(trimmed))
    return alert('이미 존재하는 카테고리 입니다.');

  return trimmed;
};

export const titleValidation = (value: string) => {
  const trimmed = inputValidation(value, {
    empty: '제목을 입력해주세요',
  });

  if (!trimmed) return;

  return trimmed;
};
