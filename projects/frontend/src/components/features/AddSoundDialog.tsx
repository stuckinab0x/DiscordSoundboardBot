import { FC, useState, useCallback, useMemo, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import styled, { css } from 'styled-components';
import * as mixins from '../../styles/mixins';

function randomSuccessMessage() {
  const messages = ['The cloud awaits...', 'sv_gravity -800', 'Maybe you\'re actually falling tho.', 'ZOOM', 'TO THE SKY REALM',
    'SOUNDS FOR THE SOUND GOD', 'NOOOOO THIS FILE IS FULL OF HELIUM'];
  return messages[Math.floor(Math.random() * messages.length)];
}

const AddSoundSuccess = css`
  transition-property: top;
  transition-timing-function: ease-in;
  transition-duration: 2s;
  top: -50vh;

  ${ mixins.buttonGreen }
`;

const AddSoundError = css`
  animation: shake 0.5s 1 linear;
  ${ mixins.buttonRed }
`;

type Status = 'success' | 'error' | 'pending' | null;

interface AddSoundDialogMainProps {
  $statusStyle: Status
  $confirmActive: boolean;
}

const AddSoundDialogMain = styled.div<AddSoundDialogMainProps>`
  color: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  right: 5px;
  top: 64px;
  background-color: ${ props => props.theme.colors.innerA };
  border: solid 5px ${ props => props.theme.colors.accent };
  border-radius: 5px;
  padding: 6px 8px;
  box-shadow: 0px 5px 10px 3px ${ props => props.theme.colors.innerB };
  z-index: 50;

  ${ props => {
    if (props.$statusStyle === 'success') return AddSoundSuccess;
    if (props.$statusStyle === 'error') return AddSoundError;
    return null;
  } }

  > h4, input, button {
    margin: 2px 0px;
  }

  > input {
    ${ mixins.textInput }
    width: auto;
  }

  > button {
    ${ mixins.button }
    ${ mixins.filterButton }
    border-color: ${ props => props.$confirmActive && props.theme.colors.borderGold };
    
    > p {
      margin: 0;
      &:first-child {
        opacity: 0.4;
      }
    }
  }

  @keyframes shake {
    0% { transform: translate(20px); }
    20% { transform: translate(-20px); }
    40% { transform: translate(10px); }
    60% { transform: translate(-10px); }
    80% { transform: translate(4px); }
    100% { transform: translate(0px); }
  }

  @media only screen and (max-width: 780px) {
    border-width: 3px;
    padding: 4px 6px;
    position: fixed;
    top: 300px;
    right: 50%;
    left: 50%;
    margin-left: -150px;
    margin-right: -150px;

    > input, button {
      border-width: 3px;
    }
  }
`;

const defaultMessage = 'Upload a new sound file';

interface AddSoundDialogProps {
  close: () => void;
  setDisableAddSoundButton: (disable: boolean) => void;
}

const AddSoundDialog: FC<AddSoundDialogProps> = ({ close, setDisableAddSoundButton }) => {
  const [message, setMessage] = useState(defaultMessage);
  const [addSoundStatus, setAddSoundStatus] = useState<Status>(null);
  const [fileInputValue, setFileInputValue] = useState('');
  const [fileInputFiles, setFileInputFiles] = useState<FileList | null>(null);
  const [nameInputValue, setNameInputValue] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate } = useSWRConfig();

  const addSound = useCallback(async () => {
    if (!fileInputValue) return;
    const formData = new FormData();
    if (nameInputValue) formData.append('custom-name', nameInputValue);
    if (fileInputFiles) formData.append('sound-file', fileInputFiles[0]);

    try {
      setAddSoundStatus('pending');
      const addSoundRes = await fetch('/api/sounds/', {
        method: 'POST',
        body: formData,
      });
      if (addSoundRes.status === 409) throw new Error('Sound already exists');
      setDisableAddSoundButton(true);
      setMessage(randomSuccessMessage());
      setAddSoundStatus('success');
      setShowConfirm(false);
      await mutate('/api/sounds');
      setTimeout(() => {
        close();
        setFileInputValue('');
        setNameInputValue('');
        setFileInputFiles(null);
        setMessage(defaultMessage);
        setAddSoundStatus(null);
        setDisableAddSoundButton(false);
      }, 2000);
    } catch (error: any) {
      setAddSoundStatus('error');
      if (error.message === 'Sound already exists') setMessage('Whoops, a sound already has that name');
      else setMessage('Yikes! Something went wrong');
      setTimeout(() => {
        setAddSoundStatus(null);
        setMessage(defaultMessage);
      }, 2000);
    }
  }, [fileInputValue, nameInputValue]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const supportedFileTypes = ['wav', 'mp3', 'webm', 'ogg'];
    const path = event.target.value.split('.');
    const extension = path[path.length - 1].toLowerCase();
    setFileInputFiles(null);
    setNameInputValue('');
    setFileInputValue('');

    if (!supportedFileTypes.includes(extension) && event.target.value) {
      setFileInputValue('');
      setAddSoundStatus('error');
      setMessage('WRONG FILE TYPE (try: wav mp3 webm ogg)');
      setTimeout(() => {
        setAddSoundStatus(null);
        setMessage(defaultMessage);
      }, 2000);
      return;
    }

    setFileInputValue(event.target.value);
    setFileInputFiles(event.target.files);
  }, [nameInputValue]);

  const handleNameInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInputValue(event.target.value);
  }, [fileInputValue]);

  const autoSoundName = useMemo(() => {
    if (!fileInputFiles)
      return null;
    const extIndex = fileInputFiles[0].name.lastIndexOf('.');
    if (extIndex === -1)
      return null;
    const withSpaces = fileInputFiles[0].name.slice(0, extIndex).replace(/_/g, ' ').replace(/-/g, ' ');
    return withSpaces.toLowerCase().split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1, x.length)).join(' ');
  }, [fileInputFiles]);

  const autoFillName = useCallback(() => {
    if (!autoSoundName || !fileInputValue)
      return;
    setNameInputValue(autoSoundName);
  }, [autoSoundName]);

  useEffect(() => {
    if (fileInputFiles && nameInputValue)
      setShowConfirm(true);
    else
      setShowConfirm(false);
  }, [fileInputFiles, nameInputValue]);

  return (
    <AddSoundDialogMain $statusStyle={ addSoundStatus } $confirmActive={ showConfirm }>
      <h4>{ message }</h4>
      <input
        type="file"
        accept=".wav, .mp3, .webm, .ogg"
        value={ fileInputValue }
        disabled={ addSoundStatus === 'success' }
        onChange={ event => handleFileInputChange(event) }
      />
      <input
        type="text"
        placeholder="Enter a name for the sound"
        enterKeyHint="done"
        value={ nameInputValue }
        onChange={ event => handleNameInputChange(event) }
        disabled={ addSoundStatus === 'success' }
        onKeyDown={ e => { if (e.key === 'Enter') e.currentTarget.blur(); } }
      />
      { showConfirm && !addSoundStatus
        ? (
          <button
            type="submit"
            onClick={ addSound }
          >
            Go!
          </button>
        )
        : null }
      { !showConfirm && addSoundStatus !== 'success' && addSoundStatus !== 'pending' && autoSoundName && (
      <button type='button' onClick={ autoFillName }>
        <p>use suggested name</p>
        <p>{ autoSoundName }</p>
      </button>
      ) }
    </AddSoundDialogMain>
  );
};

export default AddSoundDialog;
