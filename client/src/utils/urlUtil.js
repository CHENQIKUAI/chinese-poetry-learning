import { LEARNING_CENTER } from "../Components/Menu/menuConstants";

export default {
    getPoetryLearningPoetryUrl: (poetry_id) => {
        return `${LEARNING_CENTER}?_id=${poetry_id}`
    },
    getPoetryLearningWriterUrl: (writer) => {
        return `${LEARNING_CENTER}?writer=${writer}`
    }
}

