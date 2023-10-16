import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setSettings } from '../store/settingsReducer';

const Style = styled.div`
    //position: absolute;
`;

export default function CatWrap() {
    // const dispatch = useDispatch();
    // const showCat = useSelector(store => store.settings.showCat);
    // const [showingCat, setShowingCat] = useState(false);
    // console.log('INI');
    // if (showCat && !showingCat && Math.random() > 0.4) {
    //   console.log('SHOW');
    //   setTimeout(() => {
    //     setShowingCat(false);
    //     dispatch(setSettings({ showingCat: false }));
    //     console.log('HIDE');
    //   }, 5000);
    //
    //   return (
    //     <Style>
    //       <img src='/images/cats/transparent.gif' alt='Тут был кот' />
    //     </Style>
    //   );
    // } else {
    //   dispatch(setSettings({ showingCat: false }));
    // }

    return <></>;
}
