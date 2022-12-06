import PropTypes from 'prop-types';
import React from 'react';
import { Circle, Defs, Path, G, Filter, Rect  } from 'react-native-svg';
import Svg from '../Svg';

const ScanHeaderIcon = ({ color: givenColor, colors, ...props }) => {
  const color = givenColor || colors.black;
  return (
    <Svg fill="none" height="34" viewBox="0 0 34 34" width="34" {...props}>
      <G filter="url(#filter0_d_8_175)">
        <Circle cx="26.5" cy="26.5" r="19.5" fill="white"/>
      </G>
      <G clip-path="url(#clip0_8_175)">
        <Path d="M36 22.9414C35.9775 22.9883 35.9531 23.0323 35.9325 23.0792C35.8676 23.2245 35.7577 23.3451 35.619 23.4232C35.4803 23.5013 35.3202 23.5327 35.1623 23.5128C35.004 23.4966 34.8553 23.4291 34.7389 23.3205C34.6226 23.2119 34.5449 23.0682 34.5178 22.9114C34.5035 22.825 34.4969 22.7374 34.4981 22.6498C34.4981 21.538 34.4981 20.4259 34.4981 19.3137C34.4981 18.7766 34.2253 18.5038 33.6891 18.5033C32.5538 18.5033 31.418 18.5033 30.2827 18.5033C29.7642 18.5033 29.4211 18.118 29.4942 17.63C29.5336 17.367 29.685 17.1838 29.9222 17.0675L30.06 17H34.0678C34.0931 17.013 34.1197 17.0233 34.147 17.0309C34.9303 17.1758 35.4848 17.6178 35.8144 18.3369C35.9002 18.5244 35.9405 18.7339 36.0019 18.9336L36 22.9414Z" fill="black"/>
        <Path d="M18 29.0586C18.1097 28.7872 18.2728 28.5683 18.5761 28.4994C19.0734 28.3869 19.4986 28.7432 19.5019 29.2799C19.5061 30.0407 19.5019 30.8014 19.5019 31.5622C19.5019 31.9546 19.5019 32.3464 19.5019 32.7388C19.5056 33.2075 19.7916 33.4949 20.2575 33.4958C21.4106 33.4991 22.5638 33.4958 23.7164 33.4982C24.232 33.4982 24.5784 33.8839 24.5048 34.371C24.4655 34.6339 24.3141 34.8172 24.0769 34.9335L23.9395 35.0014H19.9336C19.9085 34.9884 19.8821 34.978 19.8548 34.9705C19.2488 34.8646 18.7711 34.5561 18.4083 34.0625C18.1894 33.7644 18.0834 33.4208 18 33.0678V29.0586Z" fill="black"/>
        <Path d="M30.0586 35L29.9048 34.9259C29.7612 34.8571 29.6434 34.744 29.5687 34.6033C29.494 34.4625 29.4664 34.3016 29.49 34.144C29.5097 33.9892 29.5786 33.8447 29.6865 33.7319C29.7944 33.6191 29.9357 33.5439 30.0895 33.5173C30.1761 33.5032 30.2638 33.4967 30.3516 33.4981C31.4578 33.4981 32.5641 33.4981 33.6703 33.4981C34.2295 33.4981 34.4967 33.2304 34.4967 32.6698C34.4967 31.5401 34.4967 30.4104 34.4967 29.2807C34.4967 28.7567 34.8956 28.4098 35.3873 28.4961C35.6419 28.5406 35.82 28.6906 35.9306 28.9222C35.9527 28.969 35.9775 29.0159 35.9981 29.06V33.0678C35.985 33.0983 35.9737 33.1296 35.9644 33.1615C35.7802 34.0465 35.2566 34.6278 34.3992 34.909C34.2895 34.9451 34.1761 34.9695 34.0645 34.999L30.0586 35Z" fill="black"/>
        <Path d="M23.9414 17C23.9883 17.0225 24.0352 17.0469 24.0792 17.0675C24.2273 17.1337 24.3496 17.2466 24.4273 17.3889C24.505 17.5312 24.5339 17.6951 24.5095 17.8555C24.4896 18.0102 24.4206 18.1545 24.3127 18.2672C24.2049 18.3799 24.0637 18.4551 23.91 18.4817C23.8234 18.496 23.7357 18.5026 23.648 18.5014C22.5361 18.5014 21.4242 18.5014 20.3123 18.5014C19.7756 18.5014 19.5038 18.7742 19.5033 19.3114C19.5033 20.4472 19.5033 21.5825 19.5033 22.7178C19.5033 23.2541 19.0748 23.6108 18.578 23.4983C18.2747 23.4298 18.1125 23.21 18.0019 22.9395V18.9336C18.015 18.9084 18.0254 18.8818 18.0328 18.8544C18.1369 18.2548 18.4416 17.7819 18.9267 17.4181C19.2281 17.1922 19.5769 17.0858 19.9355 17H23.9414Z" fill="black"/>
        <Path d="M20.6278 22.5008C20.6278 21.8155 20.6278 21.1302 20.6278 20.4449C20.6278 19.9236 20.9241 19.6292 21.4453 19.6283C22.6463 19.6283 23.847 19.6283 25.0477 19.6283C25.5544 19.6283 25.8563 19.9269 25.8577 20.4374C25.8614 21.8077 25.8614 23.1781 25.8577 24.5488C25.8577 25.0644 25.5506 25.3672 25.0369 25.3677C23.8419 25.3677 22.647 25.3677 21.4523 25.3677C20.9245 25.3677 20.6288 25.07 20.6278 24.5385C20.6266 23.8597 20.6266 23.1805 20.6278 22.5008ZM22.1334 21.1316V23.8555H24.3469V21.132L22.1334 21.1316Z" fill="black"/>
        <Path d="M26.6105 26.1055V25.8782C26.6105 24.2791 26.6105 22.68 26.6105 21.081C26.6105 20.5424 27.098 20.1791 27.592 20.3478C27.7252 20.3875 27.8438 20.4656 27.933 20.5722C28.0222 20.6788 28.078 20.8093 28.0936 20.9474C28.1044 21.0286 28.1091 21.1106 28.1077 21.1925C28.1077 23.0319 28.1077 24.8711 28.1077 26.7102C28.1077 27.3228 27.8264 27.6008 27.217 27.6008C25.3073 27.6008 23.3978 27.6008 21.4884 27.6008C21.3484 27.6041 21.2089 27.5825 21.0764 27.5371C20.7427 27.4086 20.5641 27.043 20.6395 26.6891C20.677 26.5212 20.7713 26.3714 20.9065 26.2651C21.0418 26.1587 21.2096 26.1023 21.3816 26.1055C23.0453 26.1036 24.7087 26.1036 26.3719 26.1055H26.6105Z" fill="black"/>
        <Path d="M23.1445 32.3722C22.5764 32.3722 22.0083 32.3722 21.4402 32.3722C20.9288 32.3722 20.6302 32.0746 20.6288 31.5674C20.6263 30.6946 20.6263 29.8219 20.6288 28.9494C20.6288 28.4549 20.9358 28.1483 21.4289 28.1469C22.583 28.1447 23.7367 28.1447 24.8902 28.1469C25.3702 28.1469 25.687 28.4582 25.687 28.9377C25.692 29.8221 25.692 30.7064 25.687 31.5908C25.6837 32.0633 25.372 32.368 24.9 32.3708C24.3159 32.375 23.7305 32.3717 23.1445 32.3722ZM22.1339 29.6563V30.868H24.1753V29.6563H22.1339Z" fill="black"/>
        <Path d="M29.8125 30.8698C29.872 30.8731 29.9119 30.8773 29.9531 30.8778H31.8637V28.6278C31.5802 28.6278 31.3012 28.6316 31.02 28.6278C30.638 28.6208 30.3553 28.4061 30.2653 28.0653C30.1467 27.6116 30.4692 27.1466 30.938 27.1334C31.5169 27.117 32.0972 27.1189 32.6766 27.1334C33.0816 27.1433 33.3694 27.477 33.3712 27.9116C33.375 28.8134 33.3712 29.7153 33.3712 30.6167C33.3712 30.9448 33.3745 31.273 33.3712 31.6011C33.3647 32.0666 33.0637 32.3726 32.5997 32.3741C31.4281 32.3784 30.2562 32.3784 29.0841 32.3741C28.6237 32.3741 28.3134 32.0637 28.3097 31.6001C28.3031 30.827 28.3031 30.0541 28.3097 29.2812C28.3125 28.8148 28.6341 28.4914 29.0737 28.4961C29.5003 28.5008 29.8087 28.8308 29.8106 29.2892C29.8139 29.8086 29.8125 30.327 29.8125 30.8698Z" fill="black"/>
        <Path d="M31.1039 19.6279C31.59 19.6279 32.0756 19.6279 32.5617 19.6279C33.0713 19.6279 33.3703 19.9255 33.3713 20.4336C33.3738 21.4171 33.3738 22.4005 33.3713 23.3839C33.3713 23.8888 33.067 24.1925 32.5613 24.1939C31.5834 24.1968 30.6058 24.1968 29.6283 24.1939C29.1127 24.1939 28.8066 23.8869 28.8052 23.3746C28.8024 22.3971 28.8024 21.4196 28.8052 20.4421C28.8052 19.9265 29.1108 19.6297 29.6288 19.6279C30.1205 19.6269 30.6122 19.6279 31.1039 19.6279ZM31.8684 21.1368H30.3216V22.6794H31.8684V21.1368Z" fill="black"/>
        <Path d="M30.2025 26.3896C30.1917 26.5386 30.1922 26.668 30.1706 26.7936C30.1055 27.1836 29.7773 27.4321 29.378 27.4091C29.195 27.3963 29.0233 27.316 28.8963 27.1837C28.7692 27.0514 28.6958 26.8767 28.6903 26.6933C28.6814 26.3366 28.6823 25.979 28.6903 25.6222C28.6929 25.4418 28.7617 25.2685 28.8838 25.1356C29.0059 25.0026 29.1726 24.9192 29.3522 24.9013C29.4102 24.8944 29.4686 24.8909 29.527 24.891C30.5925 24.891 31.658 24.891 32.7234 24.891C33.0464 24.891 33.3103 24.9941 33.4706 25.2885C33.5333 25.402 33.5651 25.5299 33.5629 25.6594C33.5608 25.789 33.5247 25.9158 33.4583 26.0271C33.392 26.1385 33.2976 26.2304 33.1846 26.294C33.0716 26.3575 32.944 26.3903 32.8144 26.3891C32.0123 26.3952 31.2103 26.3891 30.4087 26.3891L30.2025 26.3896Z" fill="black"/>
        <Path d="M26.2645 29.7969C26.2645 29.5217 26.2617 29.2461 26.2645 28.9709C26.2702 28.5312 26.5884 28.2031 27.0084 28.1984C27.4284 28.1937 27.7584 28.5195 27.7659 28.9569C27.7734 29.5194 27.7734 30.0819 27.7659 30.6444C27.767 30.7443 27.7481 30.8435 27.7102 30.9361C27.6724 31.0287 27.6164 31.1128 27.5456 31.1834C27.4749 31.254 27.3906 31.3097 27.298 31.3474C27.2053 31.385 27.1061 31.4036 27.0061 31.4023C26.5936 31.3944 26.2734 31.0686 26.2659 30.6415C26.2617 30.3594 26.2645 30.0781 26.2645 29.7969Z" fill="black"/>
      </G>
 </Svg>
  );
};

ScanHeaderIcon.propTypes = {
  color: PropTypes.string,
};

export default ScanHeaderIcon;
