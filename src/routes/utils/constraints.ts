// import { Router } from 'react-router-dom';
import { website, player, dashboard } from '../index'

export const APPS = [
  {
    subDomain: 'www',
    app: website,
    main: false,
  },
  {
    subDomain: 'app',
    app: dashboard,
    main: true,
  },
  {
    subDomain: 'quiz',
    app: player,
    main: false,
  },
]
