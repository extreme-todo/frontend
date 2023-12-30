interface IEditUIProps {
  handleSubmit: (params: React.KeyboardEvent<HTMLInputElement>) => void;
  title: string;
  handleChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  category: string;
  handleChangeCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  categories: string[] | null;
}

const EditUI = ({
  handleSubmit,
  categories,
  title,
  handleChangeTitle,
  category,
  handleChangeCategory,
}: IEditUIProps) => {
  return (
    <div>
      <input
        value={title}
        onChange={handleChangeTitle}
        placeholder="할 일을 입력하세요"
        aria-label="title"
      />
      {categories?.map((category) => (
        <div key={category} aria-label="category_tag">
          {category}
        </div>
      ))}
      <input
        value={category}
        onChange={handleChangeCategory}
        onKeyDown={handleSubmit}
        placeholder="새 카테고리를 입력하고 엔터를 눌러주세요"
        aria-label="category_input"
      />
    </div>
  );
};

export default EditUI;
