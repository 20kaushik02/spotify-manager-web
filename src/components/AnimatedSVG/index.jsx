import React from 'react';
import styles from "./AnimatedSVG.module.css";

const AnimatedSVG = ({ stroke = "#ffffff" }) => {
  return (
    <div className={styles.svgWrapper}>
      {/* width, height and viewBox are necessary */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="256" height="256" // adjust size here
        viewBox="0 0 512 512"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)">
          <path
            d="M1480 4540 c-20 -20 -20 -33 -20 -611 0 -379 4 -597 10 -609 19 -36
            72 -40 548 -40 l462 0 0 -275 0 -275 -881 0 c-650 0 -886 -3 -902 -12 -46 -24
            -46 -26 -47 -375 l0 -333 -289 0 c-159 0 -301 -4 -314 -9 -47 -18 -48 -23 -45
            -734 l3 -669 24 -19 c22 -18 49 -19 696 -19 665 0 673 0 699 21 l26 20 0 683
            c0 681 0 683 -21 702 -20 18 -42 19 -320 22 l-299 3 0 279 0 280 835 0 835 0
            0 -280 0 -279 -300 -3 c-296 -3 -300 -3 -322 -26 l-23 -23 0 -680 0 -681 24
            -19 c22 -18 49 -19 701 -19 652 0 679 1 701 19 l24 19 0 681 0 680 -23 23
            c-22 23 -26 23 -322 26 l-300 3 0 279 0 280 835 0 835 0 0 -280 0 -279 -300
            -3 c-296 -3 -300 -3 -322 -26 l-23 -23 -3 -647 c-2 -356 0 -662 3 -680 3 -18
            15 -42 26 -53 18 -18 39 -19 698 -19 653 0 680 1 702 19 l24 19 0 681 0 680
            -23 23 c-22 23 -26 23 -322 26 l-300 3 0 329 c0 180 -3 336 -6 345 -18 45 -9
            45 -944 45 l-880 0 0 275 0 275 463 0 c475 0 528 4 547 40 6 12 10 230 10 607
            0 579 0 590 -20 611 l-21 22 -1059 0 c-1047 0 -1060 0 -1080 -20z m2020 -615
            l0 -475 -940 0 -940 0 0 475 0 475 940 0 940 0 0 -475z m-2202 -2642 l2 -563
            -570 0 -570 0 0 565 0 565 568 -2 567 -3 3 -562z m1832 2 l0 -565 -570 0 -570
            0 0 565 0 565 570 0 570 0 0 -565z m1830 0 l0 -565 -570 0 -570 0 0 558 c0
            307 3 562 7 565 3 4 260 7 570 7 l563 0 0 -565z"
            stroke={stroke}
            strokeWidth="32px"
            strokeMiterlimit={10}
            fill="none"
            id="svglength"
          // document.getElementById('svglength').getTotalLength()
          />
        </g>
      </svg>
    </div>
  )
}

export default AnimatedSVG;
