import React from "react";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { profile } from "console";
import { create } from "domain";

export interface RouteInterface {
    name: string;
    path: string;
    icon: React.ReactNode;
    childenRoutes? : RouteInterface[];
  }
  

/*TODO
- Icon load delay를 없애기 위해, 직접 아이콘 리소스를 생성하여 public 폴더에 넣기
*/

export const RouteTable  = {
  defaultRoute : {
    root : '',
    home : '/',
    quest : '/quest',
    submission : '/sb',
  },

  authRoute : {
    root : 'authentication',
    signIn : '/authentication/sign-in',
    signUp : '/authentication/sign-up',
    resetPassword : '/authentication/reset-password',
  },

  profileRoute : {
    root : 'profile',
    profile : '/profile',
    FavoriteQuests : '/profile/favorite-quests',
    ownQuest : '/profile/own-quest',
    ownSubmission : '/profile/own-submission',
  },
  QuestRoute : {
    root : 'quest',
    quest : '/quest',
    create : '/quest/create',
    getEdit : (questId : string) => `/quest/${questId}/edit`,
    getDetail : (questId : string) => `/quest/${questId}`, 
    getDetailComment : (questId : string, commentId : string) => `/quest/${questId}/comment/${commentId}`,
  },

  SubmissionRoute : {
    root : 'sb',
    sb : '/sb',
    getCreate : (parentQuestID : string) => `/sb/create/${parentQuestID}`,
    getEdit : (sbId : string) => `/sb/${sbId}/edit`,
    getDetail : (sbId : string) => `/sb/${sbId}`, 
    getDetailComment : (sbId : string, commentId : string) => `/sb/${sbId}/comment/${commentId}`,
  }

}

export function getRoutes(currentRoute : string) : RouteInterface[] {

    const current = currentRoute.toLowerCase();
    const defaultRoutes : RouteInterface[] = [
      {
          name: 'home',
          path: RouteTable.defaultRoute.home,
          icon: <Icon icon="iconamoon:home-fill" width="24px" height="24px"/>,
      },
      {
          name: 'quest',
          path: RouteTable.defaultRoute.quest,
          icon: <Icon icon="arcticons:block-blast-adventure-master" width="26px" height="26px"/>,
      },
      {
          name: 'submission',
          path: RouteTable.defaultRoute.submission,
          icon: <Icon icon="carbon:certificate-check" width="24px" height="24px"/>,
      },
  ];
  
  const authRoutes : RouteInterface[] = [
      {
          name: 'Sign-in',
          path: RouteTable.authRoute.signIn,
          icon: null,
      },
      {
          name: 'Sign-Up',
          path: RouteTable.authRoute.signUp,
          icon: null,
      },
      {
          name: 'Reset-Password',
          path: RouteTable.authRoute.resetPassword,
          icon: null,
      }, 
  ];
  
  const profileRoutes : RouteInterface[] = [
      {
        name: 'Profile settings',
        path: RouteTable.profileRoute.profile,
        icon: null,
      },
      {
          name: 'Favorite Quests',
          path: RouteTable.profileRoute.FavoriteQuests,
          icon: null,
      },
      {
          name: 'user quests',
          path: RouteTable.profileRoute.ownQuest,
          icon: null,
      },
      {
          name: 'user submissions',
          path: RouteTable.profileRoute.ownSubmission,
          icon: null,
      },
  ];
  
    const rootSegment = current.split("/") [1];
  
    switch (rootSegment) {
      case RouteTable.authRoute.root:
        return authRoutes;
      case RouteTable.profileRoute.root:
        return profileRoutes;
      default:
        return defaultRoutes;
    }
  
    
  }