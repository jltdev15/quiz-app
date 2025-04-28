<script setup>
import { ref, onMounted } from 'vue';
import { getDatabase, ref as dbRef, push, get, query, orderByChild, limitToLast } from 'firebase/database';
import app from '../firebase';

const db = getDatabase(app);
const qid = ref(null);
const question = ref('');
const options = ref(['']);
const correctAnswer = ref('');

const fetchQuestionCount = async () => {
  try {
    const questionsRef = dbRef(db, 'questions');
    const q = query(questionsRef, orderByChild('qid'), limitToLast(1));
    const snapshot = await get(q);
    
    if (snapshot.exists()) {
      const lastQuestion = Object.values(snapshot.val())[0];
      qid.value = lastQuestion.qid + 1;
    } else {
      qid.value = 1;
    }
  } catch (error) {
    console.error('Error fetching question count:', error);
  }
};

const submitQuestion = async () => {
  try {
    const newQuestion = {
      qid: qid.value,
      question: question.value,
      options: options.value,
      correctAnswer: correctAnswer.value
    };
    
    await push(dbRef(db, 'questions'), newQuestion);
    alert('Question submitted successfully!');
    // Reset form
    qid.value += 1;
    question.value = '';
    options.value = [''];
    correctAnswer.value = '';
  } catch (error) {
    console.error('Error submitting question:', error);
    alert('Failed to submit question.');
  }
};

onMounted(() => {
  fetchQuestionCount();
});
</script>

<template>
  <div class="flex h-dvh flex-col justify-center items-center max-w-3xl mx-auto p-6  rounded-lg ">
    <div class="p-6 bg-white shadow-lg rounded-xl border border-gray-200 w-full max-w-md mx-auto">
      <input v-model="qid" type="number" placeholder="Question ID" class="w-full p-2 mb-2 border rounded" readonly />
      <input v-model="question" type="text" placeholder="Enter Question" class="w-full p-2 mb-2 border rounded" />
      <div v-for="(option, index) in options" :key="index" class="flex items-center space-x-3 mb-2">
        <input v-model="options[index]" type="text" placeholder="Option" class="w-full p-2 border rounded" />
        <button @click="options.splice(index, 1)" class="p-2 bg-red-500 text-white rounded">Remove</button>
      </div>
      <button @click="options.push('')" class="w-full p-2 bg-blue-500 text-white rounded mb-2">Add Option</button>
      <input v-model="correctAnswer" type="text" placeholder="Correct Answer" class="w-full p-2 mb-2 border rounded" />
      <button @click="submitQuestion" class="w-full p-2 bg-green-500 text-white rounded mt-4">Submit Question</button>
    </div>
  </div>

</template>