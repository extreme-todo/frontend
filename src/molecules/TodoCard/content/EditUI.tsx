import styled from '@emotion/styled';
import { InputAtom, TagAtom } from '../../../atoms';

interface IEditUIProps {
  handleSubmit: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  title: string;
  handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  handleChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  categories: string[] | null;
  handleClickTag: (category: string) => void;
}

const EditUI = ({
  handleSubmit,
  categories,
  title,
  handleChangeTitle,
  category,
  handleChangeCategory,
  handleClickTag,
}: IEditUIProps) => {
  return (
    <EditWrapper>
      <InputAtom.Usual
        value={title}
        handleChange={handleChangeTitle}
        placeholder="할 일을 입력하세요"
        ariaLabel="title_input"
      />

      <CategoryContainer>
        {categories?.map((category) => (
          <TagAtom
            key={category}
            handler={() => handleClickTag.call(this, category)}
            ariaLabel="category_tag"
            styleOption={{
              fontsize: 'sm',
              size: 'sm',
              bg: 'whiteWine',
              maxWidth: 10,
            }}
          >
            {category}
          </TagAtom>
        ))}
        <InputAtom.Underline
          value={category}
          handleChange={handleChangeCategory}
          handleKeyDown={handleSubmit}
          placeholder="카테고리를 입력하고 엔터를 눌러주세요"
          ariaLabel="category_input"
        />
      </CategoryContainer>
    </EditWrapper>
  );
};

export default EditUI;

const EditWrapper = styled.div`
  padding: 0.759rem;
  border-radius: 10px;
  flex: column;
`;

const CategoryContainer = styled.div`
  margin-top: 0.61rem;
  & > button {
    margin-right: 0.61rem;
    margin-bottom: 0.61rem;
  }
`;
