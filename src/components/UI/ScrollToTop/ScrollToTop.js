import React, { useState, useEffect } from 'react'
// import styled from 'styled-components'

const ScrollingWrapper = props => {
    const scrollingWrapper = useRef(null)

    const { hasScrolled, setHasScrolled } = useState(false)
    useEffect(() => {
        scrollingWrapper.current.addEventListener('scroll', onScroll)
        return () => {
            cleanup
        }
    }, [])


    onScroll = () => {
        if (this.scrollingWrapper.scrollTop > 100 && !this.state.hasScrolled) {
            setHasScrolled(true)
        } else if (this.scrollingWrapper.scrollTop < 100 && this.state.hasScrolled) {
            setHasScrolled(false)
        }
    }

    scrollToTop = () => {
        this.scrollingWrapper.scrollTop = 0
    }

    reference = id => ref => {
        this[id] = ref
    }

    render() {
        return (
            <React.Fragment>
                {hasScrolled && (
                    <ScrollToTopIconContainer onClick={scrollToTop}>
                        <div>^</div>
                        <Button>BACK TO TOP</Button>
                    </ScrollToTopIconContainer>
                )}
                <ScrollingWrapperContainer ref={reference('scrollingWrapper')}>
                    {props.children}
                </ScrollingWrapperContainer>
            </React.Fragment>
        )
    }
}

export default ScrollingWrapper

const ScrollingWrapperContainer = styled.div`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  position: relative;
`

const ScrollToTopIconContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  margin-left: -50px;
  z-index: 2;
  cursor: pointer;
  opacity: 0.4;
  text-align: center;
  &:hover {
    opacity: 1;
    animation: wiggle 1s ease;
    animation-iteration-count: 1;
  }
  @keyframes wiggle {
    20% { transform: translateY(6px); }
    40% { transform: translateY(-6px); }
    60% { transform: translateY(4px); }
    80% { transform: translateY(-2px); }
    100% { transform: translateY(0); }
  }
`

const Button = styled.div`
  background: black;
  color: white;
  font-family: Teko;
  font-size: 16px;
  line-height: 30px;
  border-radius: 15px;
  width: 100px;
  padding-top: 4px;
`