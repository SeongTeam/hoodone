import React from "react";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

export interface RouteInterface {
    name: string;
    path: string;
    icon: React.ReactNode;
    childenRoutes? : RouteInterface[];
  }
  

/*TODO
- Icon load delay를 없애기 위해, 직접 아이콘 리소스를 생성하여 public 폴더에 넣기
*/
export function getRoutes(currentRoute : string) : RouteInterface[] {

    const current = currentRoute.toLowerCase();
    const defaultRoutes : RouteInterface[] = [
      {
          name: 'home',
          path: '/',
          icon: <Icon icon="iconamoon:home-fill" width="24px" height="24px"/>,
      },
      {
          name: 'quest',
          path: '/quest',
          icon: <Icon icon="arcticons:block-blast-adventure-master" width="26px" height="26px"/>,
      },
      {
          name: 'submission',
          path: '/sb',
          icon: <Icon icon="carbon:certificate-check" width="24px" height="24px"/>,
      },
  ];
  
  const authRoutes : RouteInterface[] = [
      {
          name: 'Sign in',
          path: '/authentication/sign-in',
          icon: null,
      },
      {
          name: 'Sign Up',
          path: '/authentication/sign-up',
          icon: null,
      },
      {
          name: 'Reset Password',
          path: '/authentication/reset-password',
          icon: null,
      }, 
  ];
  
  const profileRoutes : RouteInterface[] = [
      {
          name: 'Favorite Quests',
          path: '/profile/favorite-quests',
          icon: null,
      },
      {
          name: 'user quests',
          path: '/profile/quests',
          icon: null,
      },
      {
          name: 'user submissions',
          path: '/profile/submissions',
          icon: null,
      },
      {
        name: 'Profile settings',
        path: '/profile',
        icon: null,
    },
  ];
  
    const rootSegment = current.split("/") [1];
  
    switch (rootSegment) {
      case "authentication":
        return authRoutes;
      case "profile":
        return profileRoutes;
      default:
        return defaultRoutes;
    }
  
    return defaultRoutes;
    
  }