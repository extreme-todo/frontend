import { inputValidation } from '../../shared/inputValidation';

describe('inputValidation', () => {
  let spyAlert: jest.SpyInstance<void, [message?: any]>;
  beforeEach(() => {
    spyAlert = jest.spyOn(window, 'alert').mockImplementation();
  });

  describe('inputValidation은', () => {
    it('빈 value는 options의 empty param을 alert로 띄워주고, undefined를 반환한다.', () => {
      const result = inputValidation('', {
        emptyAlert: '문자열이 비어있습니다.',
      });

      expect(result).toBe(undefined);
      expect(spyAlert).toBeCalledWith('문자열이 비어있습니다.');
    });

    it('value에 특수문자와 이모지가 있으면 alert창을 띄워주고, undefined를 반환한다.', () => {
      const result = inputValidation('🇰🇷 대한민국 최고', {
        emptyAlert: '문자열이 비어있습니다.',
      });

      expect(result).toBe(undefined);
      expect(spyAlert).toBeCalledWith(
        `특수문자는 입력할 수 없습니다\n!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`,
      );
    });

    it('value의 길이가 options의 max 값 이상이면, alert창을 띄워주고 undefined가 반환된다.', () => {
      const result = inputValidation('I really psyched up starting new 2024', {
        emptyAlert: '문자열이 비어있습니다.',
        max: 20,
      });

      expect(result).toBe(undefined);
      expect(spyAlert).toBeCalledWith('20자 이하로만 입력할 수 있습니다.');
    });

    it('value가 한 칸 이상의 띄워썼다면, 한 칸 띄어쓰기로 교체 및 가장 앞뒤쪽의 띄어쓰기는 삭제해서 반환된다.', () => {
      const result = inputValidation('   Welcome   to  my world', {
        emptyAlert: '문자열이 비어있습니다.',
      });

      expect(result).toBe('Welcome to my world');
    });
  });
});
