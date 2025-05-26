import { FC } from 'react';
import styled from 'styled-components';
import PreviewVolume from './PreviewVolume';
import TaggingInstructions from './TaggingInstructions';
import { usePrefs } from '../../contexts/prefs-context';
import { useCustomTags } from '../../contexts/custom-tags-context';
import ShowThemeSelectorButton from './ShowThemeSelectorButton';

const ToolbarMain = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 12px;
  position: relative;

  > * {
    margin: 0 6px;
  }
`;

const ResizeIcon = styled.div`
  cursor: pointer;
  max-height: 42px;
  display: flex;
`;

const ResizeSpan = styled.span`
  color: ${ props => props.theme.colors.accent };

  user-select: none;
  text-shadow: 0px 0 2px ${ props => props.theme.colors.shadowDefault };

  &.material-symbols-outlined {
    font-size: 2.5rem;
    font-weight: 400;
  }

  ${ props => props.theme.name === 'Christmas' && 'filter: brightness(1.2);' }

  &:first-child {
    font-size: 1.8rem;
    margin: 0 -6px 0 0;
  }
  
  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    &:first-child {
      margin-right: -4px;
    }
  }
`;

interface SoundboardToolbarProps {
  setPreviewVolume: (volume: string) => void;
}

const Toolbar: FC<SoundboardToolbarProps> = ({ setPreviewVolume }) => {
  const { toggleSmallButtons } = usePrefs();
  const { currentlyTagging } = useCustomTags();

  return (
    <ToolbarMain>
      <ShowThemeSelectorButton />
      <PreviewVolume setPreviewVolume={ setPreviewVolume } />
      { currentlyTagging && (
      <TaggingInstructions
        tagName={ currentlyTagging.name }
        tagColor={ currentlyTagging.color }
      />
      ) }
      <div>
        <ResizeIcon role="presentation" onClick={ toggleSmallButtons }>
          { [0, 1].map(x => <ResizeSpan key={ x } className='material-symbols-outlined'>crop_square</ResizeSpan>) }
        </ResizeIcon>
      </div>
    </ToolbarMain>
  );
};

export default Toolbar;
