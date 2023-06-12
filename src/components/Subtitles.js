import styled from 'styled-components';
import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-virtualized';
import unescape from 'lodash/unescape';
import debounce from 'lodash/debounce';

const Style = styled.div`
  position: relative;
  //box-shadow: 0px 5px 25px 5px rgb(0 0 0 / 80%);
  background-color: rgb(0 0 0 / 100%);

  .speakers-wrapper {
    ul {
      list-style: none;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 5px;

      li {
        width: auto;
      }
    }

    .btn {
      background-color: #009688;
      padding-left: 20px;
      padding-right: 20px;
      opacity: 50%;

      &.active {
        opacity: 100%;
      }
    }
  }

  .ReactVirtualized__Table {
    .ReactVirtualized__Table__Grid {
      outline: none;
    }

    .ReactVirtualized__Table__row {
      .item {
        height: 100%;
        padding: 5px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;

        .textarea {
          flex: 1;
          border: none;
          width: 100%;
          //height: 100%;
          color: #fff;
          font-size: 12px;
          padding: 10px;
          text-align: center;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
          resize: none;
          outline: none;

          &.highlight {
            background-color: rgb(0 87 158);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          &.illegal {
            background-color: rgb(123 29 0);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        }

        .item-bar {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          justify-content: space-evenly;

          input {
            background-color: transparent;
            color: white;
            border: none;
            width: 90%;
          }
        }

        .item-timing {
          width: 80px;
          font-size: 11px;

          .timing-duration {
            opacity: 40%;
          }
        }

        .item-actions {
          width: 30px;
          font-size: 16px;
          padding-left: 5px;

          button {
            background-color: transparent;
            border: none;
            width: 100%;
            min-height: 30px;
            opacity: 75%;
            cursor: pointer;

            &:hover {
              opacity: 100%;
            }
          }
        }
      }
    }
  }
`;

export default function Subtitles({ currentIndex, subtitle, checkSub, player, updateSub }) {
    const [height, setHeight] = useState(100);

    const resize = useCallback(() => {
        setHeight(document.body.clientHeight - 170);
    }, [setHeight]);

    useEffect(() => {
        resize();
        if (!resize.init) {
            resize.init = true;
            const debounceResize = debounce(resize, 500);
            window.addEventListener('resize', debounceResize);
        }
    }, [resize]);

    return (
        <Style className='subtitles'>
            <div className="speakers-wrapper">
                <ul>
                    <li>
                        <button className='btn active'>Speaker 1</button>
                    </li>
                    <li>
                        <button className='btn'>Speaker 2</button>
                    </li>
                </ul>
            </div>
            <Table
                headerHeight={40}
                width={500}
                height={height}
                rowHeight={80}
                scrollToIndex={currentIndex}
                rowCount={subtitle.length}
                rowGetter={({ index }) => subtitle[index]}
                headerRowRenderer={() => null}
                rowRenderer={(props) => {
                    return (
                        <div
                            key={props.key}
                            className={props.className}
                            style={props.style}
                            onClick={() => {
                                if (player) {
                                    player.pause();
                                    if (player.duration >= props.rowData.startTime) {
                                        player.currentTime = props.rowData.startTime + 0.001;
                                    }
                                }
                            }}
                        >
                            <div className='item'>
                                <div className='item-bar item-timing'>
                                    <input type='text' value='00:00:30.33' />
                                    <input className='timing-duration' type='text' value='00:40.01' disabled={true} />
                                    <input type='text' value='00:01:10.32' />
                                </div>
                                <textarea
                                    maxLength={200}
                                    spellCheck={false}
                                    className={[
                                        'textarea',
                                        currentIndex === props.index ? 'highlight' : '',
                                        checkSub(props.rowData) ? 'illegal' : '',
                                    ]
                                        .join(' ')
                                        .trim()}
                                    value={unescape(props.rowData.text)}
                                    onChange={(event) => {
                                        updateSub(props.rowData, {
                                            text: event.target.value,
                                        });
                                    }}
                                />
                                <div className='item-bar item-actions'>
                                    <button className="generateVoice">⏺</button>
                                    <button className="playVoice">⏯</button>
                                </div>
                            </div>
                        </div>
                    );
                }}
            ></Table>
        </Style>
    );
}
