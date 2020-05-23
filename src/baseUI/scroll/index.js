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
    const [bScroll, setBScroll] = useState();
    const scrollContainerRef = useRef();
    const {direction, click, refresh, bounceTop, bounceBottom } = props;
    const { pullUp, pullDown, onScroll } = props;
    // 创建better-scroll
    useEffect(()=>{
        const scroll = new BScroll(scrollContainerRef.current, {
            scrollX: direction === "horizontal",
            scrollY: direction === "vertical",
            probeType: 3,
            click: click,
            bounce:{
                top: bounceTop,
                bottom:bounceBottom
            }
        });
        setBScroll(scroll);
        return () => {
            setBScroll(null);
        }
    },[]);
    // 给实例绑定scroll事件
    useEffect(()=>{
        if (!bScroll || !onScroll) {
            return;
        }
        bScroll.on('scroll', onScroll) 
        return ()=>{
            bScroll.off('scroll',onScroll);
        }
    },[onScroll, bScroll]);
    //上拉到底的判断，调用上拉刷新函数
    useEffect(() => {
        if(!bScroll || !pullUp){
            return;
        }
        //判断是否滑到底部
        bScroll.on('scrollEnd',() => {
            if (bScroll.y <= bScroll.maxScrollY + 100){
                pullUp();
            }
        });
        return () => {
            bScroll.off('scrollEnd');
        }
    },[pullUp, bScroll]);
    //下拉到底的判断，调用下拉刷新函数
    useEffect(() => {
        if(!bScroll || !pullDown){
            return;
        }
        bScroll.on('touchEnd',(pos) => {
            //判断下拉动作
            if(pos.y > 50){
                pullDown();
            }
        });
        return () => {
            bScroll.off('touchEnd');
        }
    },[pullDown, bScroll]);
    //每次重新渲染都要刷新实例，防止无法滑动
    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh();
        }
    });
    // 用React Hooks 中的 useImperativeHandle来给外界暴露组件方法
    //一般和forwardRef一起用，ref已经在forwardRef中默认传入
    useImperativeHandle(ref, () => ({
        //给外界暴露refresh方法
        refresh() {
            if(bScroll){
                bScroll.refresh();
                bScroll.scrollTo(0,0);
            }
        },
        //给外界暴露getBScroll 方法， 提供bs实例
        getBscroll () {
            if (bScroll) {
                return bScroll;
            }
        }
    }));
    //UI 渲染 
    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
        </ScrollContainer>
    );
})
//给可能用到的参数赋默认值
Scroll.defaultProps = {
    direction: "vertical",
    click: true,
    refresh: true,
    onScroll: null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
};
//该组件需要接受的参数
Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical','horizontal']),
    refresh: PropTypes.bool,
    onScroll: PropTypes.func,
    pullUp: PropTypes.func,
    pullDown: PropTypes.func,
    pullUpLoading: PropTypes.bool,
    pullDownLoading: PropTypes.bool,
    bounceTop: PropTypes.bool,
    bounceBottom: PropTypes.bool
};

export default Scroll;