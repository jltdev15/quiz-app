import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import apiClient from '../axiosClient';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [],
    answers: {},
    score: 0,
    name: '',
    section: '',
    results: []
  }),
  actions: {
    async fetchResults() {
      const response = await apiClient.get('/results/results');
      this.results = response.data;
    },
    async fetchQuestions() {
      const response = await apiClient.get('/questions');
      this.questions = response.data;
    },
    submitAnswer(questionId, answer) {
      this.answers[questionId] = answer;
      console.log('Submitted answers:', this.answers); // Debug log
    },
    calculateScore() {
      this.score = this.questions.reduce((score, question) => {
        console.log('Checking question:', question); // Debug log
        console.log('User answer:', this.answers[question.qid]); // Debug log
        console.log('Correct answer:', question.correctAnswer); // Debug log
        if (this.answers[question.qid] === question.correctAnswer) {
          return score + 1;
        }
        return score;
      }, 0);
      console.log('Calculated score:', this.score); // Debug log
    },
    async submitQuiz() {
      this.calculateScore();
      const response = await apiClient.post('/results', {
        name: this.name,
        sections: this.section,
        questions: this.questions.map(q => ({
          text: q.question,
          correctAnswer: q.correctAnswer,
          userAnswer: this.answers[q.qid]
        })),
        score: this.score
      });
      console.log('Submitted score:', this.score); // Debug log
      this.score = response.data.score;
    }
  }
});