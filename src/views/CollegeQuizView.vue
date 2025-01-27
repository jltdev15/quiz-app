<template>
    <div class="flex h-dvh flex-col justify-center items-center max-w-3xl mx-auto p-6 shadow-md rounded-lg">
        <div class="card bg-gray-50 w-[32rem] shadow-xl px-6 py-9 rounded-lg">
            <div class="text-right  mb-4">
                <p class="text-white px-4 py-2 rounded-lg bg-green-600 inline-block">Time left: {{ timeLeft }} seconds
                </p>
            </div>
            <div v-if="loading" class="text-center text-gray-500">Loading questions...</div>
            <div v-else>
                <div v-if="currentQuestion" class="mb-6 p-4 border rounded-lg shadow-sm">
                    <p class="text-lg font-semibold">{{ currentQuestion.question }}</p>
                    <div class="mt-2 space-y-2">
                        <label v-for="option in currentQuestion.options" :key="option"
                            class="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" :name="'question-' + currentQuestion.qid" :value="option"
                                v-model="selectedAnswer"
                                class="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-400" />
                            <span class="text-gray-700">{{ option }}</span>
                        </label>
                    </div>

                </div>
                <button @click="submitAnswer"
                    class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                    {{ isLastQuestion ? 'Submit' : 'Next' }}
                </button>
                <p class="p-6 text-sm text-red-600 text-justify">Note when you press the Next Button, your answer will
                    automatically
                    recorded. Dapat sigurado sya sayo este sigurado ka sa sagot mo bago mo pindutin ang Next Button.
                    Good Luck!</p>
                <p class="text-center  font-medium p-3 text-xs">Online Quiz Develop by JLT</p>
            </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="bg-white relative p-6 rounded-lg h-[50dvh] shadow-lg max-w-md">
                <h2 class="text-xl font-bold mb-4 text-center">Results</h2>
                <div class="text-center">
                    <p class="text-center text-2xl p-3">You've got a </p>
                    <p class="text-5xl font-bold text-center py-6">{{ quizStore.score }} out of {{
                        quizStore.questions.length }}</p>
                    <p class="bg-green-600 text-gray-50 p-3 rounded-2xl my-3 text-3xl inline-block"
                        v-if="quizStore.score >= (quizStore.questions.length / 2)">
                        You're Amazing!
                    </p>
                    <p v-if="quizStore.score < (quizStore.questions.length / 2)">Go get better!</p>
                </div>
                <p class="text-center text-xs">Thank you for taking the quiz.</p>
                <div class="flex justify-center p-3">
                    <router-link :to="{ name: 'home' }" @click.native="resetQuizData"
                        class="mt-4 inline-block text-center bottom-4 absolute  text-gray-900 w-32  mx-auto rounded-lg underline">Back
                        to Home</router-link>
                </div>

            </div>
        </div>

        <div v-if="showWarning" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <h2 class="text-xl font-bold mb-4">Warning</h2>
                <p class="text-lg">Please select an answer before proceeding.</p>
                <button @click="closeWarning"
                    class="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, computed, watch } from 'vue';
import { useQuizStore } from '../stores/quiz';

export default {
    setup() {
        const quizStore = useQuizStore();
        const loading = ref(true);
        const currentIndex = ref(0);
        const selectedAnswer = ref(null);
        const showModal = ref(false);
        const showWarning = ref(false);
        const timeLeft = ref(30); // Set the timer duration in seconds
        let timer = null;

        const currentQuestion = computed(() => quizStore.questions[currentIndex.value]);
        const isLastQuestion = computed(() => currentIndex.value === quizStore.questions.length - 1);

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const fetchQuestions = async () => {
            await quizStore.fetchQuestions();
            quizStore.questions = shuffleArray(quizStore.questions);
            loading.value = false;
            startTimer();
        };

        const startTimer = () => {
            timeLeft.value = 30; // Reset the timer duration
            if (timer) clearInterval(timer);
            timer = setInterval(() => {
                if (timeLeft.value > 0) {
                    timeLeft.value--;
                } else {
                    clearInterval(timer);
                    proceedToNextQuestion();
                }
            }, 1000);
        };

        const proceedToNextQuestion = async () => {
            if (selectedAnswer.value) {
                quizStore.submitAnswer(currentQuestion.value.qid, selectedAnswer.value);
                selectedAnswer.value = null;
            }
            if (isLastQuestion.value) {
                await quizStore.submitQuiz();
                showModal.value = true;
            } else {
                currentIndex.value++;
                startTimer();
            }
        };

        const submitAnswer = async () => {
            if (selectedAnswer.value) {
                quizStore.submitAnswer(currentQuestion.value.qid, selectedAnswer.value);
                selectedAnswer.value = null;
                if (isLastQuestion.value) {
                    await quizStore.submitQuiz();
                    showModal.value = true;
                } else {
                    currentIndex.value++;
                    startTimer();
                }
            } else {
                showWarning.value = true;
            }
        };

        const closeModal = () => {
            showModal.value = false;
        };

        const closeWarning = () => {
            showWarning.value = false;
        };

        const resetQuizData = () => {
            quizStore.questions = [];
            quizStore.answers = {};
            quizStore.score = 0;
            quizStore.name = '';
            quizStore.section = '';
            currentIndex.value = 0;
            selectedAnswer.value = null;
            showModal.value = false;
            showWarning.value = false;
            clearInterval(timer);
        };

        onMounted(() => {
            fetchQuestions();
        });

        return {
            quizStore,
            loading,
            currentQuestion,
            currentIndex,
            selectedAnswer,
            submitAnswer,
            showModal,
            closeModal,
            showWarning,
            closeWarning,
            resetQuizData,
            isLastQuestion,
            timeLeft
        };
    }
};
</script>