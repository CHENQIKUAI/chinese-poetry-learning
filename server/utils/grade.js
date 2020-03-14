function getFirstGradeYear(grade) {
    if (!grade) {
        return null;
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let year_first_grade;
    if (month > 9) {
        year_first_grade = year - grade + 1;
    } else {
        year_first_grade = year - grade;
    }
    return year_first_grade;
}

function getGrade(year_first_grade) {
    if (!year_first_grade) {
        return null;
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return year - year_first_grade + (month >= 9 && month <= 12 ? 1 : 0);
}

function getGradeSemester(grade) {
    const d = new Date();
    const month = d.getMonth() + 1;
    if (month >= 9 || month < 3) {
        return `${grade},1`
    } else {
        return `${grade},2`
    }
}

module.exports = {
    getFirstGradeYear,
    getGrade,
    getGradeSemester
}