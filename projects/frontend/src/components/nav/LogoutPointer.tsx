import React, { FC } from 'react';
import styled from 'styled-components';

const LogoutPointerMain = styled.img`
  position: absolute;
  top: -8px;
  left: 40px;

  @media only screen and (max-width: 780px) {
    width: 22px;
    top: -7px;
    left: 23px;
  }
`;

const LogoutPointer: FC = () => (
  // eslint-disable-next-line max-len
  <LogoutPointerMain src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAICAMAAAAldJTcAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAPFBMVEXBuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP3BuP0AAABV8EQTAAAAEnRSTlMAWMhXHaemHOLhY+7thf3x8IRfavZpAAAAAWJLR0QTDLtclgAAAAlwSFlzAAASdAAAEnQB3mYfeAAAAAd0SU1FB+YIHRUPHvmw1osAAABCSURBVAjXZctBDoAgFAPRIiKKCjj3P6wxGOOHt2w60sdNXqM5AEvsZ7fy2Px4bv7Je8YmMWC1JO30jiSd5FKtkrluiNcGRa90EegAAAAASUVORK5CYII=' />
);

export default LogoutPointer;
