import type { UsersData } from './types';

// Images
import avatarTsao from '../assets/images/img-avatar-tsao.png';
import avatarXian from '../assets/images/img-avatar-xian.png';
import avatarFu from '../assets/images/img-avatar-fu.png';
import avatarWei from '../assets/images/img-avatar-wei.png';

export const USERS: UsersData = {
  tsao: {
    id: 'tsao',
    name: '曹',
    nickname: '快樂的山大王',
    color: 'from-pink-500 to-rose-500',
    icon: '曹',
    avatar: avatarTsao,
    content: '孤單一路/雙魚',
  },
  chang: {
    id: 'chang',
    name: '張',
    nickname: '真嗣我婆',
    color: 'from-blue-500 to-cyan-500',
    icon: '張',
    avatar: avatarXian,
    content: '站在原地/射手',
  },
  hsu: {
    id: 'hsu',
    name: '許福',
    nickname: '芙不起我婆',
    color: 'from-green-500 to-emerald-500',
    icon: '福',
    avatar: avatarFu,
    content: '爆走王/牡羊',
  },
  wei: {
    id: 'wei',
    name: '威',
    nickname: '威威口乾舌燥大概欠吻',
    color: 'from-yellow-500 to-orange-500',
    icon: '威',
    avatar: avatarWei,
    content: '愛的傷兵/天蠍',
  },
};
