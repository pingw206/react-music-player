import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from 'styled-components';

const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`

const Scroll = forwardRef((props, ref) => {
    const [bScroll, setBcroll] = useState();
    const scrollContainerRef = useRef();
    const {direction, click, refresh, bounceTop, bounceBottom } = props;
    const { pullUp, pullDown, onScroll } = props;
    
    useEffect(()=>{
        const scroll = new BScroll(scrollContainerRef.current, {
            scrollX:direction === "horizontal",
            scrollY: direction === "vertical",
            probeType: 3,
            click: click,
            bounce:{
                top: bounceTop,
                bottom:bounceBottom
            }
        });
        setBscroll(scroll);
        return () => {
            setBscroll(null);
        }
    },[]);
})