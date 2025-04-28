<template>
    <div class="min-h-dvh flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div class="card bg-white w-full sm:w-[32rem] shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
            <!-- Progress Bar -->
            <div class="h-2 bg-gray-200">
                <div class="h-full bg-blue-500 transition-all duration-300" 
                     :style="{ width: progressPercentage }">
                </div>
            </div>

            <div class="p-6 sm:p-8">
                <!-- Timer and Question Counter -->
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-medium text-gray-600">Question {{ currentIndex + 1 }} of {{ quizStore.questions.length }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-lg font-semibold" :class="{ 'text-red-500': timeLeft < 10 }">{{ timeLeft }}s</span>
                    </div>
                </div>

                <div v-if="loading" class="flex flex-col items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p class="text-gray-600">Loading questions...</p>
                </div>

                <div v-else class="space-y-6">
                    <div v-if="currentQuestion" class="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                        <p class="text-lg sm:text-xl font-semibold text-gray-800 mb-6">{{ currentQuestion.question }}</p>
                        <div class="space-y-3">
                            <label v-for="option in currentQuestion.options" :key="option"
                                class="flex items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 cursor-pointer group">
                                <input type="radio" :name="'question-' + currentQuestion.qid" :value="option"
                                    v-model="selectedAnswer"
                                    class="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-400" />
                                <span class="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors duration-200">{{ option }}</span>
                            </label>
                        </div>
                    </div>

                    <button @click="submitAnswer"
                        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium 
                               hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 
                               shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!selectedAnswer">
                        {{ isLastQuestion ? 'Submit Quiz' : 'Next Question' }}
                    </button>

                    <p class="text-center text-xs text-gray-500 mt-4">Online Quiz Developed by JLT</p>
                </div>
            </div>
        </div>

        <!-- Results Modal -->
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div class="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-[90%] transform transition-all duration-300 scale-100">
                <div class="text-center space-y-6">
                    <h2 class="text-2xl font-bold text-gray-800">Quiz Results</h2>
                    <div class="relative">
                        <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                            <span class="text-4xl font-bold text-white">{{ quizStore.score }}/{{ quizStore.questions.length }}</span>
                        </div>
                    </div>
                    <p v-if="quizStore.score >= (quizStore.questions.length / 2)" 
                       class="text-xl font-semibold text-green-600 animate-bounce">
                        Congratulations! 🎉
                    </p>
                    <p v-else class="text-lg text-gray-600">
                        Keep practicing! You'll do better next time 💪
                    </p>
                    <router-link :to="{ name: 'home' }" @click.native="resetQuizData"
                        class="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200">
                        Back to Home
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Warning Modal -->
        <div v-if="showWarning" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div class="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-[90%] transform transition-all duration-300 scale-100">
                <div class="text-center space-y-4">
                    <div class="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 class="text-xl font-semibold text-gray-800">Please Select an Answer</h2>
                    <p class="text-gray-600">You need to choose an option before proceeding to the next question.</p>
                    <button @click="closeWarning"
                        class="mt-4 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import { useQuizStore } from '../stores/quiz';
import { useRouter } from 'vue-router';

interface Question {
    qid: string;
    question: string;
    options: string[];
}

export default defineComponent({
    name: 'CollegeQuizView',
    setup() {
        const router = useRouter();
        const quizStore = useQuizStore();
        const loading = ref<boolean>(true);
        const currentIndex = ref<number>(0);
        const selectedAnswer = ref<string | null>(null);
        const showModal = ref<boolean>(false);
        const showWarning = ref<boolean>(false);
        const timeLeft = ref<number>(45);
        let timer: number | null = null;

        const currentQuestion = computed<Question | undefined>(() => quizStore.questions[currentIndex.value]);
        const isLastQuestion = computed<boolean>(() => currentIndex.value === quizStore.questions.length - 1);
        const progressPercentage = computed<string>(() => 
            `${((currentIndex.value + 1) / quizStore.questions.length) * 100}%`
        );

        const shuffleArray = <T>(array: T[]): T[] => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        const fetchQuestions = async (): Promise<void> => {
            try {
                await quizStore.fetchQuestions();
                quizStore.questions = shuffleArray(quizStore.questions);
                loading.value = false;
                startTimer();
            } catch (error) {
                console.error('Error fetching questions:', error);
                loading.value = false;
            }
        };

        const startTimer = (): void => {
            timeLeft.value = 45;
            if (timer) clearInterval(timer);
            timer = window.setInterval(() => {
                if (timeLeft.value > 0) {
                    timeLeft.value--;
                } else {
                    clearInterval(timer!);
                    proceedToNextQuestion();
                }
            }, 1000);
        };

        const proceedToNextQuestion = async (): Promise<void> => {
            if (selectedAnswer.value && currentQuestion.value) {
                await quizStore.submitAnswer(currentQuestion.value.qid, selectedAnswer.value);
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

        const submitAnswer = async (): Promise<void> => {
            if (!selectedAnswer.value) {
                showWarning.value = true;
                return;
            }

            if (currentQuestion.value) {
                await quizStore.submitAnswer(currentQuestion.value.qid, selectedAnswer.value);
                selectedAnswer.value = null;
                
                if (isLastQuestion.value) {
                    await quizStore.submitQuiz();
                    showModal.value = true;
                } else {
                    currentIndex.value++;
                    startTimer();
                }
            }
        };

        const closeModal = (): void => {
            showModal.value = false;
        };

        const closeWarning = (): void => {
            showWarning.value = false;
        };

        const resetQuizData = (): void => {
            quizStore.questions = [];
            quizStore.answers = {};
            quizStore.score = 0;
            quizStore.name = '';
            quizStore.section = '';
            currentIndex.value = 0;
            selectedAnswer.value = null;
            showModal.value = false;
            showWarning.value = false;
            if (timer) clearInterval(timer);
        };

        // Watch for route changes to reset quiz data
        watch(() => router.currentRoute.value.name, (newRoute) => {
            if (newRoute === 'home') {
                resetQuizData();
            }
        });

        // Cleanup on component unmount
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
            timeLeft,
            progressPercentage
        };
    }
});
</script>

<style scoped>
/* Add any component-specific styles here */
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
    transform: translateY(-2px);
}

/* Add smooth transitions for all interactive elements */
button, .option-label {
    transition: all 0.2s ease-in-out;
}

/* Add focus styles for accessibility */
button:focus, input:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Add reduced motion media query for accessibility */
@media (prefers-reduced-motion: reduce) {
    .card, button, .option-label {
        transition: none;
    }
}
</style>