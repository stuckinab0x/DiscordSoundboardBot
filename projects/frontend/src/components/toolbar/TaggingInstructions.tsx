import { FC } from 'react';
import styled from 'styled-components';
import { useCustomTags } from '../../contexts/custom-tags-context';
import { CloseBar } from '../../styles/components';

interface TaggingInstructionsMainProps {
  $tagColor: string;
}

const TaggingInstructionsMain = styled.div<TaggingInstructionsMainProps>`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: center;

  > p {
    display: flex;
    align-items: center;
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 2px ${ props => props.theme.colors.shadowDefault };
    margin: 2px;
    padding: 0 6px;
    min-height: 42px;
    background-color: ${ props => props.$tagColor };
  }

  @media only screen and (max-width: 780px) {
    > p {
      min-height: 30px;
    }
  }
`;

const ConfirmButton = styled(CloseBar)`
  min-height: 42px;
  margin: 2px;
  padding: 0;

  &:first-of-type {
    background-color: ${ props => props.theme.colors.borderGreen };
  }

  @media only screen and (max-width: 780px) {
    min-height: 30px;
  }
`;

interface TaggingInstructionsProps {
  tagName: string;
  tagColor: string;
}

const TaggingInstructions: FC<TaggingInstructionsProps> = ({ tagName, tagColor }) => {
  const { saveTagged, discardTagged } = useCustomTags();

  return (
    <TaggingInstructionsMain $tagColor={ tagColor }>
      <ConfirmButton onClick={ saveTagged }>
        <p>Save</p>
      </ConfirmButton>
      <p>
        { `Tagging: ${ tagName }` }
      </p>
      <ConfirmButton onClick={ discardTagged }>
        <p>Discard</p>
      </ConfirmButton>
    </TaggingInstructionsMain>
  );
};
export default TaggingInstructions;
