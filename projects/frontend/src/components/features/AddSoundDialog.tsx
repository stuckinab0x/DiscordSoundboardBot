import React, { FC, useState, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import styled, { css } from 'styled-components';
import * as mixins from '../../styles/mixins';

function randomSuccessMessage() {
  const messages = ['The cloud awaits...', 'sv_gravity -800', 'Maybe you\'re actually falling tho.', 'ZOOM', 'TO THE SKY REALM',
    'SOUNDS FOR THE SOUND GOD', 'NOOOOO THIS FILE IS FULL OF HELIUM'];
  return messages[Math.floor(Math.random() * messages.length)];
}

const defaultMessage = 'Upload a new sound file';

const AddSoundSuccess = css`
  transition-property: top;
  transition-timing-function: ease-in;
  transition-duration: 2s;
  top: -50vh;

  ${ mixins.buttonGreen }
`;

interface AddSoundDialogMainProps {
  statusStyle: string;
}

const AddSoundError = css`
  animation: shake 0.5s 1 linear;

  ${ mixins.buttonRed }
`;

const AddSoundDialogMain = styled.div<AddSoundDialogMainProps>`
  color: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: ${ props => props.theme.colors.innerA };
  position: absolute;
  border: solid 5px ${ props => props.theme.colors.accent };
  border-radius: 5px;
  right: 5px;
  top: 64px;
  padding: 10px;
  box-shadow: 0px 5px 10px 3px ${ props => props.theme.colors.innerB };

  ${ props => {
    if (props.statusStyle === 'success') return AddSoundSuccess;
    if (props.statusStyle === 'error') return AddSoundError;
    return null;
  } }

  > h4 {
    margin: 0;
    margin-bottom: 10px;
  }

  > input {
    ${ mixins.textInput }
    width: auto;
    margin-bottom: 4px;
  }

  > button {
    ${ mixins.button }
    ${ mixins.filterButton }
    border-color: ${ props => props.theme.colors.borderGold };
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
    right: 44px;
    top: 50px;
    
    > input {
       margin-bottom: 5px;
    }
  }
`;

interface AddSoundDialogProps {
  setShowAddsound: (show: boolean) => void;
  setDisableAddSoundButton: (disable: boolean) => void;
}

const AddSoundDialog: FC<AddSoundDialogProps> = ({ setShowAddsound, setDisableAddSoundButton }) => {
  const [message, setMessage] = useState(defaultMessage);
  const [addSoundStyle, setAddSoundStyle] = useState('');
  const [fileInputValue, setFileInputValue] = useState('');
  const [fileInputFiles, setFileInputFiles] = useState<FileList | null>(null);
  const [nameInputValue, setNameInputValue] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);

  const { mutate } = useSWRConfig();

  const addSound = useCallback(async () => {
    if (!fileInputValue) return;
    const formData = new FormData();
    if (nameInputValue) formData.append('custom-name', nameInputValue);
    if (fileInputFiles) formData.append('sound-file', fileInputFiles[0]);

    try {
      setShowConfirm(false);
      const addSoundRes = await fetch('/api/sounds/', {
        method: 'POST',
        body: formData,
      });
      if (addSoundRes.status === 409) throw new Error('Sound already exists');
      setDisableAddSoundButton(true);
      setMessage(randomSuccessMessage());
      setAddSoundStyle('success');
      setDisableInputs(true);
      await mutate('/api/sounds');
      setTimeout(() => {
        setShowAddsound(false);
        setFileInputValue('');
        setNameInputValue('');
        setFileInputFiles(null);
        setDisableInputs(false);
        setMessage(defaultMessage);
        setAddSoundStyle('');
        setDisableAddSoundButton(false);
      }, 2100);
    } catch (error: any) {
      setAddSoundStyle('error');
      if (error.message === 'Sound already exists') setMessage('Whoops, a sound already has that name');
      else setMessage('Yikes! Something went wrong');
      setTimeout(() => {
        setAddSoundStyle('');
        setMessage(defaultMessage);
      }, 3500);
    }
  }, [fileInputValue, nameInputValue]);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const supportedFileTypes = ['wav', 'mp3', 'webm', 'ogg'];
    const path = event.target.value.split('.');
    const extension = path[path.length - 1].toLowerCase();

    if (!supportedFileTypes.includes(extension) && event.target.value) {
      event.target.value = '';
      setFileInputValue('');
      setShowConfirm(false);
      setAddSoundStyle('error');
      setMessage('WRONG FILE TYPE (try: wav mp3 webm ogg)');
      setTimeout(() => {
        setAddSoundStyle('');
        setMessage('Upload a new sound file');
      }, 3500);
      return;
    }

    setFileInputValue(event.target.value);
    setFileInputFiles(event.target.files);
    if (event.target.value && nameInputValue) setShowConfirm(true);
    else setShowConfirm(false);
  }, [nameInputValue]);

  const handleNameInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNameInputValue(event.target.value);
    if (!fileInputValue || !event.target.value) {
      setShowConfirm(false);
      return;
    }
    if (fileInputValue && event.target.value) setShowConfirm(true);
  }, [fileInputValue]);

  return (
    <AddSoundDialogMain statusStyle={ addSoundStyle }>
      <h4>{ message }</h4>
      <input
        type="file"
        accept=".wav, .mp3, .webm, .ogg"
        value={ fileInputValue }
        disabled={ disableInputs }
        onChange={ event => handleFileInputChange(event) }
      />
      <input
        type="text"
        name=""
        placeholder="Enter a name for the sound"
        enterKeyHint="done"
        value={ nameInputValue }
        onChange={ event => handleNameInputChange(event) }
        disabled={ disableInputs }
        onKeyDown={ e => { if (e.key === 'Enter') e.currentTarget.blur(); } }
      />
      { showConfirm
        ? (
          <button
            type="submit"
            onClick={ addSound }
          >
            Go!
          </button>
        )
        : null }
    </AddSoundDialogMain>
  );
};

export default AddSoundDialog;
