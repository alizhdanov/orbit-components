// @flow
import * as React from "react";
import styled, { css } from "styled-components";

import defaultTokens from "../defaultTokens";
import Portal from "../Portal";
import ClickOutside from "../ClickOutside";

import type { Props } from "./index";

const resolvePopoverAnchor = ({
  containerTop,
  containerLeft,
  containerHeight,
  containerWidth,
  PopoverHeight,
  PopoverWidth,
}: Props) => {
  return css`
    left: ${Math.floor(containerLeft)}px;
  `;
};

const resolvePopoverPosition = ({
  containerTop,
  containerLeft,
  containerHeight,
  containerWidth,
  tooltipHeight,
  tooltipWidth,
}: Props) => {
  return css`
    top: ${Math.floor(containerTop + containerHeight)}px;
  `;
};

const PopoverChild = styled.div`
  position: relative;
`;
PopoverChild.defaultProps = {
  theme: defaultTokens,
};

const PopoverContent = styled.div`
  background: transparent;
`;
PopoverContent.defaultProps = {
  theme: defaultTokens,
};

const PopoverParent = styled.div`
  position: absolute;
  ${css`
    ${resolvePopoverPosition}
    ${resolvePopoverAnchor}
  `}
  border-radius: ${({ theme }) => theme.orbit.borderRadiusNormal};
  background-color: #ffffff;
  padding: ${({ theme }) => theme.orbit.spaceSmall};
  padding-top: ${({ theme }) => theme.orbit.spaceMedium};
  box-shadow: ${({ theme }) => theme.orbit.boxShadowElevatedLevel1};
  z-index: ${({ theme }) => theme.orbit.zIndexOnTheTop};
`;
PopoverParent.defaultProps = {
  theme: defaultTokens,
};

class Popover extends React.PureComponent<Props, State> {
  state = {
    shown: false,
  };

  handleIn = () => {
    this.setState({ shown: true });
  };

  handleOut = () => {
    this.setState({ shown: false });
  };

  handleClick = () => {
    this.setState({ shown: !this.state.shown });
  };

  handleClickOutside = () => {
    this.timeOutOutside = setTimeout(() => {
      this.setState({ shown: false });
    });
  };
  handleClickContent = () => {
    clearTimeout(this.timeOutOutside);
  };

  container: { current: any | HTMLDivElement } = React.createRef();

  render() {
    const { shown } = this.state;
    const { children, content } = this.props;
    const { handleClickContent } = this;

    return (
      <React.Fragment>
        <PopoverChild onClick={this.handleClick} ref={this.container}>
          <ClickOutside onClickOutside={this.handleClickOutside}>{children}</ClickOutside>
        </PopoverChild>
        {shown && (
          <Portal>
            <PopoverContentWrapper
              containerRef={this.container}
              content={content}
              handleClickContent={handleClickContent}
            />
          </Portal>
        )}
      </React.Fragment>
    );
  }
}

class PopoverContentWrapper extends React.PureComponent<Props, State> {
  state = {
    reRender: false,
  };

  componentDidMount() {
    this.setDimensions();
  }

  setDimensions = () => {
    if (
      this.props.containerRef.current &&
      this.popover &&
      this.content &&
      typeof window !== "undefined"
    ) {
      const containerDimensions = this.props.containerRef.current.getBoundingClientRect();
      const popoverDimensions = this.popover.current.getBoundingClientRect();

      // container positions and dimensions for calculation
      const containerTop = containerDimensions.top;
      const containerLeft = containerDimensions.left;
      const containerHeight = containerDimensions.height;
      const containerWidth = containerDimensions.width;

      // popover dimensions for calculation
      const popoverHeight = popoverDimensions.height;
      const popoverWidth = popoverDimensions.width;

      // window dimensions for calculation
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      this.containerTop = containerTop;
      this.containerLeft = containerLeft;
      this.containerHeight = containerHeight;
      this.containerWidth = containerWidth;
      this.popoverHeight = popoverHeight;
      this.popoverWidth = popoverWidth;
      this.windowWidth = windowWidth;
      this.windowHeight = windowHeight;

      this.contentHeight =
        this.content.current && this.content.current.getBoundingClientRect().height;

      this.setState({ reRender: !this.state.reRender });
    }
  };

  containerTop: number = 0;
  containerLeft: number = 0;
  containerHeight: number = 0;
  containerWidth: number = 0;
  popoverWidth: number = 0;
  popoverHeight: number = 0;
  windowWidth: number = 0;
  windowHeight: number = 0;
  contentHeight: number = 0;

  popover: { current: any | HTMLDivElement } = React.createRef();
  content: { current: any | HTMLDivElement } = React.createRef();

  render() {
    const {
      containerTop,
      containerLeft,
      containerHeight,
      containerWidth,
      popoverHeight,
      popoverWidth,
    } = this;
    const { shown, content, handleClickContent } = this.props;
    return (
      <PopoverParent
        shown={shown}
        containerTop={containerTop}
        containerLeft={containerLeft}
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        popoverHeight={popoverHeight}
        popoverWidth={popoverWidth}
        ref={this.popover}
        reRender={this.state.reRender}
        onClick={handleClickContent}
      >
        <PopoverContent ref={this.content}>{content}</PopoverContent>
      </PopoverParent>
    );
  }
}

export default Popover;