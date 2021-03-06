import PoetryManagement from "../../pages/PoetryManagement/PoetryManagement";
import WriterManagement from "../../pages/WriterManagement/WriterManagement";
import PoetryMustLearn from "../../pages/PoetryMustLearn/PoetryMustLearn";

import PoetrySearch from "../../pages/PoetrySearch/PoetrySearch";
import LearningCenter from "../../pages/LearningCenter/LearningCenter";
import PoetryLearningSet from "../../pages/PoetryLearningSet/PoetryLearningSet";
import FavoritePoetry from "../../pages/FavoritePoetry/FavoritePoetry";
import PersonalSetting from "../../pages/PersonalSetting/PersonalSetting";

// 管理员的菜单

export const POETRY_MANAGEMENT = "/poetryManagement";
export const WRITER_MANAGEMENT = "/writerManagement";
export const POETRY_MUST_LEARN = "/poetryMustLearn";

export const MENU_ADMIN = [
    {
        key: POETRY_MANAGEMENT,
        title: "诗词管理",
        component: PoetryManagement,
    },
    {
        key: WRITER_MANAGEMENT,
        title: "作者管理",
        component: WriterManagement,

    },
    {
        key: POETRY_MUST_LEARN,
        title: "必学篇目",
        component: PoetryMustLearn,
    },
];


// 用户的菜单
export const POETRY_SEARCH = '/poetrySearch'
export const LEARNING_CENTER = '/learningCenter'
export const POETRY_LEARNING_SET = '/poetryLearningSet'
export const FAVORITE_POETRY = '/favoritePoetry'
export const PERSONAL_SETTING = '/personalSetting'


export const MENU_USER = [
    {
        key: POETRY_SEARCH,
        title: "诗词搜索",
        component: PoetrySearch,
    },
    {
        key: LEARNING_CENTER,
        title: "学习中心",
        component: LearningCenter,
    },
    {
        key: POETRY_LEARNING_SET,
        title: "学习集",
        component: PoetryLearningSet,
    },
    {
        key: FAVORITE_POETRY,
        title: "收藏夹",
        component: FavoritePoetry,
    },

    {
        key: PERSONAL_SETTING,
        title: "个人设置",
        component: PersonalSetting,
    }
];


