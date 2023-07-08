import React, { Component } from "react";

class CarouselNavigate extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.itemRef = React.createRef();
  }

  calcItemWidth = () => {
    const screenWidth = document.body.clientWidth;
    let scrollWidth = this.itemRef.current.clientWidth;
    if (screenWidth > 520) scrollWidth *= 1.5;
    return scrollWidth;
  };

  handleScrollLeft = () => {
    this.scrollRef.current.scrollLeft -= this.calcItemWidth();
  };
  handleScrollRight = () => {
    const clientWidth = this.scrollRef.current.clientWidth;
    const scrollWidth = this.scrollRef.current.scrollWidth;
    console.log(clientWidth);
    console.log(scrollWidth);
    this.scrollRef.current.scrollLeft += this.calcItemWidth();
    if (
      this.scrollRef.current.scrollLeft + clientWidth + this.calcItemWidth() >=
      scrollWidth
    ) {
      console.log("DONE");
    }
  };
}

export default CarouselNavigate;
