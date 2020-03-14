export const nameLabel = "昵称"
export const nameField = "username";
export const nameRequiredMessage = "请输入昵称";
export const namePlaceholder = "请输入昵称";

export const passwordLabel = "密码"
export const passwordField = "password";
export const passwordRequiredMessage = "请输入密码";
export const passwordPlaceholder = "请输入密码";

export const passwordConfirmLable = "确认密码";
export const passwordConfirmField = "passwordConfirm";
export const passwordConfirmRequiredMessage = "请输入密码";
export const passwordConfirmPlaceholder = "请输入密码";

export const typeLabel = "类型"
export const typeField = "type"

export const typeArray = [
    {
        name: "学生",
        value: 1,
    },
    {
        name: "管理员",
        value: 0
    }
]


export const gradeLabel = "年级";
export const gradeField = "grade";
export const gradeRequireMessage = "请选择年级";

export const gradeOptions = [
    {
        label: "小学",
        value: "A",
        children: [
            {
                label: "一年级",
                value: 1,
            },
            {
                label: "二年级",
                value: 2,
            },
            {
                label: "三年级",
                value: 3,
            },
            {
                label: "四年级",
                value: 4,
            },
            {
                label: "五年级",
                value: 5,
            },
            {
                label: "六年级",
                value: 6,
            }
        ]
    },
    {
        label: "初中",
        value: "B",
        children: [
            {
                label: "初一",
                value: 7,
            },
            {
                label: "初二",
                value: 8,
            }
            ,
            {
                label: "初三",
                value: 9,
            }
        ]
    },
    {
        label: "高中",
        value: "C",
        children: [
            {
                label: "高一",
                value: 10,
            },
            {
                label: "高二",
                value: 11,
            },
            {
                label: "高三",
                value: 12
            }
        ]
    },
    {
        label: '其他',
        value: 'D'
    }
]

export const getGradeOptions = (grade) => {
    if (grade === null) {
        return ['D'];
    } else if (grade <= 6) {
        return ['A', grade];
    } else if (grade <= 9) {
        return ['B', grade];
    } else if (grade <= 12) {
        return ['C', grade];
    }
}

export const submitName = "注册"

export const SIGNUP_SUCCESS_MESSAGE = "注册成功，已登录!"