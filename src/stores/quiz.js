import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDatabase, ref as dbRef, get, push, serverTimestamp } from 'firebase/database'
import app from '../firebase'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [],
    answers: {},
    score: 0,
    name: '',
    section: '',
    results: [],
    isLoading: false,
    error: null
  }),

  getters: {
    totalQuestions: (state) => state.questions.length,
    answeredQuestions: (state) => Object.keys(state.answers).length,
    isQuizComplete: (state) => Object.keys(state.answers).length === state.questions.length,
    scorePercentage: (state) => (state.score / state.questions.length) * 100,
    currentQuestion: (state) => (index) => state.questions[index],
    userAnswer: (state) => (questionId) => state.answers[questionId]
  },

  actions: {
    async fetchResults() {
      this.isLoading = true;
      this.error = null;
      try {
        const db = getDatabase(app);
        const resultsRef = dbRef(db, 'results');
        const snapshot = await get(resultsRef);
        
        if (snapshot.exists()) {
          this.results = Object.values(snapshot.val());
        }
      } catch (error) {
        this.error = 'Failed to fetch results';
        console.error('Error fetching results:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchQuestions() {
      this.isLoading = true;
      this.error = null;
      try {
        const db = getDatabase(app);
        const questionsRef = dbRef(db, 'questions');
        const snapshot = await get(questionsRef);
        
        if (snapshot.exists()) {
          this.questions = Object.values(snapshot.val());
        } else {
          this.questions = [];
          this.error = 'No questions found';
        }
      } catch (error) {
        this.error = 'Failed to fetch questions';
        console.error('Error fetching questions:', error);
        this.questions = [];
      } finally {
        this.isLoading = false;
      }
    },

    submitAnswer(questionId, answer) {
      if (!this.questions.find(q => q.qid === questionId)) {
        throw new Error('Invalid question ID');
      }
      this.answers[questionId] = answer;
    },

    calculateScore() {
      this.score = this.questions.reduce((score, question) => {
        return this.answers[question.qid] === question.correctAnswer ? score + 1 : score;
      }, 0);
    },

    async submitQuiz() {
      if (!this.name || !this.section) {
        throw new Error('Name and section are required');
      }

      if (!this.isQuizComplete) {
        throw new Error('Please answer all questions before submitting');
      }

      this.isLoading = true;
      this.error = null;
      
      try {
        this.calculateScore();
        const db = getDatabase(app);
        const resultsRef = dbRef(db, 'results');
        
        const quizResult = {
          name: this.name,
          section: this.section,
          score: this.score,
          totalQuestions: this.questions.length,
          questions: this.questions.map(q => ({
            text: q.question,
            correctAnswer: q.correctAnswer,
            userAnswer: this.answers[q.qid]
          })),
          createdAt: serverTimestamp()
        };
        
        await push(resultsRef, quizResult);
        this.results.push(quizResult);
      } catch (error) {
        this.error = 'Failed to submit quiz';
        console.error('Error saving quiz results:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    resetQuiz() {
      this.answers = {};
      this.score = 0;
      this.name = '';
      this.section = '';
      this.error = null;
    }
  }
});