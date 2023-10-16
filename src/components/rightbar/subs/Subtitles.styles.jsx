import styled from 'styled-components';
import { borderRadius } from '../../../styles/constants';

export const Style = styled.div`
    height: 100%;
    width: 100%;

    .ReactVirtualized__Table {
        height: 100%;
        width: 100%;

        .ReactVirtualized__Table__Grid {
            outline: none;
            height: 100%;
        }

        .ReactVirtualized__Grid__innerScrollContainer {
            padding-bottom: 40px;
        }

        .ReactVirtualized__Table__row {
            .item {
                height: 100%;
                padding: 5px;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                border: 0 solid transparent;

                &.highlight {
                    background-color: rgba(10, 10, 10, 0.33);

                    textarea {
                        border: 2px solid var(--c-speaker);
                        //border: 1px solid rgba(255, 255, 255, 0.3);
                    }
                }

                &.illegal {
                    border-left: solid var(--c-danger);
                    border-width: 1px 0 1px 10px !important;
                    border-top: solid transparent;
                    border-bottom: solid transparent;
                }

                .textarea {
                    flex: 1;
                    width: 100%;
                    //height: 100%;
                    color: #fff;
                    font-size: 12px;
                    padding: 10px;
                    text-align: center;
                    background-color: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.2s ease;
                    resize: none;
                    outline: none;

                    &.textarea-left {
                        border-top-left-radius: ${borderRadius};
                        border-bottom-left-radius: ${borderRadius};
                    }

                    &.textarea-right {
                        border-top-right-radius: ${borderRadius};
                        border-bottom-right-radius: ${borderRadius};
                    }
                }

                .item-info {
                    width: 170px;
                    font-size: 11px;

                    .dimmed {
                        color: var(--c-text);
                        opacity: 80%;
                    }
                }

                .item-bar {
                    display: flex;
                    flex-direction: column;
                    flex-wrap: nowrap;
                    justify-content: space-evenly;
                    margin-right: 4px;

                    .item-bar-center-row {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        justify-content: space-between;

                        > * {
                            text-align: center;

                            &:first-child {
                                width: 46%;
                                max-width: 46%;
                                text-align: right;
                            }

                            &:last-child {
                                width: 46%;
                                max-width: 46%;
                                text-align: left;
                            }
                        }
                    }

                    .item-bar-row {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        gap: 7px;
                        padding-left: 3px;
                    }

                    input {
                        background-color: transparent;
                        color: white;
                        border: none;
                        flex: 1;
                        width: 90%;

                        &.invalid {
                            color: var(--c-danger);
                            filter: brightness(200%);
                        }

                        &[type='time'] {
                            letter-spacing: -0.5px;
                        }
                    }
                }

                .item-index {
                    margin: 5px 8px 5px 0;
                    padding-right: 4px;
                    border-right: 2px solid #838383;
                    border-radius: 1px;
                    font-size: 10px;
                    font-weight: bold;
                }

                .item-actions {
                    font-size: 16px;
                    padding-top: 8px;
                    justify-content: center;

                    button {
                        background-color: transparent;
                        border: none;
                        min-height: 20px;
                        opacity: 33%;
                        cursor: pointer;

                        &:not([disabled]):hover {
                            opacity: 100%;
                        }

                        &[disabled] {
                            cursor: not-allowed;
                            opacity: 20%;
                        }
                    }

                    .highlight {
                        opacity: 80%;
                    }
                }

                .item-icon {
                    margin: 0 8px;
                    opacity: 50%;
                }
            }
        }
    }

    .time-sep {
        padding-bottom: 1px;
    }
`;
