import { POETRY_LEARNING } from "../Components/Menu/menuConstants";

export default {
    getPoetryLearningPoetryUrl: (poetry_id) => {
        return `${POETRY_LEARNING}?_id=${poetry_id}`
    },
    getPoetryLearningWriterUrl: (writer) => {
        return `${POETRY_LEARNING}?writer=${writer}`
    }
}

