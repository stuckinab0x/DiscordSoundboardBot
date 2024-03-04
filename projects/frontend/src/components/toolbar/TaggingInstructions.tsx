import { FC } from 'react';
import styled from 'styled-components';
import { useCustomTags } from '../../contexts/custom-tags-context';
import { button, filterButton, filterButtonMobile } from '../../styles/mixins';
import { CloseBar } from '../../styles/components';

interface TaggingInstructionsMainProps {
  $tagColor: string;
}

const TaggingInstructionsMain = styled.div<TaggingInstructionsMainProps>`
  display: flex;
  align-items: center;
  padding: 4px 10px;
  margin: 0px 100px;
  flex-grow: 2;
  justify-content: center;
  border: solid ${ props => props.$tagColor };
  border-width: 5px 15px;
  border-radius: 5px;
  
  > p {
    color: ${ props => props.$tagColor };
    font-weight: bold;
    text-shadow: 2px 2px 3px ${ props => props.theme.colors.shadowDefault };
    margin: 0;
    margin-right: 12px;
  }

  > button {
    ${ button }
    ${ filterButton }
    ${ filterButtonMobile }

    margin: 0;
    margin-left: 12px;
  }
`;

const ConfirmButton = styled(CloseBar)`
  margin: 0px 6px;
  height: 22px;
  
  &:first-of-type {
    background-color: ${ props => props.theme.colors.borderGreen };
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
      <p>
        { `Currently tagging sounds for: ${ tagName }` }
      </p>
      <ConfirmButton onClick={ saveTagged }>
        <p>Save</p>
      </ConfirmButton>
      <ConfirmButton onClick={ discardTagged }>
        <p>Discard</p>
      </ConfirmButton>
    </TaggingInstructionsMain>
  );
};
export default TaggingInstructions;
